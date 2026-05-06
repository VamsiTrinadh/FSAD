import React from 'react';

function EventDetails({ event }) {
  const soldTickets = event.totalTickets - event.availableTickets;
  const progressPercent = Math.round((soldTickets / event.totalTickets) * 100);
  const isOpen = event.availableTickets > 0;

  return (
    <div className="event-details-card">
      {/* Gradient Header */}
      <div className="details-card-header" style={{ background: event.gradient }}>
        <span className="details-emoji">{event.emoji}</span>
        <div className="details-header-tags">
          <span className={`event-type-badge ${event.type === 'college' ? 'badge-college' : 'badge-outside'}`}>
            {event.type === 'college' ? '🏫 College Event' : '🌐 Outside Event'}
          </span>
          <span className={`status-badge-inline ${isOpen ? 'status-open' : 'status-sold-out'}`}>
            {isOpen ? '● Open' : '● Sold Out'}
          </span>
        </div>
      </div>

      <div className="details-card-body">
        <div className="event-card-tag-pill">{event.tag}</div>
        <h2 className="event-name">{event.name}</h2>
        <p className="event-description-text">{event.description}</p>

        {/* Info Items */}
        <div className="event-info-grid">
          <div className="event-info-item">
            <span className="info-icon">🏛️</span>
            <div>
              <p className="info-label">Department / Org</p>
              <p className="info-value">{event.department}</p>
            </div>
          </div>
          <div className="event-info-item">
            <span className="info-icon">📅</span>
            <div>
              <p className="info-label">Date &amp; Time</p>
              <p className="info-value">{event.date}, {event.time}</p>
            </div>
          </div>
          <div className="event-info-item">
            <span className="info-icon">📍</span>
            <div>
              <p className="info-label">Venue</p>
              <p className="info-value">{event.venue}</p>
            </div>
          </div>
          <div className="event-info-item">
            <span className="info-icon">💰</span>
            <div>
              <p className="info-label">Ticket Price</p>
              <p className="info-value price">₹{event.price} per ticket</p>
            </div>
          </div>
        </div>

        {/* Ticket Progress */}
        <div className="ticket-progress-section">
          <div className="ticket-count-row">
            <span className="ticket-label">Tickets Available</span>
            <span className="ticket-numbers">
              <strong>{event.availableTickets}</strong>
              <span className="total-sep">/ {event.totalTickets}</span>
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className={`progress-bar-fill ${progressPercent >= 80 ? 'danger' : progressPercent >= 50 ? 'warning' : 'safe'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="progress-labels">
            <span className="sold-label">{soldTickets} sold</span>
            <span className="remain-label">{event.availableTickets} remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
