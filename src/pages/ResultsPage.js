import React, { useState, useEffect, useMemo } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
import { doc, setDoc, collection, getDocs } from "firebase/firestore"; // Import Firestore methods
import { auth, db } from "../firebaseConfig"; // Import your Firebase configuration
import '../styles/ResultsPage.css';

/* FontAwesome Icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'; // Regular heart
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';   // Solid heart

const ResultsPage = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Define state for Autocomplete
  const [autocomplete, setAutocomplete] = useState(null);

  // Handle Saves
  const [isSaved, setIsSaved] = useState(false);

  // Query Search
  const urlLocation = useLocation();
  const queryParams = new URLSearchParams(urlLocation.search);
  
  // Define filter states
  const [make, setMake] = useState(queryParams.get('make') || '');
  const [model, setModel] = useState(queryParams.get('model') || '');
  const [zip, setZip] = useState(queryParams.get('zipCode') || '');
  const [minYear, setMinYear] = useState(queryParams.get('minYear') || '');
  const [maxYear, setMaxYear] = useState(queryParams.get('maxYear') || '');
  const [minPrice, setMinPrice] = useState(queryParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(queryParams.get('maxPrice') || '');
  const [maxMileage, setMaxMileage] = useState(queryParams.get('mileage') || '');
  const [transmission, setTransmission] = useState(queryParams.get('transmission') || '');
  const [fuelType, setFuelType] = useState(queryParams.get('fuelType') || '');
  const [driveType, setDriveType] = useState(queryParams.get('driveType') || '');
  const [bodyStyle, setBodyStyle] = useState(queryParams.get('bodyStyle') || '');
  const [engineType, setEngineType] = useState(queryParams.get('engineType') || '');
  const [color, setColor] = useState(queryParams.get('color') || '');
  const [radius, setRadius] = useState(queryParams.get('distance') || 10); // Default distance in miles
  const [filteredCars, setFilteredCars] = useState([]);

  const [fetchedCars, setFetchedCars] = useState([]);

  // Fetch cars from Firestore
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        let allCars = [];
        for (const userDoc of usersSnapshot.docs) {
          const carsSnapshot = await getDocs(
            collection(db, "users", userDoc.id, "cars")
          );
          carsSnapshot.forEach((carDoc) => {
            allCars.push({ id: carDoc.id, ...carDoc.data() });
          });
        }
        setFetchedCars(allCars);
      } catch (error) {
        console.error("Error fetching cars from Firestore:", error);
      }
    };
  
    fetchCars();
  }, []); // Run once on component mount
  
  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 3958.8; // Radius of Earth in miles
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const postalCode = place?.address_components?.find((comp) =>
        comp.types.includes('postal_code')
      )?.short_name;

      if (postalCode && /^[0-9]{5}$/.test(postalCode)) {
        setZip(postalCode);
        console.log('Selected ZIP Code:', postalCode);
      } else {
        setZip(''); // Clear ZIP code if invalid
        console.log('Invalid ZIP code or incomplete location.');
      }
    }
  };

  // Filtering logic
  useEffect(() => {
    const filterCarsByDistance = async () => {
      let userCoordinates = null;

      if (zip && /^[0-9]{5}$/.test(zip)) {
        const geocoder = new window.google.maps.Geocoder();
        try {
          const result = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: zip }, (results, status) => {
              if (status === 'OK') {
                resolve(results[0].geometry.location);
              } else if (status === 'ZERO_RESULTS') {
                console.log(`No location found for ZIP code: ${zip}`);
                resolve(null); // Gracefully handle no results
              } else {
                reject(`Geocode failed due to: ${status}`);
              }
            });
          });

          if (result) {
            userCoordinates = { lat: result.lat(), lng: result.lng() };
          }
        } catch (error) {
          console.error(error);
          return;
        }
      }

      const newFilteredCars = fetchedCars.filter((car) => {
        const matchesMake = !make || car.make === make;
        const matchesModel = !model || car.model === model;
        const matchesMinYear = !minYear || car.year >= parseInt(minYear, 10);
        const matchesMaxYear = !maxYear || car.year <= parseInt(maxYear, 10);
        const matchesMinPrice = !minPrice || car.price >= parseInt(minPrice, 10);
        const matchesMaxPrice = !maxPrice || car.price <= parseInt(maxPrice, 10);
        const matchesMaxMileage = !maxMileage || car.mileage <= parseInt(maxMileage, 10);
        const matchesTransmission = !transmission || car.transmission === transmission;
        const matchesFuelType = !fuelType || car.fuelType === fuelType;
        const matchesDriveType = !driveType || car.driveType === driveType;
        const matchesBodyStyle = !bodyStyle || car.bodyStyle === bodyStyle;
        const matchesEngineType = !engineType || car.engineType === engineType;
        const matchesColor = !color || car.color === color;

        let withinDistance = true;
        if (userCoordinates) {
          const distance = calculateDistance(
            userCoordinates.lat,
            userCoordinates.lng,
            car.lat,
            car.lng
          );
          withinDistance = distance <= radius;
        }

        return (
          matchesMake &&
          matchesModel &&
          matchesMinYear &&
          matchesMaxYear &&
          matchesMinPrice &&
          matchesMaxPrice &&
          matchesMaxMileage &&
          matchesTransmission &&
          matchesFuelType &&
          matchesDriveType &&
          matchesBodyStyle &&
          matchesEngineType &&
          matchesColor &&
          withinDistance
        );
      });

      setFilteredCars(newFilteredCars);
    };

    filterCarsByDistance();
  }, [make, model, zip, minYear, maxYear, minPrice, maxPrice, maxMileage, transmission, fuelType, driveType, bodyStyle, engineType, color, radius, fetchedCars]);

  if (!isLoaded) {
    return <p>Loading Google Maps...</p>;
  }

  const generateDropdownOptions = (start, end, step = 1) => {
    const options = [];
    for (let i = start; i <= end; i += step) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  {/* Miguel's Code
    Handle Save Search */}
  // Handle Save Search
  const handleSaveSearch = async () => {
    // Variables
    const searchId = `${Date.now()}`;

    // Check if user is logged in
    const user = auth.currentUser;

    // Set Saved to True
    setIsSaved(true);

    // Define Filters
    const filters = {
      userId: user.uid,
      createdAt: new Date(Date.now()), // MM/DD/YYYY
      make: make, model: model,
      zipCode: zip, distance: radius,
      minYear: minYear, maxYear: maxYear,
      minPrice: minPrice, maxPrice: maxPrice,
      mileage: maxMileage,
      transmission: transmission,
      fuelType: fuelType,
      driveType: driveType,
      bodyStyle: bodyStyle,
      engineType: engineType,
      color: color,
    };

    if (user) {
      // Logged-in user: Save to Firebase
      try {
        const userSearchesRef = collection(db, "users", user.uid, "savedSearches");
        await setDoc(doc(userSearchesRef, searchId), filters);
        console.log("Search saved to Firebase for user:", user.uid);
      } catch (error) {
        console.error("Error saving search to Firebase:", error);
      }
    // If user is not logged in
    } else {
      // Guest user: Save to localStorage
      // Take existing searches
      const existingSearches = JSON.parse(localStorage.getItem("savedSearches")) || [];

      // Give unique IDs to each save added
      const newId = existingSearches.length > 0 
        ? Math.max(...existingSearches.map((s) => s.id)) + 1 
        : 1;
      
      // Renew array
      const newSearch = {
        id: newId,
        ...filters,
      };

      // Update searches in localStorage
      const updatedSearches = [newSearch, ...existingSearches];
      localStorage.setItem("savedSearches", JSON.stringify(updatedSearches));
    }

    // Change "Save Search" button after 1 second
    setTimeout(() => {
      setIsSaved(false);
    }, 1000); // Revert text after 1 second
  };

  // HTML
  return (
    <div className="results-page">
      <h2 className="results-title">Search Results</h2>
      <div className="results-container">

        {/* Filter Panel */}
        <div className="filter-panel">

          {/* Save Search Button */}
          <div className="save-container">
            <button className="save-search-button" 
              onClick={handleSaveSearch}
              disabled={isSaved} // Prevent multiple clicks while in 'Saved' state
            >
              <FontAwesomeIcon
                icon={isSaved ? fasHeart : farHeart}
                className="heart-icon"
              />
              <span className="save-text">{isSaved ? 'Saved!' : 'Save Search'}</span>             
            </button>
          </div>
          { /* End of Miguel's Code */}

          <div className="form-section">
            <label>Make:</label>
            <select
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                setModel(''); // Reset model when make changes
              }}
            >
              <option value="">Any</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              {/* Add more makes */}
            </select>
          </div>

          <div className="form-section">
            <label>Model:</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!make} // Disable model selection if no make is selected
            >
              <option value="">Any</option>
              {make === 'Toyota' && (
                <>
                  <option value="Camry">Camry</option>
                  <option value="Corolla">Corolla</option>
                  {/* Add more Toyota models */}
                </>
              )}
              {make === 'Honda' && (
                <>
                  <option value="Civic">Civic</option>
                  {/* Add more Honda models */}
                </>
              )}
              {/* Add more makes and their models */}
            </select>
          </div>

          <div className="form-section">
            <label>ZIP Code:</label>
            <Autocomplete
              onLoad={(instance) => setAutocomplete(instance)}
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                type="text"
                placeholder="Enter ZIP code or location"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </Autocomplete>
          </div>

          <div className="form-section">
            <label>Distance (miles):</label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            >
              {[10, 25, 50, 100, 250, 500, 1000].map((distance) => (
                <option key={distance} value={distance}>
                  {distance} miles
                </option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label>Year Range:</label>
            <select
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
            >
              <option value="">Min Year</option>
              {generateDropdownOptions(1990, 2025)}
            </select>
            <select
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
            >
              <option value="">Max Year</option>
              {generateDropdownOptions(1990, 2025)}
            </select>
          </div>

          <div className="form-section">
            <label>Price Range:</label>
            <select
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            >
              <option value="">Min Price</option>
              {generateDropdownOptions(10000, 1000000, 10000)}
            </select>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            >
              <option value="">Max Price</option>
              {generateDropdownOptions(10000, 1000000, 10000)}
            </select>
          </div>

          <div className="form-section">
            <label>Mileage (Max):</label>
            <select
              value={maxMileage}
              onChange={(e) => setMaxMileage(e.target.value)}
            >
              <option value="">Any Mileage</option>
              {generateDropdownOptions(10000, 200000, 10000)}
            </select>
          </div>

          <div className="form-section">
            <label>Transmission:</label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
            >
              <option value="">Any</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="form-section">
            <label>Fuel Type:</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
            >
              <option value="">Any</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div className="form-section">
            <label>Drive Type:</label>
            <select
              value={driveType}
              onChange={(e) => setDriveType(e.target.value)}
            >
              <option value="">Any</option>
              <option value="FWD">FWD</option>
              <option value="RWD">RWD</option>
              <option value="AWD">AWD</option>
            </select>
          </div>

          <div className="form-section">
            <label>Body Style:</label>
            <select
              value={bodyStyle}
              onChange={(e) => setBodyStyle(e.target.value)}
            >
              <option value="">Any</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          <div className="form-section">
            <label>Engine Type:</label>
            <select
              value={engineType}
              onChange={(e) => setEngineType(e.target.value)}
            >
              <option value="">Any</option>
              <option value="V4">V4</option>
              <option value="V6">V6</option>
              <option value="V8">V8</option>
            </select>
          </div>

          <div className="form-section">
            <label>Color:</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="">Any</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Gray">Gray</option>
            </select>
          </div>
        </div>

        <div className="vehicle-list">
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div key={car.id} className="vehicle-card">
                <img src={car.image} alt={`${car.make} ${car.model}`} />
                <h3>
                  {car.year} {car.make} {car.model}
                </h3>
                <p>Price: ${car.price}</p>
                <p>Mileage: {car.mileage} miles</p>
                <p>Location: {car.location}</p>
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