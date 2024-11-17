// src/pages/CarListing.js
import React, { useEffect, useState } from "react";
import "./../styles/CarListing.css";

// Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Use the correct package for Firestore
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpRdNjtxVGiC6NCjt58-gnJUdvnbODXpc",
  authDomain: "carjourney491b.firebaseapp.com",
  projectId: "carjourney491b",
  storageBucket: "carjourney491b.appspot.com",
  messagingSenderId: "248223244957",
  appId: "1:248223244957:web:4b1d289950719d829d6a74",
  measurementId: "G-WF2R4YV2CS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Properly initialize Firestore
const auth = getAuth(app);
  
  const CarListing = () => {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const carDetails = {
      name: "Toyota Camry",
      cost: "$22,000",
      odometer: "32,000 miles",
      seller: "John Adams",
      image: "images/camry1.jpg",
    };
  
    useEffect(() => {
      // Load favorites from localStorage on component mount
      const fetchFavorites = async () => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
        setIsLoading(false); // Set loading to false once data is ready
      };
  
      fetchFavorites();
    }, []);
  
    const toggleFavorite = () => {
      const updatedFavorites = [...favorites];
      const index = updatedFavorites.findIndex(
        (car) => car.name === carDetails.name
      );
  
      if (index > -1) {
        // If the car is already favorited, remove it
        updatedFavorites.splice(index, 1);
      } else {
        // Otherwise, add it to favorites
        updatedFavorites.push(carDetails);
      }
  
      // Update localStorage and state
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    };
  
    const isFavorited = favorites.some((car) => car.name === carDetails.name);
  
    if (isLoading) {
      // Show a loading indicator while data is being fetched
      return <div>Loading...</div>;
    }
  
    return (
      <div className="car-listing">
        {/* Header */}
        <header>
          <div className="container">
            <h1>CarJourney</h1>
            <nav>
              <ul>
                <li><a href="#" className="active"><i className="fas fa-home"></i> Home</a></li>
                <li><a href="#"><i className="fas fa-search"></i> Used & New Cars</a></li>
                <li><a href="favoriteList.html"><i className="fas fa-star"></i> Favorited Cars</a></li>
                <li><a href="#" id="login-btn"><i className="fas fa-sign-in-alt"></i> Login</a></li>
                <li><a href="#" id="register-btn"><i className="fas fa-user-plus"></i> Register</a></li>
              </ul>
            </nav>
          </div>
        </header>
  
        {/* Main Car Details Section */}
        <main>
          <div className="container car-details">
            <h2 className="car-name">
              <strong>{carDetails.name}</strong>
              <i
                className={`heart-icon ${isFavorited ? "fas" : "far"} fa-heart`}
                onClick={toggleFavorite}
              ></i>
            </h2>
            <p className="car-cost"><strong>Cost:</strong> {carDetails.cost}</p>
            <p className="car-odometer"><strong>Odometer:</strong> {carDetails.odometer}</p>
            <p className="car-seller"><strong>Sold by:</strong> {carDetails.seller}</p>
            <a href="contact_seller.html" className="contact-seller-btn">Contact Seller</a>
  
            {/* Image Gallery */}
            <div className="image-gallery">
              <img src={carDetails.image} alt={carDetails.name} className="car-image" />
            </div>
  
            {/* Overview */}
            <section className="car-overview">
              <h3>Overview</h3>
              <p>
                The Toyota Camry is a reliable, fuel-efficient sedan that offers comfortable
                seating and advanced safety features, making it a popular choice for commuters and families alike.
              </p>
            </section>
  
            {/* Vehicle Highlights */}
            <section className="vehicle-highlights">
              <h3>Vehicle Highlights</h3>
              <div className="highlights-container">
                <div className="highlight-item">
                  <i className="fas fa-car-side"></i>
                  <p><strong>Body Style</strong><br />Sedan</p>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-gas-pump"></i>
                  <p><strong>MPG City/Hwy</strong><br />50</p>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-cogs"></i>
                  <p><strong>Drive Type</strong><br />RWD</p>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-tachometer-alt"></i>
                  <p><strong>Transmission</strong><br />Automatic</p>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-toolbox"></i>
                  <p><strong>Engine</strong><br />6 Cyl</p>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-gas-pump"></i>
                  <p><strong>Fuel</strong><br />Gasoline</p>
                </div>
                <div className="highlight-item">
                  <i className="fa-solid fa-paint-roller"></i>
                  <p><strong>Interior Color</strong><br />Black</p>
                </div>
                <div className="highlight-item">
                  <i className="fa-solid fa-fill-drip"></i>
                  <p><strong>Exterior Color</strong><br />White</p>
                </div>
              </div>
            </section>
          </div>
        </main>
  
        {/* Footer */}
        <footer>
          <div className="container">
            <p>&copy; 2024 Car Listings. All rights reserved.</p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </footer>
      </div>
    );
  };
  
  export default CarListing;