import React, { useState } from 'react';
import EventCard from './EventCard';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Conference', 'Workshop', 'Sports', 'Academic', 'Entrepreneurship'];
const TYPES = ['All', 'college', 'outside'];

function EventsList({ events, onSelectEvent }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = events.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || e.category === categoryFilter;
    const matchType = typeFilter === 'All' || e.type === typeFilter;
    return matchSearch && matchCat && matchType;
  });

  return (
    <div className="events-list-section">
      {/* Search & Filters */}
      <div className="events-filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            id="event-search"
            placeholder="Search events, venues, departments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <div className="filter-chips">
            {TYPES.map((t) => (
              <button
                key={t}
                className={`filter-chip ${typeFilter === t ? 'chip-active' : ''}`}
                onClick={() => setTypeFilter(t)}
              >
                {t === 'college' ? '🏫 College' : t === 'outside' ? '🌐 Outside' : '🌟 All Events'}
              </button>
            ))}
          </div>

          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-select"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <span>Showing <strong>{filtered.length}</strong> of <strong>{events.length}</strong> events</span>
        {(search || categoryFilter !== 'All' || typeFilter !== 'All') && (
          <button
            className="clear-filters-btn"
            onClick={() => { setSearch(''); setCategoryFilter('All'); setTypeFilter('All'); }}
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* Events Grid */}
      {filtered.length > 0 ? (
        <div className="events-grid">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <span className="no-results-icon">🔍</span>
          <p>No events found matching your filters.</p>
          <button
            className="btn-secondary"
            onClick={() => { setSearch(''); setCategoryFilter('All'); setTypeFilter('All'); }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default EventsList;
