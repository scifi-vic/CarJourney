import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import '../styles/AdvancedSearchPage.css';

const AdvancedSearchPage = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [bodyStyle, setBodyStyle] = useState('');
  const [driveType, setDriveType] = useState('');
  const [color, setColor] = useState('');
  const [keyword, setKeyword] = useState('');
  const [condition, setCondition] = useState('');
  const [features, setFeatures] = useState({
    bluetooth: false,
    backupCamera: false,
    navigation: false,
    sunroof: false,
    heatedSeats: false,
  });
  const [zipCode, setZipCode] = useState('');
  const [distance, setDistance] = useState('');

  const autocompleteRef = useRef(null);
  const navigate = useNavigate();

  const handleFeatureChange = (feature) => {
    setFeatures({ ...features, [feature]: !features[feature] });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const searchParams = new URLSearchParams({
      make,
      model,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      mileage,
      transmission,
      fuelType,
      bodyStyle,
      driveType,
      color,
      keyword,
      condition,
      zipCode,
      distance,
      ...Object.entries(features)
        .filter(([_, value]) => value)
        .reduce((acc, [key]) => ({ ...acc, [key]: 'true' }), {}),
    }).toString();

    console.log(`/results?${searchParams}`); // Debugging output
    navigate(`/results?${searchParams}`);
  };

  const getModelsForMake = (make) => {
    const models = {
      Toyota: ['Camry', 'Corolla'],
      Honda: ['Civic', 'Accord'],
      Ford: ['F-150', 'Mustang'],
    };
    return models[make] || [];
  };

  const handleLoadError = () => {
    console.error('Failed to load Google Maps script.');
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAY4vk_b9RuHBKY89uUt_vMD7OTwAgY5TU"
      libraries={['places']}
      onError={handleLoadError}
      onLoad={() => console.log('Google Maps Script Loaded Successfully')}
    >
      <div className="advanced-search-page">
        <h2>Advanced Search</h2>
        <form onSubmit={handleSearch} className="advanced-search-form">
          <div className="form-group">
            <label>Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keywords (e.g., sunroof, leather)"
            />
          </div>

          <div className="form-group">
            <label>Make</label>
            <select value={make} onChange={(e) => setMake(e.target.value)}>
              <option value="">Any</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
            </select>
          </div>

          <div className="form-group">
            <label>Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
              <option value="">Any</option>
              {getModelsForMake(make).map((mod) => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Condition</label>
            <select value={condition} onChange={(e) => setCondition(e.target.value)}>
              <option value="">Any</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Certified">Certified Pre-Owned (CPO)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price Range</label>
            <select value={minPrice} onChange={(e) => setMinPrice(e.target.value)}>
              <option value="">Min</option>
              {[1000, 5000, 10000, 20000, 30000].map((price) => (
                <option key={price} value={price}>${price.toLocaleString()}</option>
              ))}
            </select>
            <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
              <option value="">Max</option>
              {[10000, 20000, 30000, 40000, 50000].map((price) => (
                <option key={price} value={price}>${price.toLocaleString()}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Year Range</label>
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

          <div className="form-group">
            <label>Mileage (Max)</label>
            <select value={mileage} onChange={(e) => setMileage(e.target.value)}>
              <option value="">Any Mileage</option>
              {[10000, 20000, 30000, 40000, 50000].map((m) => (
                <option key={m} value={m}>{`${m.toLocaleString()} miles`}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Transmission</label>
            <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
              <option value="">Any</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fuel Type</label>
            <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
              <option value="">Any</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Body Style</label>
            <select value={bodyStyle} onChange={(e) => setBodyStyle(e.target.value)}>
              <option value="">Any</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Coupe">Coupe</option>
            </select>
          </div>

          <div className="form-group">
            <label>Drive Type</label>
            <select value={driveType} onChange={(e) => setDriveType(e.target.value)}>
              <option value="">Any</option>
              <option value="FWD">Front Wheel Drive (FWD)</option>
              <option value="AWD">All Wheel Drive (AWD)</option>
              <option value="RWD">Rear Wheel Drive (RWD)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Color</label>
            <select value={color} onChange={(e) => setColor(e.target.value)}>
              <option value="">Any</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Gray">Gray</option>
            </select>
          </div>

          <div className="form-group features-container">
            <label>Features</label>
            <div>
              <input
                type="checkbox"
                checked={features.bluetooth}
                onChange={() => handleFeatureChange('bluetooth')}
              />
              <label>Bluetooth</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={features.backupCamera}
                onChange={() => handleFeatureChange('backupCamera')}
              />
              <label>Backup Camera</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={features.navigation}
                onChange={() => handleFeatureChange('navigation')}
              />
              <label>Navigation</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={features.sunroof}
                onChange={() => handleFeatureChange('sunroof')}
              />
              <label>Sunroof</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={features.heatedSeats}
                onChange={() => handleFeatureChange('heatedSeats')}
              />
              <label>Heated Seats</label>
            </div>
          </div>

          <div className="form-group">
            <label>ZIP Code</label>
            <Autocomplete
              onLoad={(autocomplete) => {
                console.log('Autocomplete loaded:', autocomplete);
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={() => {
                if (autocompleteRef.current) {
                  const place = autocompleteRef.current.getPlace();
                  const postalCode = place?.address_components?.find((comp) =>
                    comp.types.includes('postal_code')
                  )?.long_name;
                  setZipCode(postalCode || zipCode);
                }
              }}
            >
              <input
                type="text"
                placeholder="Enter ZIP Code or address"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                style={{ width: '100%', height: '40px' }}
              />
            </Autocomplete>
          </div>

          <div className="form-group">
            <label>Distance (miles)</label>
            <select value={distance} onChange={(e) => setDistance(e.target.value)}>
              <option value="">Any Distance</option>
              {[5, 10, 25, 50, 100].map((dist) => (
                <option key={dist} value={dist}>{`${dist} miles`}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>
    </LoadScript>
  );
};

export default AdvancedSearchPage;
