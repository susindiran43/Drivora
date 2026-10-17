import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { carService } from '../../api/client';

export default function CarDetailsModal({ car, onClose, onBookWithDates }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [durationDays, setDurationDays] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [dateError, setDateError] = useState('');
  const [activeBookings, setActiveBookings] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // Set default initial dates: tomorrow to +4 days
  useEffect(() => {
    const today = new Date();
    const tTomorrow = new Date(today);
    tTomorrow.setDate(today.getDate() + 1);
    const tEnd = new Date(tTomorrow);
    tEnd.setDate(tTomorrow.getDate() + 3);

    const fmt = (d) => d.toISOString().split('T')[0];
    setStartDate(fmt(tTomorrow));
    setEndDate(fmt(tEnd));
  }, []);

  // Fetch active bookings for this car to show booked schedule
  useEffect(() => {
    if (!car) return;
    let mounted = true;
    const fetchSchedule = async () => {
      setLoadingSchedule(true);
      try {
        const bookings = await carService.getCarRentals(car.id);
        if (mounted) setActiveBookings(bookings);
      } catch (err) {
        console.error('Failed to load vehicle rentals:', err);
      } finally {
        if (mounted) setLoadingSchedule(false);
      }
    };
    fetchSchedule();
    return () => {
      mounted = false;
    };
  }, [car]);

  // Calculate duration and estimated cost whenever dates change
  useEffect(() => {
    if (!startDate || !endDate) {
      setDurationDays(0);
      setEstimatedCost(0);
      setDateError('');
      return;
    }

    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays <= 0) {
      setDateError('Rental end date must be strictly after start date (minimum 1 day).');
      setDurationDays(0);
      setEstimatedCost(0);
    } else {
      setDateError('');
      setDurationDays(diffDays);
      setEstimatedCost(diffDays * car.daily_rate);
    }
  }, [startDate, endDate, car]);

  if (!car) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        {/* Header Image */}
        <div style={{ position: 'relative', height: '260px', width: '100%', overflow: 'hidden' }}>
          <img
            src={car.image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'}
            alt={`${car.make} ${car.model}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(16,46,43,0.3) 0%, rgba(16,46,43,0.95) 100%)',
            }}
          />
          {/* Close button */}
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: '50%',
              padding: '6px',
              color: '#ffffff',
            }}
          >
            <X size={20} />
          </button>

          <div style={{ position: 'absolute', bottom: '18px', left: '20px', right: '20px' }}>
            <span className="badge badge-gold" style={{ marginBottom: '6px' }}>
              {car.category || 'Luxury'}
            </span>
            <h2 style={{ color: '#ffffff', fontSize: '1.9rem', lineHeight: 1.15 }}>
              {car.make} {car.model}
            </h2>
            <div style={{ color: 'var(--color-champagne-gold)', fontSize: '0.88rem', fontWeight: 600 }}>
              Model Year {car.year} • ${car.daily_rate.toFixed(0)} / day
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: 'var(--space-6)' }}>
          {/* Description */}
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 'var(--space-6)', color: 'var(--text-secondary)' }}>
            {car.description || 'Pristine high-performance vehicle with state-of-the-art engineering and hand-tailored luxury.'}
          </p>

          {/* Reserved Schedule Alert if car has active bookings */}
          {activeBookings.length > 0 && (
            <div
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(216, 173, 126, 0.12)',
                border: '1px solid rgba(216, 173, 126, 0.35)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gold)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                <Calendar size={16} /> Current Reserved Schedule (Half-Open Intervals):
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {activeBookings.map((b) => (
                  <li
                    key={b.id}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {b.start_date} to {b.end_date}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Date Selector & Cost Estimation */}
          <div
            className="glass-panel"
            style={{
              padding: 'var(--space-5)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              marginBottom: 'var(--space-6)',
            }}
          >
            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              Check Date Availability & Instant Quote
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label">Start Date (Pick-up)</label>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date (Return)</label>
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {dateError && (
              <div style={{ color: 'var(--danger-text)', fontSize: '0.82rem', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} /> {dateError}
              </div>
            )}

            {durationDays > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Duration: {durationDays} {durationDays === 1 ? 'day' : 'days'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interval: {startDate} to {endDate} (half-open)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Estimated Total</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-gold)', fontFamily: 'var(--font-display)' }}>
                    ${estimatedCost.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
            <button
              onClick={() => onBookWithDates(car, startDate, endDate)}
              disabled={!car.available || Boolean(dateError) || durationDays <= 0}
              className="btn btn-primary"
            >
              Reserve Vehicle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
