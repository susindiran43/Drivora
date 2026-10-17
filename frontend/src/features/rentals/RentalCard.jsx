import React from 'react';
import { Calendar, User, DollarSign, Clock, ShieldCheck, XCircle, Trash2 } from 'lucide-react';

export default function RentalCard({ rental, onCancelRequest }) {
  const isActive = rental.status === 'ACTIVE';
  const carName = rental.car ? `${rental.car.make} ${rental.car.model}` : `Vehicle #${rental.car_id}`;
  const carYear = rental.car?.year || '';
  const carCategory = rental.car?.category || 'Prestige';
  const carImage = rental.car?.image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';

  const formattedBookDate = rental.rental_date
    ? new Date(rental.rental_date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div
      className="glass-panel"
      style={{
        padding: 'var(--space-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        borderLeft: `4px solid ${isActive ? 'var(--color-champagne-gold)' : 'var(--color-slate-grey)'}`,
        opacity: isActive ? 1 : 0.75,
        transition: 'all var(--transition-normal)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <img
            src={carImage}
            alt={carName}
            style={{ width: '64px', height: '46px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-gold)', letterSpacing: '0.05em' }}>
                RENTAL #{rental.id}
              </span>
              <span className={`badge ${isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                {isActive ? 'ACTIVE' : 'CANCELLED'}
              </span>
            </div>
            <h4 style={{ fontSize: '1.15rem', marginTop: '2px' }}>
              {carName} {carYear && `(${carYear})`}
            </h4>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Amount</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-gold)', fontFamily: 'var(--font-display)' }}>
            ${rental.total_cost ? rental.total_cost.toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      {/* Booking Details Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-muted)',
          fontSize: '0.825rem',
        }}
      >
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Reserved By</div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <User size={13} style={{ color: 'var(--color-champagne-gold)' }} />
            <span>{rental.user_name}</span>
          </div>
        </div>

        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Pick-up Date</div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <Calendar size={13} style={{ color: 'var(--color-champagne-gold)' }} />
            <span>{rental.start_date}</span>
          </div>
        </div>

        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Return Date</div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <Calendar size={13} style={{ color: 'var(--color-champagne-gold)' }} />
            <span>{rental.end_date}</span>
          </div>
        </div>

        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Booked On</div>
          <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', color: 'var(--text-secondary)' }}>
            <Clock size={13} />
            <span>{formattedBookDate}</span>
          </div>
        </div>
      </div>

      {/* Cancellation Action */}
      {isActive && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
          <button
            onClick={() => onCancelRequest(rental)}
            className="btn btn-danger"
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            <Trash2 size={14} />
            <span>Cancel Reservation</span>
          </button>
        </div>
      )}
    </div>
  );
}
