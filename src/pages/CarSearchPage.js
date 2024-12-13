/* global google */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CarSearchPage.css';

const CarSearchPage = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('10');
  const [minYear, setMinYear] = useState('');
  const [yearList, setYearList] = useState([]);
  const [makeList, setMakeList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const navigate = useNavigate();
  const locationInputRef = useRef(null);

  // Generate years from 1992 to the current year
  const getYearRange = () => {
    const currentYear = new Date().getFullYear();
    const range = [];
    for (let year = currentYear; year >= 1992; year--) {
      range.push(year.toString());
    }
    return range;
  };

  useEffect(() => {
    const filteredYears = getYearRange();
    setYearList(filteredYears);
  }, []);

  // Fetch Makes for Selected Year
  useEffect(() => {
    if (minYear) {
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json`)
        .then((response) => response.json())
        .then((data) => {
          const makeValues = data.Results.map((item) => item.MakeName);
          setMakeList(makeValues.sort((a, b) => a.localeCompare(b))); // Alphabetize makes
          setModelList([]); // Clear models when make changes
        })
        .catch((error) => console.error('Error fetching makes:', error));
    }
  }, [minYear]);

  // Fetch Models for Selected Make and Year
  useEffect(() => {
    if (minYear && make) {
      setLoadingModels(true);
      fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${minYear}?format=json`
      )
        .then((response) => response.json())
        .then((data) => {
          const modelValues = data.Results.map((item) => item.Model_Name);
          setModelList(modelValues.sort((a, b) => a.localeCompare(b))); // Alphabetize models
          setLoadingModels(false);
        })
        .catch((error) => {
          console.error('Error fetching models:', error);
          setLoadingModels(false);
        });
    }
  }, [minYear, make]);

  // Initialize Google Places autocomplete for location input
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      const input = locationInputRef.current;
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ['(regions)'],
          componentRestrictions: { country: 'us' },
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            setLocation(place.formatted_address);
          }
        });
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!make || !model || !location || !minYear) {
      alert('Please fill in all required fields.');
      return;
    }

    const query = new URLSearchParams({
      make,
      model,
      location,
      distance,
      year: minYear,
    }).toString();

    navigate(`/results?${query}`);
  };

  const handleAdvancedSearchRedirect = () => {
    navigate('/advanced-search');
  };

  return (
    <div className="car-search-page">
      <div className="search-card">
        <h1>Find Your Next Car</h1>
        <form onSubmit={handleSubmit} className="car-search-form">
          <div className="form-section">
            <label>Year:</label>
            <select
              value={minYear}
              onChange={(e) => {
                setMinYear(e.target.value);
                setMake(''); // Reset make and model when year changes
                setModel('');
              }}
            >
              <option value="">Select Year</option>
              {yearList.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label>Make:</label>
            <select
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                setModel(''); // Reset model when make changes
              }}
              disabled={!minYear}
            >
              <option value="">Select Make</option>
              {makeList.map((makeOption) => (
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
              {modelList.map((modelOption) => (
                <option key={modelOption} value={modelOption}>
                  {modelOption}
                </option>
              ))}
            </select>
            {loadingModels && <p>Loading models...</p>}
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
