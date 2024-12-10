/* global google */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CarSearchPage.css';

const CarSearchPage = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('10');
  const navigate = useNavigate();
  const locationInputRef = useRef(null);

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
    Kia: ['Sorento', 'Sportage', 'Optima'],
  };

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById('googleMaps');
      if (!existingScript) {
        console.log('Loading Google Maps API script...');
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAY4vk_b9RuHBKY89uUt_vMD7OTwAgY5TU&libraries=places`;
        script.id = 'googleMaps';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('Google Maps API script loaded successfully.');
          initializeAutocomplete();
        };
        script.onerror = () => {
          console.error('Error loading Google Maps API script.');
        };
        document.body.appendChild(script);
      } else {
        console.log('Google Maps API script already loaded.');
        initializeAutocomplete();
      }
    };

    const initializeAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        const input = locationInputRef.current;
        if (input) {
          console.log('Initializing Google Places Autocomplete...');
          const autocomplete = new window.google.maps.places.Autocomplete(input, {
            types: ['(regions)'],
            componentRestrictions: { country: 'us' },
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              setLocation(place.formatted_address);
              console.log('Selected location:', place.formatted_address);
            } else {
              console.error('No geometry found for the selected place.');
            }
          });
        } else {
          console.error('Input element for location not found.');
        }
      } else {
        console.error('Google Maps API is not available.');
      }
    };

    loadGoogleMapsScript();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!location) {
      alert('Please select a valid location from the suggestions.');
      return;
    }

    const query = new URLSearchParams({
      make,
      model,
      location,
      distance,
    }).toString();

    console.log('Navigating to results with query:', query);
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
            <select
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                setModel('');
              }}
            >
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
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!make}
            >
              <option value="">Select Model</option>
              {make &&
                modelsByMake[make].map((modelOption) => (
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
              ref={locationInputRef}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter ZIP code or city"
            />
          </div>

          <div className="form-section">
            <label>Distance:</label>
            <select
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            >
              <option value="10">10 miles</option>
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
              <option value="100">100 miles</option>
              <option value="150">150 miles</option>
              <option value="200">200 miles</option>
              <option value="500">500 miles</option>
            </select>
          </div>

          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <button
          onClick={handleAdvancedSearchRedirect}
          className="advanced-search-button"
        >
          Advanced Search
        </button>
      </div>
    </div>
  );
};

export default CarSearchPage;
