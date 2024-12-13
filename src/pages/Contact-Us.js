import React from "react";
import "../styles/Contact-Us.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-header">Contact Us</h1>
      <p className="contact-description">
        We'd love to hear from you! Reach out to us using the information below.
      </p>
      <div className="contact-info">
        <p><strong>Email:</strong> support@carjourney.com</p>
        <p><strong>Phone:</strong> +1 (800) 123-4567</p>
        <p><strong>Address:</strong> 123 Car Journey Blvd, Motor City, USA</p>
      </div>
    </div>
  );
};

export default Contact;
