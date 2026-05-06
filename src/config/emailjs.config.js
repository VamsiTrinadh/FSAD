// ============================================================
//  EmailJS Configuration
//  Replace the placeholders below with your EmailJS credentials
//  Sign up FREE at: https://www.emailjs.com
//
//  Steps:
//  1. Create a free account at emailjs.com
//  2. Add an Email Service (Gmail recommended) → copy SERVICE_ID
//  3. Create an Email Template (see template variables below) → copy TEMPLATE_ID
//  4. Go to Account → copy your PUBLIC_KEY
//
//  Template variables to use in your EmailJS template:
//    {{to_name}}       - Attendee full name
//    {{to_email}}      - Attendee email address
//    {{event_name}}    - Event name
//    {{event_date}}    - Event date & time
//    {{event_venue}}   - Venue
//    {{department}}    - Attendee department
//    {{tickets}}       - Number of tickets
//    {{ticket_price}}  - Per ticket price
//    {{total_amount}}  - Total amount paid
//    {{reference_id}}  - Booking reference ID
// ============================================================

export const EMAILJS_CONFIG = {
  SERVICE_ID:  'YOUR_SERVICE_ID',   // e.g. 'service_abc123'
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',  // e.g. 'template_xyz789'
  PUBLIC_KEY:  'YOUR_PUBLIC_KEY',   // e.g. 'abcDEFghiJKL'
};
