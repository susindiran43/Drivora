-- DRIVORA Fleet Database Seed Data
-- Premium luxury, grand tourer, electric, executive SUV, and sports cars
-- Repeatable and idempotent: uses INSERT OR IGNORE with fixed IDs

INSERT OR IGNORE INTO cars (id, make, model, year, daily_rate, available, category, image_url, description)
VALUES 
(1, 'Porsche', 'Taycan Turbo S', 2024, 380.0, 1, 'Electric', 
 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80', 
 'Twin electric motors generating 750 horsepower with Launch Control. 0-60 mph in 2.6 seconds with bespoke leather cabin.'),

(2, 'Aston Martin', 'DB12 Coupe', 2024, 520.0, 1, 'Grand Tourer', 
 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80', 
 'The quintessential Super Tourer. 4.0L Twin-Turbo V8 pushing 671 bhp wrapped in hand-stitched Bridge of Weir leather.'),

(3, 'Mercedes-Benz', 'AMG GT Black Series', 2023, 490.0, 1, 'Sports', 
 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80', 
 'Flat-plane crank V8 engine producing 720 hp. Carbon fiber aerodynamics tuned directly on the Nürburgring Nordschleife.'),

(4, 'Bentley', 'Continental GT Speed', 2024, 550.0, 1, 'Grand Tourer', 
 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80', 
 '6.0-litre W12 engine offering peerless long-distance touring refinement, diamond-in-diamond quilting, and rotating dashboard.'),

(5, 'Range Rover', 'SV Autobiography Long Wheelbase', 2024, 420.0, 1, 'Executive SUV', 
 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', 
 'Executive class rear seating with hot stone massage, deployable club tables, and whisper-quiet active noise cancellation.'),

(6, 'Lucid', 'Air Sapphire', 2024, 440.0, 1, 'Electric', 
 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', 
 'Tri-motor all-electric powertrain delivering 1,234 hp. Over 420 miles of range with sub-2-second 0-60 acceleration.'),

(7, 'BMW', 'M8 Competition Gran Coupe', 2023, 360.0, 1, 'Luxury Sedan', 
 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', 
 '617-hp 4.4-liter M TwinPower Turbo V8 paired with M xDrive intelligent all-wheel-drive and Merino leather appointments.'),

(8, 'Audi', 'RS e-tron GT', 2024, 340.0, 1, 'Electric', 
 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80', 
 'Progressive Gran Turismo electric design with 637 hp boost mode, all-wheel steering, and tungsten carbide coated brakes.'),

(9, 'Ferrari', 'Roma', 2023, 650.0, 1, 'Sports', 
 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80', 
 'La Nuova Dolce Vita embodied. 612 hp front-mid mounted 3.9L turbo V8 with 8-speed dual-clutch transmission.'),

(10, 'Rolls-Royce', 'Ghost Extended', 2024, 850.0, 1, 'Ultra Luxury', 
 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', 
 'Effortless 6.75-litre twin-turbocharged V12 engine, Planar Suspension System, and bespoke Starlight Headliner.'),

(11, 'Lamborghini', 'Urus Performante', 2024, 590.0, 1, 'Executive SUV', 
 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80', 
 'Super SUV powered by a 657 hp Twin-Turbo V8 with carbon-fiber hood, rear spoiler, and titanium Akrapovič exhaust.'),

(12, 'Maserati', 'MC20 Cielo', 2024, 580.0, 0, 'Sports', 
 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', 
 'Retractable smart glass roof, carbon fiber monocoque, and patented F1-derived Nettuno 621 hp V6. Currently in scheduled service.');
