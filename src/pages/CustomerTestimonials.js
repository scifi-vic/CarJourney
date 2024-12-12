import React, { useState, useEffect } from "react";
import "../styles/CustomerTestimonials.css";
import { FaStar } from "react-icons/fa";
import { db } from "../firebaseConfig"; // Import Firestore
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

const testimonialsCollection = collection(db, "testimonials");

const CustomerTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    review: "",
    rating: 0,
  });

  const auth = getAuth(); // Initialize Firebase Auth
  const user = auth.currentUser; // Get the current logged-in user

  // Fetch testimonials from Firebase
  useEffect(() => {
    const fetchTestimonials = async () => {
      const snapshot = await getDocs(testimonialsCollection);
      const testimonialsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestimonials(testimonialsData);
    };
    fetchTestimonials();
  }, []);

  // Handle form submission to add a new testimonial
  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit a review.");
      return;
    }
    if (newTestimonial.name && newTestimonial.review && newTestimonial.rating) {
      await addDoc(testimonialsCollection, newTestimonial);
      setTestimonials([...testimonials, newTestimonial]);
      setShowForm(false);
      setNewTestimonial({ name: "", review: "", rating: 0 });
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="customer-testimonials">
      <h1>Customer Testimonials</h1>

      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="stars">
              {[...Array(testimonial.rating)].map((_, i) => (
                <FaStar key={i} color="#FFD700" />
              ))}
            </div>
            <p className="review-text">"{testimonial.review}"</p>
            <h3 className="reviewer-name">- {testimonial.name}</h3>
          </div>
        ))}
      </div>

      {/* Add Testimonial Button */}
      <button
        className="add-testimonial-button"
        onClick={() => {
          if (!user) {
            alert("You must be logged in to add a review.");
            return;
          }
          setShowForm(!showForm);
        }}
      >
        Add Your Review
      </button>

      {/* Add Testimonial Form */}
      {showForm && (
        <form className="testimonial-form" onSubmit={handleAddTestimonial}>
          <input
            type="text"
            placeholder="Your Name"
            value={newTestimonial.name}
            onChange={(e) =>
              setNewTestimonial({ ...newTestimonial, name: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Your Review"
            value={newTestimonial.review}
            onChange={(e) =>
              setNewTestimonial({ ...newTestimonial, review: e.target.value })
            }
            required
          />
          <select
            value={newTestimonial.rating}
            onChange={(e) =>
              setNewTestimonial({
                ...newTestimonial,
                rating: parseInt(e.target.value),
              })
            }
            required
          >
            <option value="0">Rating (1-5)</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
          <button type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
};

export default CustomerTestimonials;
