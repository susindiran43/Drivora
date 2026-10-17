import React, { useEffect, useState } from 'react';
import { Car, BookmarkCheck, ShieldCheck, AlertCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { systemService } from '../api/client';

export default function Navbar({ activeTab, onTabChange }) {
  const [apiHealthy, setApiHealthy] = useState(null);

  useEffect(() => {
    let mounted = true;
    const checkStatus = async () => {
      try {
        const res = await systemService.getHealth();
        if (mounted) setApiHealthy(res.status === 'ok');
      } catch (err) {
        if (mounted) setApiHealthy(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'all var(--transition-normal)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem var(--space-6)' }}>
        {/* Brand Logo & Name */}
        <div
          onClick={() => onTabChange('discover')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <img
            src="/drivora-logo.jpg"
            alt="Drivora Logo"
            style={{
              height: '46px',
              width: '46px',
              objectFit: 'contain',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              DRIVORA
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: 'var(--color-champagne-gold)',
                textTransform: 'uppercase',
                marginTop: '3px',
              }}
            >
              Drive • Rent • Explore
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button
            onClick={() => onTabChange('discover')}
            className={`btn ${activeTab === 'discover' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
          >
            <Car size={16} />
            <span>Fleet</span>
          </button>

          <button
            onClick={() => onTabChange('rentals')}
            className={`btn ${activeTab === 'rentals' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
          >
            <BookmarkCheck size={16} />
            <span>My Bookings</span>
          </button>

          {/* API Health Pill */}
          <div
            title={apiHealthy === true ? 'Backend API Connected' : apiHealthy === false ? 'API Disconnected' : 'Checking status...'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 600,
              backgroundColor: apiHealthy === true ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: apiHealthy === true ? '#10b981' : '#ef4444',
              border: `1px solid ${apiHealthy === true ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: apiHealthy === true ? '#10b981' : '#ef4444',
              }}
            />
            <span style={{ display: 'none', md: 'inline' }}>
              {apiHealthy === true ? 'Live' : apiHealthy === false ? 'Offline' : 'Connecting'}
            </span>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
