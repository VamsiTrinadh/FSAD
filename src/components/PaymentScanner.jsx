import React, { useState, useEffect } from 'react';

function PaymentScanner({ bookingData, event, onVerifySuccess, onCancel }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer

  const totalAmount = bookingData.tickets * bookingData.price;
  const qrCodeUrl = "/src/assets/phonepe-qr.png";

  useEffect(() => {
    if (timeLeft <= 0) {
      onCancel();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onCancel]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleVerify = () => {
    console.log("Verifying payment for:", bookingData.referenceId);
    setIsVerifying(true);
    setTimeout(() => {
      console.log("Payment verification successful");
      setIsVerifying(false);
      onVerifySuccess();
    }, 2500);
  };

  return (
    <div className="payment-scanner-container animate-page-in">
      <div className="payment-scanner-card premium-shadow">
        <div className="payment-scanner-header">
          <div className="phonepe-logo-wrapper">
            <span className="phonepe-logo-glyph">पे</span>
            <span className="phonepe-logo-text">PhonePe</span>
          </div>
          <div className="payment-timer-top">
            Expires in: <strong>{formatTime(timeLeft)}</strong>
          </div>
        </div>

        <div className="payment-amount-display">
          <div className="amount-label">Amount to Pay</div>
          <div className="amount-value">₹{totalAmount}</div>
          <div className="payment-ref">Reference: {bookingData.referenceId}</div>
        </div>

        <div className="qr-section-wrapper">
          <div className="qr-frame">
            <div className={`qr-display-area ${isVerifying ? 'verifying' : ''}`}>
              <img src={qrCodeUrl} alt="PhonePe QR Code" className="phonepe-qr-image" />
              {isVerifying && (
                <div className="qr-verification-overlay">
                  <div className="scanning-line"></div>
                  <div className="verification-text">Verifying...</div>
                </div>
              )}
            </div>
            <div className="qr-footer-text">
              Scan with PhonePe, GPay or any UPI App
            </div>
          </div>
        </div>

        <div className="payment-breakdown-mini">
          <div className="mini-row">
            <span>{event.name}</span>
            <span>{bookingData.tickets} Tickets</span>
          </div>
        </div>

        <div className="scanner-actions">
          {!isVerifying ? (
            <>
              <button className="confirm-payment-btn" onClick={handleVerify}>
                Confirm & Verify Payment
              </button>
              <button className="cancel-payment-link" onClick={onCancel}>
                Cancel Transaction
              </button>
            </>
          ) : (
            <div className="payment-processing-spinner">
              <div className="spinner-dots"><span></span><span></span><span></span></div>
              <p>Establishing secure connection...</p>
            </div>
          )}
        </div>
      </div>

      <div className="secure-payment-footer">
        <span>🔒 SSL SECURED</span>
        <span>🛡️ 100% SAFE PAYMENTS</span>
      </div>
    </div>
  );
}

export default PaymentScanner;
