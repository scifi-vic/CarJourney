import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete } from '@react-google-maps/api';
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

    console.log(`/results?${searchParams}`);
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

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const postalCode = place?.address_components?.find((comp) =>
        comp.types.includes('postal_code')
      )?.long_name;
      setZipCode(postalCode || '');
    }
  };

  return (
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
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!make}
          >
            <option value="">Any</option>
            {getModelsForMake(make).map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
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
              <option key={price} value={price}>
                ${price.toLocaleString()}
              </option>
            ))}
          </select>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
            <option value="">Max</option>
            {[10000, 20000, 30000, 40000, 50000].map((price) => (
              <option key={price} value={price}>
                ${price.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>ZIP Code</label>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
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

        <div className="form-group features-container">
          <label>Features</label>
          {Object.keys(features).map((feature) => (
            <div key={feature}>
              <input
                type="checkbox"
                checked={features[feature]}
                onChange={() => handleFeatureChange(feature)}
              />
              <label>{feature.charAt(0).toUpperCase() + feature.slice(1)}</label>
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Year Range</label>
          <select value={minYear} onChange={(e) => setMinYear(e.target.value)}>
            <option value="">Min Year</option>
            {[...Array(23)].map((_, i) => (
              <option key={i} value={2000 + i}>
                {2000 + i}
              </option>
            ))}
          </select>
          <select value={maxYear} onChange={(e) => setMaxYear(e.target.value)}>
            <option value="">Max Year</option>
            {[...Array(23)].map((_, i) => (
              <option key={i} value={2000 + i}>
                {2000 + i}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Mileage (Max)</label>
          <select value={mileage} onChange={(e) => setMileage(e.target.value)}>
            <option value="">Any Mileage</option>
            {[10000, 20000, 30000, 40000, 50000].map((mileage) => (
              <option key={mileage} value={mileage}>
                {`${mileage.toLocaleString()} miles`}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default AdvancedSearchPage;
