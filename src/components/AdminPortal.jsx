import React, { useState } from 'react';

const ADMIN_PASSWORD = 'Admin@2025';

/* ── Stat Card ──────────────── */
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-icon" style={{ background: color + '22', color }}>{icon}</div>
      <div className="stat-body">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}

/* ── Dashboard Tab ──────────── */
function DashboardTab({ events, bookings }) {
  const totalRevenue = bookings.reduce((s, b) => s + b.tickets * b.price, 0);
  const totalTicketsSold = bookings.reduce((s, b) => s + b.tickets, 0);
  const openEvents = events.filter((e) => e.availableTickets > 0).length;

  const catCounts = events.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {});
  const maxCat = Math.max(...Object.values(catCounts));

  return (
    <div className="admin-tab-content">
      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard icon="📅" label="Total Events" value={events.length} sub={`${openEvents} open`} color="#0f3460" />
        <StatCard icon="🎟️" label="Total Bookings" value={bookings.length} sub={`${totalTicketsSold} tickets sold`} color="#e94560" />
        <StatCard icon="💰" label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} sub="All events combined" color="#2e7d32" />
        <StatCard icon="🌐" label="External Events" value={events.filter(e => e.type === 'outside').length} sub={`${events.filter(e => e.type === 'college').length} college events`} color="#7b1fa2" />
      </div>

      <div className="dash-bottom-grid">
        {/* Category Distribution */}
        <div className="admin-card">
          <h3 className="admin-card-title">📊 Events by Category</h3>
          <div className="cat-bars">
            {Object.entries(catCounts).map(([cat, count]) => (
              <div key={cat} className="cat-bar-row">
                <span className="cat-bar-label">{cat}</span>
                <div className="cat-bar-track">
                  <div className="cat-bar-fill" style={{ width: `${(count / maxCat) * 100}%` }} />
                </div>
                <span className="cat-bar-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="admin-card">
          <h3 className="admin-card-title">🕒 Recent Bookings</h3>
          {bookings.length === 0 ? (
            <p className="empty-state-text">No bookings yet.</p>
          ) : (
            <div className="recent-bookings-list">
              {[...bookings].reverse().slice(0, 5).map((b, i) => (
                <div className="recent-booking-item" key={i}>
                  <div className="rb-avatar">{b.name[0].toUpperCase()}</div>
                  <div className="rb-info">
                    <p className="rb-name">{b.name}</p>
                    <p className="rb-event">{b.eventName}</p>
                  </div>
                  <div className="rb-amount">₹{b.tickets * b.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Events Quick View */}
      <div className="admin-card">
        <h3 className="admin-card-title">🎯 Events Ticket Status</h3>
        <div className="events-status-table">
          <div className="status-table-header">
            <span>Event</span><span>Type</span><span>Price</span><span>Sold</span><span>Available</span><span>Status</span>
          </div>
          {events.map((e) => {
            const sold = e.totalTickets - e.availableTickets;
            return (
              <div className="status-table-row" key={e.id}>
                <span className="status-row-name">{e.emoji} {e.name.split('—')[0].trim()}</span>
                <span><span className={`mini-badge ${e.type === 'college' ? 'badge-college' : 'badge-outside'}`}>{e.type}</span></span>
                <span>₹{e.price}</span>
                <span>{sold}</span>
                <span>{e.availableTickets}</span>
                <span>
                  <span className={`mini-status ${e.availableTickets > 0 ? 'status-open' : 'status-sold-out'}`}>
                    {e.availableTickets > 0 ? '● Open' : '● Sold Out'}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Events Management Tab ──── */
function EventsTab({ events, onUpdateEvent, onAddEvent, onDeleteEvent }) {
  const emptyForm = {
    name: '', type: 'college', category: 'Technical', department: '',
    date: '', time: '', venue: '', price: '', totalTickets: '', description: '',
    emoji: '🎓', gradient: 'linear-gradient(135deg, #0f3460, #16213e)', tag: '',
  };
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editTickets, setEditTickets] = useState({});

  const handleFormChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = parseInt(form.totalTickets);
    const newEvent = {
      ...form,
      id: Date.now(),
      price: parseInt(form.price),
      totalTickets: total,
      availableTickets: total,
    };
    onAddEvent(newEvent);
    setForm(emptyForm);
    setShowAddForm(false);
  };

  const handleTicketEdit = (id, val) => {
    setEditTickets((p) => ({ ...p, [id]: val }));
  };

  const applyTicketEdit = (event) => {
    const newVal = parseInt(editTickets[event.id]);
    if (!isNaN(newVal) && newVal >= 0 && newVal <= event.totalTickets) {
      onUpdateEvent(event.id, { availableTickets: newVal });
      setEditingId(null);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="tab-toolbar">
        <h3 className="tab-section-title">All Events ({events.length})</h3>
        <button className="btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancel' : '+ Add New Event'}
        </button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <div className="admin-card add-event-card">
          <h3 className="admin-card-title">➕ Add New Event</h3>
          <form onSubmit={handleSubmit} className="add-event-form">
            <div className="ae-grid">
              <div className="form-group">
                <label className="form-label">Event Name *</label>
                <input name="name" value={form.name} onChange={handleFormChange} required className="form-input" placeholder="e.g. CodeSprint 2025" />
              </div>
              <div className="form-group">
                <label className="form-label">Emoji Icon</label>
                <input name="emoji" value={form.emoji} onChange={handleFormChange} className="form-input" placeholder="🎓" />
              </div>
              <div className="form-group">
                <label className="form-label">Event Type *</label>
                <select name="type" value={form.type} onChange={handleFormChange} className="form-input form-select">
                  <option value="college">College Event</option>
                  <option value="outside">Outside Event</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="category" value={form.category} onChange={handleFormChange} className="form-input form-select">
                  {['Technical','Cultural','Conference','Workshop','Sports','Academic','Entrepreneurship'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department / Organizer *</label>
                <input name="department" value={form.department} onChange={handleFormChange} required className="form-input" placeholder="e.g. CSE Department" />
              </div>
              <div className="form-group">
                <label className="form-label">Tag</label>
                <input name="tag" value={form.tag} onChange={handleFormChange} className="form-input" placeholder="e.g. National Event" />
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input name="date" value={form.date} onChange={handleFormChange} required className="form-input" placeholder="e.g. 25 April 2025" />
              </div>
              <div className="form-group">
                <label className="form-label">Time *</label>
                <input name="time" value={form.time} onChange={handleFormChange} required className="form-input" placeholder="e.g. 10:00 AM" />
              </div>
              <div className="form-group ae-full">
                <label className="form-label">Venue *</label>
                <input name="venue" value={form.venue} onChange={handleFormChange} required className="form-input" placeholder="e.g. Main Auditorium, Block A" />
              </div>
              <div className="form-group">
                <label className="form-label">Ticket Price (₹) *</label>
                <input name="price" type="number" value={form.price} onChange={handleFormChange} required className="form-input" placeholder="e.g. 150" />
              </div>
              <div className="form-group">
                <label className="form-label">Total Tickets *</label>
                <input name="totalTickets" type="number" value={form.totalTickets} onChange={handleFormChange} required className="form-input" placeholder="e.g. 100" />
              </div>
              <div className="form-group ae-full">
                <label className="form-label">Description *</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} required className="form-input" rows={3} placeholder="Brief description of the event…" />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-primary">➕ Add Event</button>
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Events Table */}
      <div className="admin-card">
        <div className="admin-events-list">
          {events.map((event) => (
            <div className="admin-event-row" key={event.id}>
              <div className="aer-left">
                <div className="aer-icon" style={{ background: event.gradient }}>{event.emoji}</div>
                <div className="aer-info">
                  <p className="aer-name">{event.name}</p>
                  <p className="aer-meta">
                    <span className={`mini-badge ${event.type === 'college' ? 'badge-college' : 'badge-outside'}`}>{event.type}</span>
                    <span>{event.category}</span>
                    <span>₹{event.price}</span>
                    <span>📅 {event.date}</span>
                  </p>
                </div>
              </div>
              <div className="aer-right">
                {editingId === event.id ? (
                  <div className="ticket-edit-inline">
                    <span className="form-label" style={{minWidth:'auto'}}>Available:</span>
                    <input
                      type="number"
                      className="form-input ticket-edit-input"
                      value={editTickets[event.id] ?? event.availableTickets}
                      onChange={(e) => handleTicketEdit(event.id, e.target.value)}
                      min="0"
                      max={event.totalTickets}
                    />
                    <button className="btn-primary btn-xs" onClick={() => applyTicketEdit(event)}>Save</button>
                    <button className="btn-secondary btn-xs" onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <>
                    <div className="aer-tickets">
                      <span className={`mini-status ${event.availableTickets > 0 ? 'status-open' : 'status-sold-out'}`}>
                        {event.availableTickets}/{event.totalTickets}
                      </span>
                    </div>
                    <button className="btn-secondary btn-xs" onClick={() => { setEditingId(event.id); setEditTickets((p) => ({ ...p, [event.id]: event.availableTickets })); }}>
                      ✏️ Edit Tickets
                    </button>
                    <button className="btn-danger btn-xs" onClick={() => onDeleteEvent(event.id)}>🗑️</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Bookings Tab ───────────── */
function BookingsTab({ bookings, events }) {
  const [search, setSearch] = useState('');

  const filtered = bookings.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.eventName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-tab-content">
      <div className="tab-toolbar">
        <h3 className="tab-section-title">All Bookings ({bookings.length})</h3>
        <input
          type="text"
          placeholder="Search by name, email or event…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input search-narrow"
        />
      </div>

      <div className="admin-card">
        {filtered.length === 0 ? (
          <div className="empty-booking-state">
            <p className="empty-state-icon">🎟️</p>
            <p className="empty-state-text">No bookings found{search ? ' for your search' : ' yet'}.</p>
          </div>
        ) : (
          <div className="bookings-table-wrap">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Event</th>
                  <th>Tickets</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {[...filtered].reverse().map((b, i) => (
                  <tr key={i}>
                    <td className="td-num">{filtered.length - i}</td>
                    <td><strong>{b.name}</strong></td>
                    <td className="td-email">{b.email}</td>
                    <td>{b.department}</td>
                    <td>
                      <span className="td-event-name">{b.eventName}</span>
                    </td>
                    <td className="td-center">{b.tickets}</td>
                    <td className="td-amount">₹{b.tickets * b.price}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-total-row">
                  <td colSpan={5}><strong>Total Revenue</strong></td>
                  <td className="td-center"><strong>{filtered.reduce((s, b) => s + b.tickets, 0)}</strong></td>
                  <td className="td-amount"><strong>₹{filtered.reduce((s, b) => s + b.tickets * b.price, 0).toLocaleString()}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Admin Portal (Main) ────── */
function AdminPortal({ events, bookings, onUpdateEvent, onAddEvent, onDeleteEvent, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const TABS = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'events', label: '📅 Events' },
    { id: 'bookings', label: '🎟️ Bookings' },
  ];

  return (
    <div className="admin-portal">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">⚙️</div>
          <div>
            <h2 className="admin-title">Admin Portal</h2>
            <p className="admin-subtitle">TechFest Event Management System</p>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout}>🔓 Logout</button>
      </div>

      {/* Tab Nav */}
      <div className="admin-tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab-btn ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <DashboardTab events={events} bookings={bookings} />
      )}
      {activeTab === 'events' && (
        <EventsTab
          events={events}
          onUpdateEvent={onUpdateEvent}
          onAddEvent={onAddEvent}
          onDeleteEvent={onDeleteEvent}
        />
      )}
      {activeTab === 'bookings' && (
        <BookingsTab bookings={bookings} events={events} />
      )}
    </div>
  );
}

/* ── Admin Login Modal ──────── */
function AdminLogin({ onLogin, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
      setError('');
    } else {
      setError('Incorrect password. Try Admin@2025');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-icon">🔐</div>
        <h2 className="modal-title">Admin Login</h2>
        <p className="modal-subtitle">Enter the admin password to access the portal</p>
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label className="form-label">Password</label>
            <div className="password-field-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-input ${error ? 'input-error' : ''}`}
                placeholder="Enter admin password"
                autoFocus
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {error && <p className="error-message">⚠ {error}</p>}
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-primary">🔓 Login</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
        <p className="login-hint">Hint: Admin@2025</p>
      </div>
    </div>
  );
}

export { AdminPortal, AdminLogin };
