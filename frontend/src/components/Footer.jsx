import React from 'react';
import { ShieldCheck, Award, Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer({ onTabChange }) {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: 'var(--space-20)',
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-10)',
        transition: 'all var(--transition-normal)',
      }}
    >
      <div className="container">
        {/* Value Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-8)',
            paddingBottom: 'var(--space-12)',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: 'var(--space-12)',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <div
              style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(216, 173, 126, 0.15)',
                color: 'var(--color-champagne-gold)',
              }}
            >
              <Award size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Curated Fleet</h4>
              <p style={{ fontSize: '0.85rem' }}>Direct manufacturer specs, pristine hand-detailed interiors, and performance tuning.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <div
              style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(216, 173, 126, 0.15)',
                color: 'var(--color-champagne-gold)',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Conflict-Free Booking</h4>
              <p style={{ fontSize: '0.85rem' }}>Strict transactional scheduling ensures guaranteed availability on your exact dates.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <div
              style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(216, 173, 126, 0.15)',
                color: 'var(--color-champagne-gold)',
              }}
            >
              <Clock size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Instant Concierge</h4>
              <p style={{ fontSize: '0.85rem' }}>White-glove handover, flexible cancellation release, and seamless mobile check-in.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-10)',
            marginBottom: 'var(--space-12)',
          }}
        >
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <img
                src="/drivora-logo.jpg"
                alt="Drivora"
                style={{ height: '42px', width: '42px', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
              />
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.35rem', letterSpacing: '0.06em' }}>
                  DRIVORA
                </span>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-champagne-gold)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Drive • Rent • Explore
                </div>
              </div>
            </div>
            <p style={{ maxWidth: '380px', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Drivora delivers an unrivaled automotive journey with prestige grand tourers, electric pioneers, and handcrafted luxury sedans.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-champagne-gold)', marginBottom: 'var(--space-4)' }}>
              Navigation
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: '0.9rem' }}>
              <li>
                <a href="#fleet" onClick={(e) => { e.preventDefault(); onTabChange('discover'); }}>
                  Fleet Showcase
                </a>
              </li>
              <li>
                <a href="#rentals" onClick={(e) => { e.preventDefault(); onTabChange('rentals'); }}>
                  My Bookings
                </a>
              </li>
              <li>
                <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer">
                  OpenAPI Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Concierge */}
          <div>
            <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-champagne-gold)', marginBottom: 'var(--space-4)' }}>
              Concierge
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: '0.88rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Phone size={15} style={{ color: 'var(--color-champagne-gold)' }} />
                <span>+1 (800) 555-DRVR</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Mail size={15} style={{ color: 'var(--color-champagne-gold)' }} />
                <span>concierge@drivora.com</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MapPin size={15} style={{ color: 'var(--color-champagne-gold)' }} />
                <span>Beverly Hills & Silicon Valley</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 'var(--space-6)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            gap: 'var(--space-4)',
          }}
        >
          <div>
            © {new Date().getFullYear()} DRIVORA Inc. All rights reserved. Premium Mobility Systems.
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <span>Half-Open Booking Intervals: [start_date, end_date)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
