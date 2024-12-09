import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/carDifferences-menu.css";

const CarDifferencesMenu = () => {
  const [car1, setCar1] = useState({ make: "", model: "", year: "" });
  const [car2, setCar2] = useState({ make: "", model: "", year: "" });
  const navigate = useNavigate(); // Initialize navigate

  const handleCar1Change = (e) => {
    setCar1({ ...car1, [e.target.name]: e.target.value });
  };

  const handleCar2Change = (e) => {
    setCar2({ ...car2, [e.target.name]: e.target.value });
  };

  const handleCompare = () => {
    // Save car details in localStorage
    localStorage.setItem("car1", JSON.stringify(car1));
    localStorage.setItem("car2", JSON.stringify(car2));
    // Redirect to CarComparison page
    navigate("/compare");
  };

  return (
    <div className="car-differences-menu">
      {/* Header */}
      <header>
        <div className="container">
          <h1>CarJourney</h1>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/cars">Used & New Cars</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main>
        <h2>Compare Cars</h2>
        <p>Select two cars to compare side-by-side.</p>
        <div className="car-selection-wrapper">
          {/* Car 1 Selection */}
          <div className="car-selection">
            <h3>Add First Car</h3>
            <form>
              <label>Make</label>
              <select name="make" value={car1.make} onChange={handleCar1Change}>
                <option value="">Select Make</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Ford">Ford</option>
                <option value="Chevrolet">Chevrolet</option>
              </select>

              <label>Model</label>
              <select name="model" value={car1.model} onChange={handleCar1Change}>
                <option value="">Select Model</option>
                <option value="Camry">Camry</option>
                <option value="Civic">Civic</option>
                <option value="Mustang">Mustang</option>
                <option value="Silverado">Silverado</option>
              </select>

              <label>Year</label>
              <select name="year" value={car1.year} onChange={handleCar1Change}>
                <option value="">Select Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </form>
          </div>

          {/* Car 2 Selection */}
          <div className="car-selection">
            <h3>Add Second Car</h3>
            <form>
              <label>Make</label>
              <select name="make" value={car2.make} onChange={handleCar2Change}>
                <option value="">Select Make</option>
                <option value="Nissan">Nissan</option>
                <option value="Jeep">Jeep</option>
                <option value="Tesla">Tesla</option>
                <option value="BMW">BMW</option>
              </select>

              <label>Model</label>
              <select name="model" value={car2.model} onChange={handleCar2Change}>
                <option value="">Select Model</option>
                <option value="Altima">Altima</option>
                <option value="Model S">Model S</option>
                <option value="Cherokee">Cherokee</option>
                <option value="X5">X5</option>
              </select>

              <label>Year</label>
              <select name="year" value={car2.year} onChange={handleCar2Change}>
                <option value="">Select Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </form>
          </div>
        </div>
        <button className="compare-button" onClick={handleCompare}>
          Compare Now
        </button>
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>&copy; 2024 CarJourney. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CarDifferencesMenu;
