import React, { useState, useEffect } from 'react';
import { BookmarkCheck, RefreshCw, Search, ShieldCheck, AlertCircle, ArrowLeft, Trash2, Calendar } from 'lucide-react';
import { rentalService } from '../api/client';
import RentalCard from '../features/rentals/RentalCard';
import CancelConfirmModal from '../features/rentals/CancelConfirmModal';

export default function MyRentalsPage({ onNavigateDiscover, onRentalCancelled }) {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | ACTIVE | CANCELLED
  const [rentalToCancel, setRentalToCancel] = useState(null);
  const [cancelNotification, setCancelNotification] = useState('');

  const fetchRentals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rentalService.getRentals();
      setRentals(data);
    } catch (err) {
      console.error('Failed to load rentals:', err);
      setError(err.message || 'Unable to retrieve reservations from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleCancelSuccess = (rentalId) => {
    setRentalToCancel(null);
    setCancelNotification(`Rental #${rentalId} has been successfully cancelled. The reserved dates have been released.`);
    // Refresh rentals list from backend
    fetchRentals();
    if (onRentalCancelled) {
      onRentalCancelled(rentalId);
    }
  };

  const filteredRentals = rentals.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) {
      return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesUser = r.user_name.toLowerCase().includes(term);
      const matchesCar = r.car ? `${r.car.make} ${r.car.model}`.toLowerCase().includes(term) : false;
      const matchesId = String(r.id).includes(term);
      if (!matchesUser && !matchesCar && !matchesId) return false;
    }
    return true;
  });

  const activeCount = rentals.filter((r) => r.status === 'ACTIVE').length;
  const cancelledCount = rentals.filter((r) => r.status === 'CANCELLED').length;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-20)' }}>
      <div className="container">
        {/* Header Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <button
              onClick={onNavigateDiscover}
              className="btn btn-ghost"
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem', marginBottom: 'var(--space-2)' }}
            >
              <ArrowLeft size={16} /> Back to Fleet Showcase
            </button>
            <h1 style={{ fontSize: '2.2rem' }}>My Reservations</h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Manage your active vehicle agreements and rental history.
            </p>
          </div>

          <button
            onClick={fetchRentals}
            disabled={loading}
            className="btn btn-secondary"
            title="Refresh bookings"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1.1rem' }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Status Toast Notification */}
        {cancelNotification && (
          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success-bg)',
              border: '1px solid var(--success-border)',
              color: 'var(--success-text)',
              marginBottom: 'var(--space-6)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <ShieldCheck size={18} />
              <span>{cancelNotification}</span>
            </div>
            <button
              onClick={() => setCancelNotification('')}
              className="btn btn-ghost"
              style={{ padding: '2px 8px', fontSize: '0.8rem' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <div className="glass-panel" style={{ padding: 'var(--space-4) var(--space-5)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Records</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {rentals.length}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: 'var(--space-4) var(--space-5)', borderLeft: '3px solid var(--color-champagne-gold)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Active Bookings</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-gold)' }}>
              {activeCount}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: 'var(--space-4) var(--space-5)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Cancelled Bookings</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>
              {cancelledCount}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-6)',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`btn ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-full)' }}
            >
              All ({rentals.length})
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`btn ${statusFilter === 'ACTIVE' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-full)' }}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('CANCELLED')}
              className={`btn ${statusFilter === 'CANCELLED' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-full)' }}
            >
              Cancelled ({cancelledCount})
            </button>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search by name, car, or ID..."
              style={{ paddingLeft: '2.2rem', fontSize: '0.85rem', padding: '0.5rem 0.8rem 0.5rem 2.2rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--border-subtle)',
                borderTopColor: 'var(--color-champagne-gold)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto var(--space-4)',
              }}
            />
            <p style={{ color: 'var(--text-muted)' }}>Fetching reservations from backend...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className="glass-panel"
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              maxWidth: '520px',
              margin: 'var(--space-8) auto',
              border: '1px solid var(--danger-border)',
            }}
          >
            <AlertCircle size={32} style={{ color: 'var(--danger-text)', margin: '0 auto var(--space-3)' }} />
            <h3 style={{ color: 'var(--danger-text)', marginBottom: 'var(--space-2)' }}>Failed to Load Bookings</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>{error}</p>
            <button onClick={fetchRentals} className="btn btn-primary">
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRentals.length === 0 && (
          <div
            className="glass-panel"
            style={{
              padding: 'var(--space-16) var(--space-6)',
              textAlign: 'center',
              maxWidth: '560px',
              margin: 'var(--space-8) auto',
            }}
          >
            <BookmarkCheck size={48} style={{ color: 'var(--color-champagne-gold)', margin: '0 auto var(--space-3)' }} />
            <h3 style={{ marginBottom: 'var(--space-2)' }}>No Bookings Found</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
              {searchTerm || statusFilter !== 'ALL'
                ? 'No reservations matched your active search or status filter.'
                : 'You have not reserved any vehicles yet. Explore our fleet to book your next prestigious journey.'}
            </p>
            <button onClick={onNavigateDiscover} className="btn btn-primary">
              Discover Fleet
            </button>
          </div>
        )}

        {/* Rentals List */}
        {!loading && !error && filteredRentals.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-16)' }}>
            {filteredRentals.map((rental) => (
              <RentalCard
                key={rental.id}
                rental={rental}
                onCancelRequest={(r) => setRentalToCancel(r)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Dialog */}
      {rentalToCancel && (
        <CancelConfirmModal
          rental={rentalToCancel}
          onClose={() => setRentalToCancel(null)}
          onCancelled={handleCancelSuccess}
        />
      )}
    </div>
  );
}
