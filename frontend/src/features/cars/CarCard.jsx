import React, { useState } from 'react';
import { Calendar, DollarSign, Sparkles, CheckCircle2, AlertOctagon, ChevronRight } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';

export default function CarCard({ car, onSelectDetails, onSelectBook }) {
  const [imgSrc, setImgSrc] = useState(car.image_url || FALLBACK_IMAGE);
  const isAvailable = Boolean(car.available);

  return (
    <article
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.borderColor = 'var(--color-champagne-gold)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      {/* Vehicle Media Header */}
      <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden', backgroundColor: '#0a1d1a' }}>
        <img
          src={imgSrc}
          alt={`${car.make} ${car.model}`}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-slow)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Gradient shadow overlay for legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(16,46,43,0.1) 0%, rgba(16,46,43,0.85) 100%)',
          }}
        />

        {/* Category Pill Top Left */}
        <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
          <span className="badge badge-gold" style={{ backdropFilter: 'blur(8px)' }}>
            {car.category || 'Luxury'}
          </span>
        </div>

        {/* Operational Status Pill Top Right */}
        <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
          {isAvailable ? (
            <span className="badge badge-success" style={{ backdropFilter: 'blur(8px)' }}>
              <CheckCircle2 size={12} /> Ready to Rent
            </span>
          ) : (
            <span className="badge badge-danger" style={{ backdropFilter: 'blur(8px)' }}>
              <AlertOctagon size={12} /> In Service
            </span>
          )}
        </div>

        {/* Model & Make overlay text */}
        <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-champagne-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {car.make} • {car.year}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
            {car.model}
          </div>
        </div>
      </div>

      {/* Vehicle Info Body */}
      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {car.description && (
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-4)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.5,
              }}
            >
              {car.description}
            </p>
          )}

          {/* Pricing Highlight */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              padding: '0.75rem var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-muted)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Daily Rate
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-gold)' }}>
                ${car.daily_rate.toFixed(0)}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>/ day</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <button
            onClick={() => onSelectDetails(car)}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.65rem 0.5rem' }}
          >
            Details
          </button>
          <button
            onClick={() => onSelectBook(car)}
            disabled={!isAvailable}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.65rem 0.5rem' }}
          >
            <span>{isAvailable ? 'Book Now' : 'Unavailable'}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
