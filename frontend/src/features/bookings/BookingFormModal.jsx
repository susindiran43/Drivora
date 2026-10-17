import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, User, AlertCircle, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { carService } from '../../api/client';

export default function BookingFormModal({ car, initialStartDate, initialEndDate, onClose, onSuccess }) {
  const [userName, setUserName] = useState('');
  const [startDate, setStartDate] = useState(initialStartDate || '');
  const [endDate, setEndDate] = useState(initialEndDate || '');
  const [durationDays, setDurationDays] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set reasonable default dates if not provided
  useEffect(() => {
    if (!startDate || !endDate) {
      const today = new Date();
      const tStart = new Date(today);
      tStart.setDate(today.getDate() + 1);
      const tEnd = new Date(tStart);
      tEnd.setDate(tStart.getDate() + 3);

      const fmt = (d) => d.toISOString().split('T')[0];
      if (!startDate) setStartDate(fmt(tStart));
      if (!endDate) setEndDate(fmt(tEnd));
    }
  }, []);

  // Compute duration and estimate
  useEffect(() => {
    setErrorMessage('');
    if (!startDate || !endDate) {
      setDurationDays(0);
      setEstimatedCost(0);
      setValidationError('Please select both pick-up and return dates.');
      return;
    }

    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays <= 0) {
      setValidationError('Return date must be strictly after pick-up date (half-open interval: start <= date < end).');
      setDurationDays(0);
      setEstimatedCost(0);
    } else {
      setValidationError('');
      setDurationDays(diffDays);
      setEstimatedCost(diffDays * car.daily_rate);
    }
  }, [startDate, endDate, car]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!userName.trim()) {
      setValidationError('Please enter your full name for the booking agreement.');
      return;
    }

    if (durationDays <= 0 || validationError) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        user_name: userName.trim(),
        start_date: startDate,
        end_date: endDate,
      };

      const result = await carService.createRental(car.id, payload);
      // Real API call succeeded with 201 Created and actual rental record
      onSuccess(result, car);
    } catch (err) {
      console.error('Booking failed:', err);
      setErrorMessage(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '560px' }}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-6)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-champagne-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Confirm Rental Agreement
            </span>
            <h3 style={{ fontSize: '1.4rem', marginTop: '2px' }}>
              {car.make} {car.model}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-6)' }}>
          {/* Selected Car Summary Card */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              alignItems: 'center',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-muted)',
              marginBottom: 'var(--space-5)',
            }}
          >
            <img
              src={car.image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'}
              alt={car.model}
              style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{car.make} {car.model} ({car.year})</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category: {car.category || 'Luxury'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-gold)', fontFamily: 'var(--font-display)' }}>
                ${car.daily_rate.toFixed(0)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ day</div>
            </div>
          </div>

          {/* Customer Name */}
          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="form-label">
              <User size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
              Customer Full Name
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Eleanor Vance"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Dates: Pick-up and Return */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
                Pick-up (Start)
              </label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
                Return (End)
              </label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Validation Notice */}
          {validationError && (
            <div
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger-text)',
                fontSize: '0.82rem',
                marginBottom: 'var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          {/* Backend Error (e.g. 409 Conflict) */}
          {errorMessage && (
            <div
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger-text)',
                fontSize: '0.86rem',
                marginBottom: 'var(--space-4)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Reservation Conflict:</strong> {errorMessage}
              </div>
            </div>
          )}

          {/* Duration & Total Cost Calculation */}
          {durationDays > 0 && !validationError && (
            <div
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-gold)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Duration:</span>
                <span style={{ fontWeight: 600 }}>{durationDays} {durationDays === 1 ? 'day' : 'days'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Rate:</span>
                <span>${car.daily_rate.toFixed(2)} / day</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Estimated Total:</span>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-gold)', fontFamily: 'var(--font-display)' }}>
                  ${estimatedCost.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <button type="button" onClick={onClose} disabled={isSubmitting} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Boolean(validationError) || durationDays <= 0 || !userName.trim()}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Confirm Reservation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
