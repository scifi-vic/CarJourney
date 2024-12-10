import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import heroImage from "../assets/hero-image.jpg";

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>Welcome to CarJourney</h1>
          <p>Discover the car that fits your lifestyle or locate trusted dealers nearby.</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features">
          <div className="feature">
            <h3>Car Quiz</h3>
            <p>Take our quiz to find the car that matches your lifestyle and preferences.</p>
            <Link to="/car-quiz" className="cta-button">
              Take the Quiz
            </Link>
          </div>
          <div className="feature">
            <h3>Locate Dealers</h3>
            <p>Find trusted car dealerships near you with our dealer locator.</p>
            <Link to="/locate-dealer" className="cta-button">
              Locate Dealers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
