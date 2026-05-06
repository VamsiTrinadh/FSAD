import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs.config';

const isConfigured =
  EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
  EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
  EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

/**
 * Sends a booking confirmation email to the attendee.
 * @param {Object} params - All template variables
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendBookingConfirmationEmail(params) {
  // If not configured, fall back to mailto
  if (!isConfigured) {
    openMailtoFallback(params);
    return { success: true, method: 'mailto' };
  }

  try {
    const templateParams = {
      to_name:      params.name,
      to_email:     params.email,
      event_name:   params.eventName,
      event_date:   params.eventDate,
      event_venue:  params.eventVenue,
      department:   params.department,
      tickets:      params.tickets,
      ticket_price: `₹${params.price}`,
      total_amount: `₹${params.tickets * params.price}`,
      reference_id: params.referenceId,
    };

    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    return { success: true, method: 'emailjs' };
  } catch (error) {
    console.error('EmailJS error:', error);
    // Fallback to mailto if EmailJS fails
    openMailtoFallback(params);
    return { success: true, method: 'mailto', error };
  }
}

/**
 * Fallback: opens the user's mail client with pre-filled confirmation.
 */
function openMailtoFallback(params) {
  const total = params.tickets * params.price;
  const subject = encodeURIComponent(
    `✅ Booking Confirmed — ${params.eventName} [Ref: ${params.referenceId}]`
  );
  const body = encodeURIComponent(
    `Dear ${params.name},

Your ticket booking has been confirmed! 🎉

━━━━━━━━━━━━━━━━━━━━━━━━
  BOOKING CONFIRMATION
━━━━━━━━━━━━━━━━━━━━━━━━

Reference ID  : ${params.referenceId}
Name          : ${params.name}
Email         : ${params.email}
Department    : ${params.department}

━━━━━━━━━━━━━━━━━━━━━━━━
  EVENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━

Event         : ${params.eventName}
Date & Time   : ${params.eventDate}
Venue         : ${params.eventVenue}

━━━━━━━━━━━━━━━━━━━━━━━━
  PAYMENT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━

Tickets       : ${params.tickets}
Price/Ticket  : ₹${params.price}
Total Paid    : ₹${total}

━━━━━━━━━━━━━━━━━━━━━━━━

Please carry this confirmation email or your Reference ID on the day of the event.

See you there! 🎓
— EventHub Team`
  );

  const mailtoLink = `mailto:${params.email}?subject=${subject}&body=${body}`;
  const anchor = document.createElement('a');
  anchor.href = mailtoLink;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
