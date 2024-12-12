import React from "react";
import "../styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-header">Contact Us</h1>
      <p className="contact-description">
        We're here to help! Fill out the form below, or reach out using the contact methods provided.
      </p>
      <form className="contact-form">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Your name..." />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Your email..." />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" placeholder="Write your message here..." />

        <button type="submit" className="contact-submit">Send Message</button>
      </form>
      <div className="contact-info">
        <p>Email: support@carjourney.com</p>
        <p>Phone: +1 (800) 123-4567</p>
        <p>Address: 123 Car Journey Blvd, Motor City, USA</p>
      </div>
    </div>
  );
};

export default Contact;
