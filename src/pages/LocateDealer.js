import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import "./../styles/LocateDealer.css";

const LocateDealer = () => {
  const [zipCode, setZipCode] = useState('');
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    if (!googleMapsLoaded) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAY4vk_b9RuHBKY89uUt_vMD7OTwAgY5TU&libraries=places`;
      script.async = true;
      script.onload = () => setGoogleMapsLoaded(true);
      document.body.appendChild(script);
    }
  }, [googleMapsLoaded]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!zipCode || !googleMapsLoaded || !window.google) return;

    setLoading(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocodeZipCode(geocoder, zipCode);
      if (response) {
        findDealers(response.location);
      }
    } catch (error) {
      console.error('Error finding dealers:', error);
    }
    setLoading(false);
  };

  const geocodeZipCode = (geocoder, zipCode) => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: zipCode }, (results, status) => {
        if (status === 'OK') {
          resolve(results[0].geometry);
        } else {
          reject(`Geocoding failed: ${status}`);
        }
      });
    });
  };

  const findDealers = (location) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(
      {
        location,
        radius: 50000,
        type: 'car_dealer',
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const uniqueDealers = removeDuplicates(results);
          setDealers(uniqueDealers);
        } else {
          console.error('Error retrieving dealer data:', status);
        }
      }
    );
  };

  const removeDuplicates = (dealers) => {
    const uniqueDealers = [];
    const placeIds = new Set();
    dealers.forEach((dealer) => {
      if (!placeIds.has(dealer.place_id)) {
        placeIds.add(dealer.place_id);
        uniqueDealers.push(dealer);
      }
    });
    return uniqueDealers;
  };

  return (
    <div className="locate-dealer">
      <h2>Find a Dealer Near You</h2>
      <form onSubmit={handleSearch} className="zipcode-form">
        <label htmlFor="zipcode-input">Enter your Zipcode:</label>
        <input
          type="text"
          id="zipcode-input"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Enter Zipcode"
          required
        />
        <button type="submit" className="btn">Find Dealers</button>
      </form>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="dealer-results">
          {dealers.map((dealer) => (
            <DealerItem key={dealer.place_id} dealer={dealer} />
          ))}
        </div>
      )}
    </div>
  );
};

const DealerItem = ({ dealer }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!window.google) return; // Ensure Google Maps API is available
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({ placeId: dealer.place_id }, (result, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setDetails(result);
      }
    });
  }, [dealer.place_id]);

  return (
    <div className="dealer-item">
      <div className="dealer-photo">
        <img
          src={dealer.photos ? dealer.photos[0].getUrl({ maxWidth: 200 }) : '/public/placeholder-locate-dealer.jpg'}
          alt={dealer.name}
        />
      </div>
      <div className="dealer-info">
        <h3>{dealer.name}</h3>
        <p>{dealer.vicinity}</p>
        {details && (
          <>
            <p><strong>Phone:</strong> {details.formatted_phone_number || 'N/A'}</p>
            {details.website && (
              <button className="btn-visit">
                <a href={details.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LocateDealer;
