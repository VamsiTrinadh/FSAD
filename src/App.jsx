import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from './config/firebase';
import { INITIAL_EVENTS } from './data/events';
import EventsList from './components/EventsList';
import EventDetails from './components/EventDetails';
import BookingForm from './components/BookingForm';
import Confirmation from './components/Confirmation';
import PaymentScanner from './components/PaymentScanner';
import { AdminPortal, AdminLogin } from './components/AdminPortal';
import HeroCarousel from './components/HeroCarousel';
import SkeletonLoader from './components/SkeletonLoader';
import { sendBookingConfirmationEmail } from './utils/emailService';
import './App.css';

// view: 'list' | 'booking' | 'payment' | 'confirmed' | 'admin'
function App() {
  const [view, setView] = useState('list');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null); // null | 'sending' | 'sent' | 'error'
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'
  const [isLoading, setIsLoading] = useState(true);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Real-time Firebase Syncing
  useEffect(() => {
    // 1. Subscribe to events
    const unsubscribeEvents = onSnapshot(collection(db, 'events'), async (snapshot) => {
      if (snapshot.empty) {
        // Auto-seed data on first connect!
        const batch = writeBatch(db);
        INITIAL_EVENTS.forEach(ev => {
          const docRef = doc(db, 'events', ev.id.toString());
          batch.set(docRef, ev);
        });
        await batch.commit();
        // It will trigger onSnapshot again after seed
        return;
      }

      const eventsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      // Sort events by ID or keep original logic
      eventsData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      setEvents(eventsData);
      setIsLoading(false);

      // Update selected event if it's currently selected to keep it fresh
      setSelectedEvent((currentSelected) => {
        if (!currentSelected) return null;
        return eventsData.find(e => e.id.toString() === currentSelected.id.toString()) || currentSelected;
      });
    });

    // 2. Subscribe to bookings
    const unsubscribeBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => doc.data());
      setBookings(bookingsData);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeBookings();
    };
  }, []);

  /* ── User Flow ── */
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setView('booking');
  };

  const handleBookingSuccess = async (formData) => {
    // Generate unique reference ID
    const referenceId = '#' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const enrichedData = { ...formData, referenceId };

    console.log("Instant booking - bypassing payment verification:", referenceId);
    setBookingData(enrichedData);
    setView('confirmed'); // Show ticket immediately

    try {
      // 1. Write the new booking to Firestore
      const bookingRef = doc(collection(db, 'bookings'));
      await setDoc(bookingRef, enrichedData);
      console.log("Booking document created successfully");

      // 2. Deduct tickets from that event in Firestore
      const eventRef = doc(db, 'events', formData.eventId.toString());
      const actualEvent = events.find(e => e.id.toString() === formData.eventId.toString());
      if (actualEvent) {
        await updateDoc(eventRef, {
          availableTickets: Math.max(0, actualEvent.availableTickets - formData.tickets)
        });
        console.log("Event tickets deducted successfully");
      }

      setEmailStatus('sending');
      // Send confirmation email (Optional)
      try {
        const result = await sendBookingConfirmationEmail({
          name: formData.name,
          email: formData.email,
          department: formData.department,
          eventName: formData.eventName,
          eventDate: selectedEvent ? `${selectedEvent.date}, ${selectedEvent.time}` : '',
          eventVenue: selectedEvent ? selectedEvent.venue : '',
          tickets: formData.tickets,
          price: formData.price,
          referenceId,
        });
        setEmailStatus(result.success ? result.method : 'error');
      } catch (emailErr) {
        console.warn("Email service failed:", emailErr);
        setEmailStatus('error');
      }
    } catch (dbErr) {
      console.error("Firebase Database Error:", dbErr);
      alert("Error saving booking. However, your ticket UI is shown. Please screenshot it.");
      setEmailStatus('error');
    }
  };

  // Deprecated: No longer used as we bypass payment scanner
  const handlePaymentSuccess = () => { };

  const handleBackToList = () => {
    setSelectedEvent(null);
    setBookingData(null);
    setView('list');
  };

  /* ── Admin Flow ── */
  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
    setView('admin');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setView('list');
  };

  /* ── Admin Event Operations ── */
  const handleUpdateEvent = async (id, changes) => {
    try {
      await updateDoc(doc(db, 'events', id.toString()), changes);
    } catch (err) {
      console.error("Failed to update event:", err);
      alert("Error updating event in Firebase");
    }
  };

  const handleAddEvent = async (newEvent) => {
    try {
      const maxId = events.reduce((max, e) => Math.max(max, parseInt(e.id, 10) || 0), 0);
      const newId = maxId + 1;
      const eventToSave = { ...newEvent, id: newId };
      await setDoc(doc(db, 'events', newId.toString()), eventToSave);
    } catch (err) {
      console.error("Failed to add event:", err);
      alert("Error adding event to Firebase");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteDoc(doc(db, 'events', id.toString()));
      } catch (err) {
        console.error("Failed to delete event:", err);
        alert("Error deleting event in Firebase");
      }
    }
  };

  /* ── Render ── */
  return (
    <div className="app-wrapper">
      {/* ── Top Nav ── */}
      <nav className="app-nav">
        <div className="nav-inner">
          <button className="nav-logo" onClick={handleBackToList}>
            🎓 <span>EventHub</span>
          </button>
          <div className="nav-date" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginRight: 'auto', marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
            📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="nav-links">
            {view !== 'list' && view !== 'admin' && (
              <button className="nav-back-btn" onClick={handleBackToList}>
                ← All Events
              </button>
            )}
            <button
              className="nav-admin-btn"
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              style={{ padding: '6px 12px', fontSize: '16px' }}
              title="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {!isAdmin && (
              <button
                className="nav-admin-btn"
                id="admin-login-btn"
                onClick={() => setShowAdminLogin(true)}
              >
                ⚙️ Admin
              </button>
            )}
            {isAdmin && (
              <button
                className={`nav-admin-btn ${view === 'admin' ? 'nav-admin-active' : ''}`}
                onClick={() => setView('admin')}
              >
                ⚙️ Portal
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Admin Login Modal ── */}
      {showAdminLogin && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {/* ── Admin Portal ── */}
      {view === 'admin' && isAdmin && (
        <main className="admin-wrapper animate-page-in">
          <AdminPortal
            events={events}
            bookings={bookings}
            onUpdateEvent={handleUpdateEvent}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onLogout={handleAdminLogout}
          />
        </main>
      )}

      {/* ── Events List ── */}
      {view === 'list' && (
        <>
          <HeroCarousel events={events} />
          <main className="main-list-wrapper animate-page-in">
            {isLoading ? (
              <SkeletonLoader />
            ) : events.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px", color: "white" }}>
                <h2>No events available.</h2>
                <p>Check back later or contact admin.</p>
              </div>
            ) : (
              <EventsList events={events} onSelectEvent={handleSelectEvent} />
            )}
          </main>
        </>
      )}

      {/* ── Booking Page ── */}
      {(view === 'booking' || view === 'payment' || view === 'confirmed') && selectedEvent && (
        <>
          <div className="booking-page-header" style={{ background: selectedEvent.gradient }}>
            <button className="back-breadcrumb" onClick={handleBackToList}>← All Events</button>
            <h1 className="booking-page-title">{selectedEvent.name}</h1>
            <p className="booking-page-sub">{selectedEvent.tag} · {selectedEvent.date}</p>
          </div>
          <main className="main-grid animate-page-in">
            <section className="grid-left">
              <EventDetails event={(view === 'booking' || view === 'payment') ? selectedEvent : { ...selectedEvent, availableTickets: selectedEvent.availableTickets }} />
            </section>
            <section className="grid-right">
              {view === 'booking' && (
                <BookingForm
                  event={selectedEvent}
                  onBookingSuccess={handleBookingSuccess}
                />
              )}
              {view === 'payment' && (
                <PaymentScanner
                  bookingData={bookingData}
                  event={selectedEvent}
                  onVerifySuccess={handlePaymentSuccess}
                  onCancel={handleBackToList}
                />
              )}
              {view === 'confirmed' && (
                <Confirmation
                  formData={bookingData}
                  emailStatus={emailStatus}
                  onReset={handleBackToList}
                />
              )}
            </section>
          </main>
        </>
      )}

      {/* ── Footer ── */}
      {view !== 'admin' && (
        <footer className="app-footer">
          <p>© 2025 EventHub &nbsp;·&nbsp; Department of CSE &nbsp;·&nbsp; All rights reserved</p>
        </footer>
      )}
    </div>
  );
}

export default App;
