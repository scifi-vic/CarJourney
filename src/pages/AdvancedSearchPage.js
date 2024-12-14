import React, { useState, useEffect, useRef } from 'react';
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
  const [color, setColor] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [distance, setDistance] = useState('');
  const [yearList, setYearList] = useState([]);
  const [makeList, setMakeList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  const autocompleteRef = useRef(null);
  const navigate = useNavigate();

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
    setYearList(getYearRange());
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

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const postalCode = place?.address_components?.find((comp) =>
        comp.types.includes('postal_code')
      )?.long_name;
      setZipCode(postalCode || '');
    }
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
      color,
      zipCode,
      distance,
    }).toString();

    console.log(`/results?${searchParams}`);
    navigate(`/results?${searchParams}`);
  };

  return (
    <div className="advanced-search-page">
      <h2>Advanced Search</h2>
      <form onSubmit={handleSearch} className="advanced-search-form">
        <div className="form-group">
          <label>Year:</label>
          <select
            value={minYear}
            onChange={(e) => {
              setMinYear(e.target.value);
              setMake('');
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

        <div className="form-group">
          <label>Make:</label>
          <select
            value={make}
            onChange={(e) => {
              setMake(e.target.value);
              setModel('');
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

        <div className="form-group">
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
            {[10, 25, 50, 100, 150, 200].map((dist) => (
              <option key={dist} value={dist}>
                {`${dist} miles`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Mileage (Max)</label>
          <input
            type="number"
            placeholder="Enter maximum mileage"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            style={{ width: '100%', height: '40px' }}
            min="0" // Ensure the user can only enter non-negative numbers
        />
        </div>

        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default AdvancedSearchPage;
