import React, { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEPARTMENTS = [
  { value: '', label: '-- Select Department --' },
  { value: 'CSE', label: 'CSE — Computer Science & Engineering' },
  { value: 'ECE', label: 'ECE — Electronics & Communication' },
  { value: 'Mechanical', label: 'Mechanical Engineering' },
  { value: 'Civil', label: 'Civil Engineering' },
  { value: 'IT', label: 'IT — Information Technology' },
  { value: 'Faculty/Staff', label: 'Faculty / Staff' },
  { value: 'External', label: 'External Participant' },
];

const initialForm = { name: '', email: '', department: '', tickets: 1 };
const initialErrors = { name: '', email: '', department: '', tickets: '' };

function BookingForm({ event, onBookingSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);

  const availableTickets = event.availableTickets;

  const validate = () => {
    const newErrors = { ...initialErrors };
    let isValid = true;

    if (!form.name.trim()) { newErrors.name = 'This field is required'; isValid = false; }
    if (!form.email.trim()) {
      newErrors.email = 'This field is required'; isValid = false;
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address'; isValid = false;
    }
    if (!form.department) { newErrors.department = 'This field is required'; isValid = false; }

    if (!form.tickets && form.tickets !== 0) {
      newErrors.tickets = 'This field is required'; isValid = false;
    } else {
      const n = parseInt(form.tickets, 10);
      if (isNaN(n) || n < 1 || !Number.isInteger(n)) {
        newErrors.tickets = 'Enter a valid positive number'; isValid = false;
      } else if (n > availableTickets) {
        newErrors.tickets = `Only ${availableTickets} ticket(s) available`; isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onBookingSuccess({
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department,
        tickets: parseInt(form.tickets, 10),
        eventId: event.id,
        eventName: event.name,
        price: event.price,
      });
    }
  };

  const handleReset = () => { setForm(initialForm); setErrors(initialErrors); };

  return (
    <div className="booking-form-card">
      <div className="form-header">
        <h2 className="form-title">🎟️ Book Your Ticket</h2>
        <p className="form-subtitle">Fill in the details below to reserve your spot</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="booking-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name <span className="required-star">*</span></label>
          <input type="text" id="name" name="name" value={form.name} onChange={handleChange}
            placeholder="Enter your full name"
            className={`form-input ${errors.name ? 'input-error' : ''}`} />
          {errors.name && <p className="error-message">⚠ {errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email ID <span className="required-star">*</span></label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange}
            placeholder="Enter your email address"
            className={`form-input ${errors.email ? 'input-error' : ''}`} />
          {errors.email && <p className="error-message">⚠ {errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="department" className="form-label">Department <span className="required-star">*</span></label>
          <select id="department" name="department" value={form.department} onChange={handleChange}
            className={`form-input form-select ${errors.department ? 'input-error' : ''}`}>
            {DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          {errors.department && <p className="error-message">⚠ {errors.department}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Number of Tickets <span className="required-star">*</span></label>
          <div className="ticket-counter-wrapper">
            <button 
              type="button" 
              className="counter-btn"
              onClick={() => setForm(f => ({ ...f, tickets: Math.max(1, (parseInt(f.tickets) || 1) - 1) }))}
              disabled={parseInt(form.tickets) <= 1}
            >
              −
            </button>
            <input 
              type="number" 
              id="tickets" 
              name="tickets" 
              value={form.tickets} 
              onChange={handleChange}
              min="1" 
              max={availableTickets}
              className={`counter-input ${errors.tickets ? 'input-error' : ''}`} 
            />
            <button 
              type="button" 
              className="counter-btn"
              onClick={() => setForm(f => ({ ...f, tickets: Math.min(availableTickets, (parseInt(f.tickets) || 0) + 1) }))}
              disabled={parseInt(form.tickets) >= availableTickets}
            >
              +
            </button>
          </div>
          {errors.tickets && <p className="error-message">⚠ {errors.tickets}</p>}
          <p className="field-hint">{availableTickets} ticket(s) currently available</p>
        </div>

        {form.tickets && parseInt(form.tickets) >= 1 && !errors.tickets && (
          <div className="cost-preview">
            <span>💳 Estimated Total:</span>
            <strong>₹{parseInt(form.tickets) * event.price}</strong>
          </div>
        )}

        <div className="form-buttons">
          <button type="submit" id="confirm-booking-btn" className="btn-primary">✓ Confirm Booking</button>
          <button type="button" id="reset-form-btn" className="btn-secondary" onClick={handleReset}>↺ Reset</button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
