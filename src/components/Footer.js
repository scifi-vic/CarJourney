import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <div className="footer">
      <div className="socialMedia">
        {/* Add social media icons or links here if needed */}
      </div>
      <div className="footer-links">
        <Link to="/contact-us" className="footer-link">Contact Us</Link>
        <Link to="/testimonials" className="footer-link">Customer Testimonials</Link>
        <a 
          href="https://www.kbb.com/car-values/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="footer-link external-link"
        >
          Trade-In Values and Car Pricing <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="external-icon" viewBox="0 0 16 16">
            <path d="M10.293 3.5L4.5 9.293 5.207 10 11 4.207V8.5h1V2H7.5v1h4.793z"></path>
            <path fillRule="evenodd" d="M13.5 0a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-.5.5h-14a.5.5 0 0 1-.5-.5v-14A.5.5 0 0 1-.5 0h14zM1 14h12V2H1v12z"></path>
          </svg>
        </a>
      </div>
      <p>&copy; {new Date().getFullYear()} CarJourney</p>
    </div>
  );
}

export default Footer;
