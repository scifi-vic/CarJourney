import React, { useState } from "react";
import "../styles/ContactSeller.css"; // Ensure this CSS is created or adjusted for this component
import { auth, db } from "../firebaseConfig"; // Adjust import paths for Firebase
import { FaHome, FaSearch, FaSignInAlt, FaUserPlus, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const ContactSeller = () => {
  const [comment, setComment] = useState("");

  const handleSend = () => {
    if (comment.trim() === "") {
      alert("Please type your questions or comments before sending.");
      return;
    }
    // Handle Firebase submission (example placeholder)
    db.collection("messages")
      .add({
        comment,
        timestamp: new Date(),
      })
      .then(() => {
        alert("Your message has been sent!");
        setComment(""); // Clear the textbox
      })
      .catch((error) => {
        console.error("Error sending message: ", error);
        alert("Failed to send your message. Please try again later.");
      });
  };

  return (
    <div className="contact-seller">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>CarJourney</h1>
          <nav>
            <ul>
              <li>
                <a href="/" className="active">
                  <FaHome /> Home
                </a>
              </li>
              <li>
                <a href="/car-listing">
                  <FaSearch /> Used & New Cars
                </a>
              </li>
              <li>
                <a href="/login">
                  <FaSignInAlt /> Login
                </a>
              </li>
              <li>
                <a href="/register">
                  <FaUserPlus /> Register
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main>
        <div className="container car-details">
          <h3>Questions & Comments</h3>
          <textarea
            className="comment-box"
            placeholder="Type your questions or comments here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button className="send-btn" onClick={handleSend}>
            Send
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>&copy; 2024 Car Listings. All rights reserved.</p>
          <div className="social-icons">
            <a href="https://facebook.com">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com">
              <FaTwitter />
            </a>
            <a href="https://instagram.com">
              <FaInstagram />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactSeller;
