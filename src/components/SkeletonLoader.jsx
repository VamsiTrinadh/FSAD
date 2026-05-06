import React from 'react';

function SkeletonLoader() {
  const cards = Array(6).fill(null);

  return (
    <div className="skeleton-wrapper">
      {/* Skeletons for Filter Bar */}
      <div className="events-filter-bar skeleton-pulse" style={{ height: '60px', marginBottom: '20px', borderRadius: '12px' }}></div>
      <div className="results-info skeleton-pulse" style={{ height: '20px', width: '150px', marginBottom: '16px', borderRadius: '4px' }}></div>
      
      {/* Skeleton for Events Grid */}
      <div className="events-grid">
        {cards.map((_, i) => (
          <div key={i} className="event-card skeleton-card">
            <div className="event-card-header skeleton-pulse" style={{ height: '90px', padding: 0 }}></div>
            <div className="event-card-body">
              <div className="skeleton-pulse" style={{ height: '18px', width: '40%', marginBottom: '10px', borderRadius: '4px' }}></div>
              <div className="skeleton-pulse" style={{ height: '24px', width: '80%', marginBottom: '6px', borderRadius: '4px' }}></div>
              <div className="skeleton-pulse" style={{ height: '14px', width: '60%', marginBottom: '16px', borderRadius: '4px' }}></div>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <div className="skeleton-pulse" style={{ height: '14px', width: '25%', borderRadius: '4px' }}></div>
                <div className="skeleton-pulse" style={{ height: '14px', width: '25%', borderRadius: '4px' }}></div>
              </div>
              
              <div className="skeleton-pulse" style={{ height: '6px', width: '100%', marginBottom: '12px', borderRadius: '50px' }}></div>
            </div>
            <div className="event-card-footer" style={{ padding: '0 18px 18px', display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
              <div className="skeleton-pulse" style={{ height: '24px', width: '30%', borderRadius: '4px' }}></div>
              <div className="skeleton-pulse" style={{ height: '36px', width: '50%', borderRadius: '8px' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonLoader;
