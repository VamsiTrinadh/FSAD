import React from 'react';

function EventCard({ event, onSelect }) {
  const soldPercent = Math.round(
    ((event.totalTickets - event.availableTickets) / event.totalTickets) * 100
  );
  const isOpen = event.availableTickets > 0;

  return (
    <div className="event-card" onClick={() => onSelect(event)}>
      {/* Card Header Gradient */}
      <div className="event-card-header" style={{ background: event.gradient }}>
        <span className="event-card-emoji">{event.emoji}</span>
        <div className="event-card-tags">
          <span className={`event-type-badge ${event.type === 'college' ? 'badge-college' : 'badge-outside'}`}>
            {event.type === 'college' ? '🏫 College' : '🌐 Outside'}
          </span>
          <span className="event-category-badge">{event.category}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="event-card-body">
        <div className="event-card-tag-pill">{event.tag}</div>
        <h3 className="event-card-name">{event.name}</h3>
        <p className="event-card-dept">{event.department}</p>

        <div className="event-card-meta">
          <span className="meta-item">📅 {event.date}</span>
          <span className="meta-item">📍 {event.venue.split(',')[0]}</span>
        </div>

        <p className="event-card-desc">{event.description.slice(0, 100)}…</p>

        {/* Ticket Progress */}
        <div className="event-card-progress">
          <div className="progress-track">
            <div
              className={`progress-fill ${soldPercent >= 80 ? 'fill-danger' : soldPercent >= 50 ? 'fill-warn' : 'fill-safe'}`}
              style={{ width: `${soldPercent}%` }}
            />
          </div>
          <div className="progress-info">
            <span>{event.availableTickets} left</span>
            <span>{soldPercent}% sold</span>
          </div>
        </div>

        <div className="event-card-footer">
          <span className="event-price">₹{event.price}<small>/ticket</small></span>
          <span className={`availability-badge ${isOpen ? 'avail-open' : 'avail-sold'}`}>
            {isOpen ? '● Open' : '● Sold Out'}
          </span>
        </div>

        <button className="btn-book-now" disabled={!isOpen}>
          {isOpen ? 'Book Tickets →' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}

export default EventCard;
