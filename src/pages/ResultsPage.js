import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ResultsPage.css';

const ResultsPage = () => {
  const sampleCars = [
    // Toyota
    { id: 1, make: 'Toyota', model: 'Camry', year: 2018, price: 20000, mileage: 30000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90001', driveType: 'FWD', bodyStyle: 'Sedan', engineType: 'V4', color: 'Red', image: 'https://via.placeholder.com/280x180' },
    { id: 2, make: 'Toyota', model: 'Corolla', year: 2019, price: 18000, mileage: 25000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90002', driveType: 'FWD', bodyStyle: 'Sedan', engineType: 'V4', color: 'Blue', image: 'https://via.placeholder.com/280x180' },
    { id: 3, make: 'Toyota', model: 'RAV4', year: 2020, price: 25000, mileage: 15000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90003', driveType: 'AWD', bodyStyle: 'SUV', engineType: 'V4', color: 'White', image: 'https://via.placeholder.com/280x180' },

    // Honda
    { id: 4, make: 'Honda', model: 'Civic', year: 2020, price: 18000, mileage: 20000, transmission: 'Manual', fuelType: 'Gasoline', location: '90002', driveType: 'FWD', bodyStyle: 'Sedan', engineType: 'V4', color: 'Blue', image: 'https://via.placeholder.com/280x180' },
    { id: 5, make: 'Honda', model: 'Accord', year: 2019, price: 22000, mileage: 15000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90004', driveType: 'FWD', bodyStyle: 'Sedan', engineType: 'V4', color: 'Black', image: 'https://via.placeholder.com/280x180' },
    { id: 6, make: 'Honda', model: 'CR-V', year: 2018, price: 23000, mileage: 30000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90005', driveType: 'AWD', bodyStyle: 'SUV', engineType: 'V4', color: 'Gray', image: 'https://via.placeholder.com/280x180' },

    // Ford
    { id: 7, make: 'Ford', model: 'F-150', year: 2021, price: 35000, mileage: 10000, transmission: 'Automatic', fuelType: 'Diesel', location: '90001', driveType: 'AWD', bodyStyle: 'Truck', engineType: 'V6', color: 'Black', image: 'https://via.placeholder.com/280x180' },
    { id: 8, make: 'Ford', model: 'Escape', year: 2020, price: 24000, mileage: 12000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90006', driveType: 'FWD', bodyStyle: 'SUV', engineType: 'V4', color: 'Blue', image: 'https://via.placeholder.com/280x180' },
    { id: 9, make: 'Ford', model: 'Mustang', year: 2019, price: 28000, mileage: 20000, transmission: 'Manual', fuelType: 'Gasoline', location: '90007', driveType: 'RWD', bodyStyle: 'Coupe', engineType: 'V8', color: 'Red', image: 'https://via.placeholder.com/280x180' },

    // Chevrolet
    { id: 10, make: 'Chevrolet', model: 'Silverado', year: 2020, price: 30000, mileage: 10000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90008', driveType: 'AWD', bodyStyle: 'Truck', engineType: 'V8', color: 'White', image: 'https://via.placeholder.com/280x180' },
    { id: 11, make: 'Chevrolet', model: 'Malibu', year: 2019, price: 17000, mileage: 15000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90009', driveType: 'FWD', bodyStyle: 'Sedan', engineType: 'V4', color: 'Gray', image: 'https://via.placeholder.com/280x180' },
    { id: 12, make: 'Chevrolet', model: 'Equinox', year: 2018, price: 19000, mileage: 20000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90010', driveType: 'AWD', bodyStyle: 'SUV', engineType: 'V4', color: 'Blue', image: 'https://via.placeholder.com/280x180' },

    // Nissan
    { id: 13, make: 'Nissan', model: 'Altima', year: 2021, price: 22000, mileage: 10000, transmission: 'Automatic', fuelType: 'Hybrid', location: '90002', driveType: 'FWD', bodyStyle: 'Sedan', engineType: 'V4', color: 'Gray', image: 'https://via.placeholder.com/280x180' },
    { id: 14, make: 'Nissan', model: 'Rogue', year: 2020, price: 25000, mileage: 12000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90011', driveType: 'AWD', bodyStyle: 'SUV', engineType: 'V4', color: 'White', image: 'https://via.placeholder.com/280x180' },
    { id: 15, make: 'Nissan', model: 'Sentra', year: 2019, price: 15000, mileage: 22000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90012', driveType: 'FWD', bodyStyle: 'Sedan', engineType: 'V4', color: 'Black', image: 'https://via.placeholder.com/280x180' },

    // BMW
    { id: 16, make: 'BMW', model: '3 Series', year: 2020, price: 35000, mileage: 15000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90001', driveType: 'RWD', bodyStyle: 'Sedan', engineType: 'V6', color: 'Black', image: 'https://via.placeholder.com/280x180' },
    { id: 17, make: 'BMW', model: '5 Series', year: 2019, price: 45000, mileage: 18000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90013', driveType: 'RWD', bodyStyle: 'Sedan', engineType: 'V6', color: 'Gray', image: 'https://via.placeholder.com/280x180' },
    { id: 18, make: 'BMW', model: 'X5', year: 2021, price: 50000, mileage: 5000, transmission: 'Automatic', fuelType: 'Gasoline', location: '90014', driveType: 'AWD', bodyStyle: 'SUV', engineType: 'V6', color: 'Blue', image: 'https://via.placeholder.com/280x180' },
    
    // Add Mercedes, Audi, Hyundai, and Kia similarly...
  ];
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Filter states
  const [make, setMake] = useState(queryParams.get('make') || '');
  const [model, setModel] = useState(queryParams.get('model') || '');
  const [zip, setZip] = useState(queryParams.get('location') || '');
  const [radius, setRadius] = useState('10'); 
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [driveType, setDriveType] = useState('');
  const [bodyStyle, setBodyStyle] = useState('');
  const [engineType, setEngineType] = useState('');
  const [color, setColor] = useState('');
  const [savedCars, setSavedCars] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedCars')) || [];
    setSavedCars(saved);
  }, []);

  const toggleSaveCar = (car) => {
    const updatedSavedCars = savedCars.some(savedCar => savedCar.id === car.id)
      ? savedCars.filter(savedCar => savedCar.id !== car.id)
      : [...savedCars, car];

    setSavedCars(updatedSavedCars);
    localStorage.setItem('savedCars', JSON.stringify(updatedSavedCars));
  };

  // Models based on selected make
  const modelsByMake = {
    Toyota: ['Camry', 'Corolla', 'RAV4'],
    Honda: ['Civic', 'Accord', 'CR-V'],
    Ford: ['F-150', 'Escape', 'Mustang'],
    Chevrolet: ['Silverado', 'Malibu', 'Equinox'],
    Nissan: ['Altima', 'Rogue', 'Sentra'],
    BMW: ['3 Series', '5 Series', 'X5'],
    Mercedes: ['C-Class', 'E-Class', 'GLA'],
    Audi: ['A4', 'Q5', 'A6'],
    Hyundai: ['Elantra', 'Sonata', 'Tucson'],
    Kia: ['Sorento', 'Sportage', 'Optima']
  };

  const filteredCars = sampleCars.filter(car => {
    return (
      (!make || car.make === make) &&
      (!model || car.model === model) &&
      (!zip || car.location === zip) &&
      (!minYear || car.year >= parseInt(minYear)) &&
      (!maxYear || car.year <= parseInt(maxYear)) &&
      (!minPrice || car.price >= parseInt(minPrice)) &&
      (!maxPrice || car.price <= parseInt(maxPrice)) &&
      (!mileage || car.mileage <= parseInt(mileage)) &&
      (!transmission || car.transmission === transmission) &&
      (!fuelType || car.fuelType === fuelType) &&
      (!driveType || car.driveType === driveType) &&
      (!bodyStyle || car.bodyStyle === bodyStyle) &&
      (!engineType || car.engineType === engineType) &&
      (!color || car.color === color)
    );
  });

  return (
    <div className="results-page">
      <h2 className="results-title">Search Results</h2>
      <div className="results-container">
        
        {/* Filter Panel */}
        <div className="filter-panel">
          <div className="form-section">
            <label>Make:</label>
            <select value={make} onChange={(e) => { setMake(e.target.value); setModel(''); }}>
              <option value="">Any</option>
              {Object.keys(modelsByMake).map(makeOption => (
                <option key={makeOption} value={makeOption}>{makeOption}</option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label>Model:</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
              <option value="">Any</option>
              {make && modelsByMake[make].map(modelOption => (
                <option key={modelOption} value={modelOption}>{modelOption}</option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label>Distance:</label>
            <select value={radius} onChange={(e) => setRadius(e.target.value)}>
              <option value="10">10 miles</option>
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
              <option value="100">100 miles</option>
              <option value="150">150 miles</option>
              <option value="200">200 miles</option>
              <option value="500">500 miles</option>
            </select>
          </div>

          <div className="form-section">
            <label>ZIP Code:</label>
            <input type="text" placeholder="Enter ZIP code" value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>

          <div className="form-section">
            <label>Year Range:</label>
            <select value={minYear} onChange={(e) => setMinYear(e.target.value)}>
              <option value="">Min Year</option>
              {[...Array(23)].map((_, i) => (
                <option key={i} value={2000 + i}>{2000 + i}</option>
              ))}
            </select>
            <select value={maxYear} onChange={(e) => setMaxYear(e.target.value)}>
              <option value="">Max Year</option>
              {[...Array(23)].map((_, i) => (
                <option key={i} value={2000 + i}>{2000 + i}</option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label>Price Range:</label>
            <select value={minPrice} onChange={(e) => setMinPrice(e.target.value)}>
              <option value="">Min Price</option>
              {[10000, 20000, 30000, 40000, 50000, 60000].map(price => (
                <option key={price} value={price}>{`$${price.toLocaleString()}`}</option>
              ))}
            </select>
            <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
              <option value="">Max Price</option>
              {[20000, 30000, 40000, 50000, 60000, 70000, 80000].map(price => (
                <option key={price} value={price}>{`$${price.toLocaleString()}`}</option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label>Mileage (Max):</label>
            <select value={mileage} onChange={(e) => setMileage(e.target.value)}>
              <option value="">Any Mileage</option>
              {[10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000].map(m => (
                <option key={m} value={m}>{`${m.toLocaleString()} miles`}</option>
              ))}
            </select>
          </div>

          {/* Additional filters (Transmission, Fuel Type, etc.) */}
          <div className="form-section">
            <label>Transmission:</label>
            <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
              <option value="">Any</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="form-section">
            <label>Fuel Type:</label>
            <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
              <option value="">Any</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-section">
            <label>Drive Type:</label>
            <select value={driveType} onChange={(e) => setDriveType(e.target.value)}>
              <option value="">Any</option>
              <option value="FWD">Front Wheel Drive (FWD)</option>
              <option value="AWD">All Wheel Drive (AWD)</option>
              <option value="RWD">Rear Wheel Drive (RWD)</option>
            </select>
          </div>

          <div className="form-section">
            <label>Body Style:</label>
            <select value={bodyStyle} onChange={(e) => setBodyStyle(e.target.value)}>
              <option value="">Any</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Coupe">Coupe</option>
            </select>
          </div>

          <div className="form-section">
            <label>Engine Type:</label>
            <select value={engineType} onChange={(e) => setEngineType(e.target.value)}>
              <option value="">Any</option>
              <option value="V4">V4</option>
              <option value="V6">V6</option>
              <option value="V8">V8</option>
            </select>
          </div>

          <div className="form-section">
            <label>Color:</label>
            <select value={color} onChange={(e) => setColor(e.target.value)}>
              <option value="">Any</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Gray">Gray</option>
            </select>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="vehicle-list">
          {filteredCars.length ? (
            filteredCars.map((car) => (
              <div key={car.id} className="vehicle-card">
                <img src={car.image} alt={`${car.make} ${car.model}`} />
                <h3>{car.year} {car.make} {car.model}</h3>
                <p>Location: {car.location}</p>
                <p>Mileage: {car.mileage} miles</p>
                <i
                  className={`heart-icon ${savedCars.some(savedCar => savedCar.id === car.id) ? 'fas fa-heart' : 'far fa-heart'}`}
                  onClick={() => toggleSaveCar(car)}
                ></i>
              </div>
            ))
          ) : (
            <p>No results found for the given criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;