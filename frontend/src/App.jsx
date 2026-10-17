import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DiscoverPage from './pages/DiscoverPage';
import MyRentalsPage from './pages/MyRentalsPage';
import CarDetailsModal from './features/cars/CarDetailsModal';
import BookingFormModal from './features/bookings/BookingFormModal';
import BookingSuccessModal from './features/bookings/BookingSuccessModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'rentals'

  // Modals state
  const [detailsCar, setDetailsCar] = useState(null);
  const [bookingCar, setBookingCar] = useState(null);
  const [bookingDates, setBookingDates] = useState({ start: '', end: '' });
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [fleetRefreshTrigger, setFleetRefreshTrigger] = useState(0);

  const handleOpenDetails = (car) => {
    setDetailsCar(car);
  };

  const handleOpenBook = (car, start = '', end = '') => {
    setDetailsCar(null);
    setBookingCar(car);
    setBookingDates({ start, end });
  };

  const handleBookingSuccess = (rental, car) => {
    setBookingCar(null);
    setConfirmedReservation({ rental, car });
    // Trigger fleet refresh to update availability
    setFleetRefreshTrigger((prev) => prev + 1);
  };

  const handleRentalCancelled = (rentalId) => {
    // Dates released, refresh fleet
    setFleetRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ flex: 1 }}>
        {activeTab === 'discover' ? (
          <DiscoverPage
            key={fleetRefreshTrigger}
            onSelectCarDetails={handleOpenDetails}
            onSelectCarBook={(car) => handleOpenBook(car)}
          />
        ) : (
          <MyRentalsPage
            onNavigateDiscover={() => setActiveTab('discover')}
            onRentalCancelled={handleRentalCancelled}
          />
        )}
      </main>

      <Footer onTabChange={setActiveTab} />

      {/* Vehicle Details Modal */}
      {detailsCar && (
        <CarDetailsModal
          car={detailsCar}
          onClose={() => setDetailsCar(null)}
          onBookWithDates={(car, start, end) => handleOpenBook(car, start, end)}
        />
      )}

      {/* Booking Form Modal */}
      {bookingCar && (
        <BookingFormModal
          car={bookingCar}
          initialStartDate={bookingDates.start}
          initialEndDate={bookingDates.end}
          onClose={() => setBookingCar(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Booking Success Modal */}
      {confirmedReservation && (
        <BookingSuccessModal
          rental={confirmedReservation.rental}
          car={confirmedReservation.car}
          onClose={() => setConfirmedReservation(null)}
          onViewRentals={() => setActiveTab('rentals')}
        />
      )}
    </div>
  );
}
