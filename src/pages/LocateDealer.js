import React, { useState, useEffect } from 'react';
import "./../styles/LocateDealer.css";

const LocateDealer = () => {
  const [zipCode, setZipCode] = useState('');
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // Store user location

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
        setUserLocation(response.location);
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
    const allDealers = [];

    const handleResults = (results, status, pagination) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const uniqueDealers = removeDuplicates(results);
        allDealers.push(...uniqueDealers);

        if (pagination && pagination.hasNextPage) {
          setTimeout(() => pagination.nextPage(), 200); // Delay to avoid API throttling
        } else {
          const sortedDealers = allDealers.map((dealer) => ({
            ...dealer,
            distance: calculateDistance(location, dealer.geometry.location),
          })).sort((a, b) => a.distance - b.distance); // Sort by distance
          setDealers(sortedDealers); // Update state with sorted dealers
          setLoading(false);
        }
      } else {
        console.error('Error retrieving dealer data:', status);
        setLoading(false);
      }
    };

    setLoading(true);
    service.nearbySearch(
      {
        location,
        radius: 50000,
        type: 'car_dealer',
      },
      handleResults
    );
  };

  const calculateDistance = (location1, location2) => {
    const R = 3958.8; // Radius of the Earth in miles
    const lat1 = location1.lat();
    const lon1 = location1.lng();
    const lat2 = location2.lat();
    const lon2 = location2.lng();

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
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
        <p><strong>Distance:</strong> {dealer.distance.toFixed(2)} miles</p>
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
