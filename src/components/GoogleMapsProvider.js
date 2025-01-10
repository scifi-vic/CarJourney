// src/components/GoogleMapsProvider.js
import React from 'react';
import { LoadScript } from '@react-google-maps/api';

const GoogleMapsProvider = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={['places']}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;
