import React from 'react';
import { CheckCircle2, Calendar, ShieldCheck, ArrowRight, User } from 'lucide-react';
import { useModalDismiss } from '../../hooks/useModalDismiss';

export default function BookingSuccessModal({ rental, car, onClose, onViewRentals }) {
  useModalDismiss(Boolean(rental), onClose);

  if (!rental) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', textAlign: 'center', padding: 'var(--space-8)' }}
      >
        {/* Success Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(216, 173, 126, 0.15)',
            border: '2px solid var(--color-champagne-gold)',
            color: 'var(--color-champagne-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4)',
          }}
        >
          <CheckCircle2 size={36} />
        </div>

        <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
          Reservation Confirmed
        </span>
        <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-2)' }}>
          You're Ready to Roll
        </h2>
        <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-6)' }}>
          Your rental booking has been processed and safely persisted in the database.
        </p>

        {/* Confirmation Details Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-muted)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-gold)',
            padding: 'var(--space-5)',
            textAlign: 'left',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rental Confirmation ID:</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-gold)', fontSize: '1.1rem' }}>
              #{rental.id}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Guest Name:</span>
            <span style={{ fontWeight: 600 }}>{rental.user_name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Vehicle:</span>
            <span style={{ fontWeight: 600 }}>{car ? `${car.make} ${car.model}` : `Vehicle ID #${rental.car_id}`}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Reserved Interval:</span>
            <span style={{ fontWeight: 600, color: 'var(--color-champagne-gold)' }}>
              {rental.start_date} to {rental.end_date}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Total Cost:</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-gold)', fontFamily: 'var(--font-display)' }}>
              ${rental.total_cost ? rental.total_cost.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
            Done
          </button>
          <button
            onClick={() => {
              onClose();
              onViewRentals();
            }}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            <span>My Bookings</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
