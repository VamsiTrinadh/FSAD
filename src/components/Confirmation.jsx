import React from 'react';

function EmailStatusBanner({ status, email }) {
  if (!status || status === null) return null;

  const config = {
    sending: {
      icon: '⏳',
      text: `Sending confirmation to ${email}…`,
      cls: 'email-banner-sending',
    },
    emailjs: {
      icon: '✉️',
      text: `Confirmation email sent to ${email}`,
      cls: 'email-banner-sent',
    },
    mailto: {
      icon: '📬',
      text: `Email draft opened for ${email} — please click Send in your mail app`,
      cls: 'email-banner-mailto',
    },
    error: {
      icon: '⚠️',
      text: `Could not send email automatically. Please save this page as reference.`,
      cls: 'email-banner-error',
    },
  };

  const c = config[status];
  if (!c) return null;

  return (
    <div className={`email-status-banner ${c.cls}`}>
      <span className="email-banner-icon">{c.icon}</span>
      <p className="email-banner-text">{c.text}</p>
    </div>
  );
}

function VisualTicket({ formData }) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(formData.referenceId)}`;

  return (
    <div className="ticket-visual-container">
      <div className="ticket-main-box">
        {/* Left Side: Event Details */}
        <div className="ticket-details-side">
          <div className="ticket-event-type">EVENT PASS</div>
          <h2 className="ticket-event-name">{formData.eventName}</h2>

          <div className="ticket-info-row">
            <div className="ticket-info-col">
              <span className="info-label">DATE</span>
              <span className="info-val">{formData.eventDate || "Upcoming"}</span>
            </div>
            <div className="ticket-info-col">
              <span className="info-label">GATE</span>
              <span className="info-val">MAIN ENTRANCE</span>
            </div>
          </div>

          <div className="ticket-info-row">
            <div className="ticket-info-col">
              <span className="info-label">ATTENDEE</span>
              <span className="info-val">{formData.name}</span>
            </div>
            <div className="ticket-info-col">
              <span className="info-label">TICKETS</span>
              <span className="info-val">{formData.tickets} ADULT</span>
            </div>
          </div>

          <div className="ticket-footer-strip">
            <span>ADMIT ONE</span>
            <span>ID: {formData.referenceId}</span>
          </div>
        </div>

        {/* Perforation Line */}
        <div className="ticket-perforation"></div>

        {/* Right Side: QR Segment */}
        <div className="ticket-qr-side">
          <div className="ticket-qr-wrapper">
            <img src={qrCodeUrl} alt="QR Code" />
          </div>
          <div className="ticket-qr-subtext">Scan for Check-in</div>
          <div className="ticket-price-badge">₹{formData.price * formData.tickets}</div>
        </div>
      </div>
    </div>
  );
}

function Confirmation({ formData, emailStatus, onReset }) {
  const totalAmount = formData.tickets * formData.price;
  const refId = formData.referenceId || ('#' + Math.random().toString(36).substring(2, 9).toUpperCase());

  return (
    <div className="confirmation-wrapper animate-page-in">
      {/* Success Header Area */}
      <div className="confirmation-header-section">
        <div className="success-icon-large">✅</div>
        <h2 className="confirmation-title">Booking Confirmed!</h2>
        <p className="confirmation-subtitle">
          Your reservation is complete. Your ticket is generated below.
        </p>
      </div>

      <EmailStatusBanner status={emailStatus} email={formData.email} />

      {/* THE TICKETS GENERATION SECTION */}
      <div className="ticket-presentation-area">
        <VisualTicket formData={formData} />
      </div>

      {/* POST-BOOKING PAYMENT SECTION */}
      <div className="post-booking-payment-section">
        <div className="payment-alert-box">
          <span className="alert-icon">💡</span>
          <p>Please complete your payment to finalize the booking</p>
        </div>

        <div className="phonepe-payment-card">
          <div className="pp-card-header">
            <div className="phonepe-brand">
              <span className="pp-glyph">पे</span>
              <span>PhonePe</span>
            </div>
            <div className="pp-amount">₹{formData.price * formData.tickets}</div>
          </div>

          <div className="pp-qr-container">
            <img src="/src/assets/phonepe-qr.png" alt="PhonePe QR" className="pp-qr-img" />
            <div className="pp-helper">Scan to Pay securely via PhonePe</div>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button id="book-another-btn" className="btn-secondary" onClick={onReset}>
          ← Browse More Events
        </button>
        <button className="btn-primary" onClick={() => window.print()}>
          🖨️ Download / Print Ticket
        </button>
      </div>

      <div className="booking-details-footer">
        <div className="details-header">Booking Information</div>
        <div className="details-row">
          <span>Transaction Reference</span>
          <strong>{refId}</strong>
        </div>
        <div className="details-row">
          <span>Order Total</span>
          <strong>₹{totalAmount}</strong>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
