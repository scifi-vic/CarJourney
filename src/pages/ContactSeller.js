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

    </div>
  );
};

export default ContactSeller;
