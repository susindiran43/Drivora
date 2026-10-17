import React, { useState } from 'react';
import { AlertTriangle, Trash2, Loader2, X, RefreshCw } from 'lucide-react';
import { rentalService } from '../../api/client';
import { useModalDismiss } from '../../hooks/useModalDismiss';

export default function CancelConfirmModal({ rental, onClose, onCancelled }) {
  useModalDismiss(Boolean(rental), onClose);

  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!rental) return null;

  const handleConfirmCancel = async () => {
    setIsDeleting(true);
    setErrorMsg('');
    try {
      // Call actual DELETE /rentals/{rental_id} API endpoint
      await rentalService.cancelRental(rental.id);
      onCancelled(rental.id);
    } catch (err) {
      console.error('Cancellation failed:', err);
      setErrorMsg(err.message || 'Failed to cancel the reservation. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: 'var(--space-6)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <h3 style={{ fontSize: '1.35rem', marginBottom: 'var(--space-2)' }}>
          Cancel Reservation #{rental.id}?
        </h3>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)', lineHeight: 1.5 }}>
          Are you sure you wish to cancel this rental agreement for <strong>{rental.car ? `${rental.car.make} ${rental.car.model}` : `Vehicle #${rental.car_id}`}</strong> booked by <strong>{rental.user_name}</strong>?
        </p>

        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--bg-muted)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem',
            marginBottom: 'var(--space-5)',
            borderLeft: '3px solid var(--color-champagne-gold)',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
            Reserved Dates: {rental.start_date} to {rental.end_date}
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Releasing this booking will immediately make these dates available for new reservations in the system.
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              fontSize: '0.82rem',
              marginBottom: 'var(--space-4)',
            }}
          >
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <button onClick={onClose} disabled={isDeleting} className="btn btn-secondary">
            Keep Booking
          </button>
          <button
            onClick={handleConfirmCancel}
            disabled={isDeleting}
            className="btn btn-danger"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Releasing Dates...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Confirm Cancellation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
