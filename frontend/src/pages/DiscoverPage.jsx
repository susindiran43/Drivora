import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Sparkles, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';
import { carService } from '../api/client';
import CarCard from '../features/cars/CarCard';

const CATEGORIES = ['All', 'Electric', 'Grand Tourer', 'Sports', 'Luxury Sedan', 'Executive SUV'];

export default function DiscoverPage({ onSelectCarDetails, onSelectCarBook }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('recommended');

  // Hero Date Range Availability Check
  const [checkStartDate, setCheckStartDate] = useState('');
  const [checkEndDate, setCheckEndDate] = useState('');

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (checkStartDate && checkEndDate) {
        params.start_date = checkStartDate;
        params.end_date = checkEndDate;
      }
      const data = await carService.getCars(params);
      setCars(data);
    } catch (err) {
      console.error('Failed to load fleet:', err);
      setError(err.message || 'Unable to connect to vehicle database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [checkStartDate, checkEndDate]);

  // Client-side filtering and sorting for instant responsiveness
  const filteredCars = cars
    .filter((car) => {
      // Search query
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesMake = car.make.toLowerCase().includes(term);
        const matchesModel = car.model.toLowerCase().includes(term);
        const matchesCategory = (car.category || '').toLowerCase().includes(term);
        if (!matchesMake && !matchesModel && !matchesCategory) return false;
      }
      // Category filter
      if (selectedCategory !== 'All') {
        if ((car.category || '').toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }
      // Max price filter
      if (car.daily_rate > maxPrice) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.daily_rate - b.daily_rate;
      if (sortBy === 'price-desc') return b.daily_rate - a.daily_rate;
      if (sortBy === 'year-desc') return b.year - a.year;
      return 0; // Default
    });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMaxPrice(1000);
    setSortBy('recommended');
    setCheckStartDate('');
    setCheckEndDate('');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          paddingTop: 'var(--space-16)',
          paddingBottom: 'var(--space-16)',
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(216, 173, 126, 0.12) 0%, transparent 70%), linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-primary) 100%)`,
          borderBottom: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            className="badge badge-gold"
            style={{
              padding: '0.4rem 1rem',
              marginBottom: 'var(--space-4)',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
            }}
          >
            <Sparkles size={14} /> The Pinnacle of Luxury Mobility
          </div>

          <h1 style={{ maxWidth: '900px', margin: '0 auto var(--space-4)' }}>
            Drive. Rent. <span className="gold-text-gradient">Explore.</span>
          </h1>

          <p
            style={{
              maxWidth: '680px',
              margin: '0 auto var(--space-8)',
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            Experience extraordinary automotive craft. Reserve the world's finest grand tourers, electric hyper-sedans, and exotic sports cars with guaranteed date availability.
          </p>

          {/* Quick Date Availability & Search Bar */}
          <div
            className="glass-panel"
            style={{
              maxWidth: '920px',
              margin: '0 auto',
              padding: 'var(--space-6)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-gold)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-4)',
                textAlign: 'left',
              }}
            >
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Pick-up Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={checkStartDate}
                  onChange={(e) => setCheckStartDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Return Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={checkEndDate}
                  onChange={(e) => setCheckEndDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Search Model</label>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={16}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Porsche, DB12..."
                    style={{ paddingLeft: '2.4rem' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {checkStartDate && checkEndDate && (
              <div
                style={{
                  marginTop: 'var(--space-3)',
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ color: 'var(--text-gold)', fontWeight: 600 }}>
                  Filtering cars available for interval: {checkStartDate} to {checkEndDate}
                </span>
                <button
                  onClick={() => {
                    setCheckStartDate('');
                    setCheckEndDate('');
                  }}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                >
                  Clear Date Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Fleet Catalog Section */}
      <section id="fleet" className="container" style={{ paddingTop: 'var(--space-12)' }}>
        {/* Filter Controls Bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {/* Top row: Category Pills & Sort */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}
          >
            {/* Category Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.45rem 0.95rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort & Reset */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sort:</span>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: 'auto', padding: '0.45rem 1.8rem 0.45rem 0.8rem', fontSize: '0.82rem' }}
                >
                  <option value="recommended">Featured Fleet</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="year-desc">Year: Newest First</option>
                </select>
              </div>

              {(searchTerm || selectedCategory !== 'All' || maxPrice < 1000 || checkStartDate) && (
                <button
                  onClick={handleResetFilters}
                  className="btn btn-ghost"
                  title="Reset all filters"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Secondary Filter: Max Price Slider & Counter */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-muted)',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: 1, minWidth: '220px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Max Daily Rate: <strong style={{ color: 'var(--text-gold)' }}>${maxPrice}</strong>
              </span>
              <input
                type="range"
                min="200"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--color-champagne-gold)', maxWidth: '280px' }}
              />
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredCars.length}</strong> of <strong>{cars.length}</strong> premium vehicles
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 'var(--space-20) 0' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                border: '3px solid var(--border-subtle)',
                borderTopColor: 'var(--color-champagne-gold)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto var(--space-4)',
              }}
            />
            <p style={{ color: 'var(--text-muted)' }}>Curating the Drivora fleet from database...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className="glass-panel"
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              maxWidth: '540px',
              margin: 'var(--space-10) auto',
              border: '1px solid var(--danger-border)',
            }}
          >
            <h3 style={{ color: 'var(--danger-text)', marginBottom: 'var(--space-2)' }}>Unable to Load Fleet</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>{error}</p>
            <button onClick={fetchCars} className="btn btn-primary">
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCars.length === 0 && (
          <div
            className="glass-panel"
            style={{
              padding: 'var(--space-16) var(--space-6)',
              textAlign: 'center',
              maxWidth: '600px',
              margin: 'var(--space-10) auto',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🏎️</div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>No Vehicles Match Your Criteria</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-5)' }}>
              Try adjusting your date range, price filter, or search keywords to view other available models in our fleet.
            </p>
            <button onClick={handleResetFilters} className="btn btn-secondary">
              View All Vehicles
            </button>
          </div>
        )}

        {/* Vehicles Grid */}
        {!loading && !error && filteredCars.length > 0 && (
          <div className="cars-grid">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onSelectDetails={onSelectCarDetails}
                onSelectBook={onSelectCarBook}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
