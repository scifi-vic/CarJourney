import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [isCpo, setIsCpo] = useState(false);
  const [condition, setCondition] = useState('');
  const [features, setFeatures] = useState({
    bluetooth: false,
    backupCamera: false,
    navigation: false,
    sunroof: false,
    heatedSeats: false,
  });

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
      isCpo: isCpo ? 'true' : 'false',
      condition,
      ...Object.entries(features)
        .filter(([_, value]) => value)
        .reduce((acc, [key]) => ({ ...acc, [key]: 'true' }), {}),
    }).toString();

    navigate(`/results?${searchParams}`);
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
            <option value="Chevrolet">Chevrolet</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes">Mercedes</option>
            <option value="Audi">Audi</option>
          </select>
        </div>

        <div className="form-group">
          <label>Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
            <option value="">Any</option>
            {make === 'Toyota' && <option value="Camry">Camry</option>}
            {make === 'Toyota' && <option value="Corolla">Corolla</option>}
            {make === 'Honda' && <option value="Civic">Civic</option>}
            {make === 'Honda' && <option value="Accord">Accord</option>}
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

        <div className="form-group checkbox-group">
          <input 
            type="checkbox" 
            checked={isCpo} 
            onChange={() => setIsCpo(!isCpo)} 
          />
          <label>Certified Pre-Owned</label>
        </div>

        <div className="form-group">
          <label>Price Range</label>
          <select value={minPrice} onChange={(e) => setMinPrice(e.target.value)}>
            <option value="">Min</option>
            {[1000, 5000, 10000, 20000, 30000].map(price => (
              <option key={price} value={price}>${price.toLocaleString()}</option>
            ))}
          </select>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
            <option value="">Max</option>
            {[10000, 20000, 30000, 40000, 50000].map(price => (
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
            {[10000, 20000, 30000, 40000, 50000].map(m => (
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
            <input type="checkbox" checked={features.bluetooth} onChange={() => handleFeatureChange('bluetooth')} />
            <label>Bluetooth</label>
          </div>
          <div>
            <input type="checkbox" checked={features.backupCamera} onChange={() => handleFeatureChange('backupCamera')} />
            <label>Backup Camera</label>
          </div>
          <div>
            <input type="checkbox" checked={features.navigation} onChange={() => handleFeatureChange('navigation')} />
            <label>Navigation</label>
          </div>
          <div>
            <input type="checkbox" checked={features.sunroof} onChange={() => handleFeatureChange('sunroof')} />
            <label>Sunroof</label>
          </div>
          <div>
            <input type="checkbox" checked={features.heatedSeats} onChange={() => handleFeatureChange('heatedSeats')} />
            <label>Heated Seats</label>
          </div>
        </div>

        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
};

export default AdvancedSearchPage;
