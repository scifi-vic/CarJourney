import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CarSearchPage.css';

const CarSearchPage = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('10');
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({ make, model, location, radius }).toString();
    navigate(`/results?${query}`);
  };

  const handleAdvancedSearchRedirect = () => {
    navigate('/advanced-search');
  };

  return (
    <div className="car-search-page">
      <div className="search-card">
        <h1>Begin Your Car Journey Here</h1>
        <form onSubmit={handleSubmit} className="car-search-form">
          <div className="form-section">
            <label>Make:</label>
            <select value={make} onChange={(e) => {
              setMake(e.target.value);
              setModel('');
            }}>
              <option value="">Select Make</option>
              {Object.keys(modelsByMake).map((makeOption) => (
                <option key={makeOption} value={makeOption}>
                  {makeOption}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-section">
            <label>Model:</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
              <option value="">Select Model</option>
              {make && modelsByMake[make].map((modelOption) => (
                <option key={modelOption} value={modelOption}>
                  {modelOption}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-section">
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter ZIP code"
            />
          </div>

          <div className="form-section">
            <label>Radius:</label>
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

          <button type="submit" className="search-button">Search</button>
        </form>

        {/* Redirect to Advanced Search Page */}
        <button onClick={handleAdvancedSearchRedirect} className="advanced-search-button">
          Advanced Search
        </button>
      </div>
    </div>
  );
};

export default CarSearchPage;
