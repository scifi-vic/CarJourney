import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import "../styles/Contact-Us.css";

const Contact = () => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 33.7838, // Latitude of the address
    lng: -118.1141, // Longitude of the address
  };

  return (
    <div className="contact-container">
      <h1 className="contact-header">Contact Us</h1>
      <p className="contact-description">
        We'd love to hear from you! Reach out to us using the information below.
      </p>
      <div className="contact-info">
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@carjourney.com" className="contact-link">
            support@carjourney.com
          </a>
        </p>
        <p>
          <strong>Phone:</strong>{" "}
          <a href="tel:+15629854111" className="contact-link">
            (562) 985-4111
          </a>
        </p>
        <p>
          <strong>Address:</strong>{" "}
          <a
            href="https://www.google.com/maps/search/?api=1&query=1250+Bellflower+Blvd,+Long+Beach,+CA+90840"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            1250 Bellflower Blvd, Long Beach, CA 90840
          </a>
        </p>
      </div>

      {/* Google Maps Section */}
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          options={{
            disableDefaultUI: true,
          }}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default Contact;
