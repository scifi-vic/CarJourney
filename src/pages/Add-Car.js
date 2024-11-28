// src/pages/Add-Car.js
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./../styles/Add-Car.css";

// Add car
const AddCar = () => {
    // Initialize variables
    const [activeTab, setActiveTab] = useState("VIN");  // Start as the VIN Tab
    const [carImage, setCarImage] = useState("");
    const [year, setYear] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [price, setPrice] = useState("");
    const [mileage, setMileage] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [color, setColor] = useState("");
    const [engine, setEngine] = useState("");

    // Messages
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // VIN
    const [vin, setVin] = useState("");
    const [loading, setLoading] = useState(false);
    const [carDetails, setCarDetails] = useState(null);

    // Handle images
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setCarImage(reader.result); // Save Base64 string to state
      };

      if (file) {
          reader.readAsDataURL(file); // Convert image to Base64
      }
    };

    const handleImageClick = () => {
      document.getElementById('car-image-input').click();
    };


    // Handle VIN
    const handleVinLookup = () => {
      // VIN must be exactly 17 characters
      if (vin.length !== 17) {
        setError("A VIN must contain exactly 17 characters. Please re-enter your VIN.");
        return;
      } 
      
      setError(""); // Clears error message if VIN is valid
      setLoading(true); // API Call in Progress

      // API URL
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;

      // Fetch
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const results = data.Results;
            console.log(data.Results)
            const make = results.find((r) => r.Variable === "Make")?.Value || "Unknown";
            const model = results.find((r) => r.Variable === "Model")?.Value || "Unknown";
            const year = results.find((r) => r.Variable === "Model Year")?.Value || "Unknown";
            const category = results.find((r) => r.Variable === "Body Class")?.Value || "Unknown";
            const series = results.find((r) => r.Variable === "Series")?.Value || "Unknown";
            const doors = results.find((r) => r.Variable === "Doors")?.Value || "Unknown";
            const engine = results.find((r) => r.Variable === "Engine Number of Cylinders")?.Value || "Unknown";
            const displacement = results.find((r) => r.Variable === "Displacement (L)")?.Value || "Unknown";
            const transmission = results.find((r) => r.Variable === "Transmission Style")?.Value || "Unknown";
            const transmissionSpeed = results.find((r) => r.Variable === "Transmission Speeds")?.Value || "Unknown";
            const driveType = results.find((r) => r.Variable === "Drive Type")?.Value || "";

            if (make && model && year) {
              setCarDetails({ make, model, year, category, series, doors, engine, displacement, transmission, transmissionSpeed, driveType});
            } else {
              setError("Failed to fetch car details. Please check the VIN.");
            }

        })
        // Catch Errors
        .catch((error) => {
            console.error("Error fetching VIN details:", error);
            setError("An error occurred. Please try again.");
        })
        // Final Phase
        .finally(() => setLoading(false));
    };

  {/* Handle Save Search */}
  // Save Filters to Storage
  const carInfo = {
    image: carImage || "/images/no-image.png", // No Image Placeholder
    year: year,
    make: make,
    model: model,
    price: price,
    mileage: mileage,
    zipCode: zipCode,
    color: color,
    engine: engine,
  };

  // Handle Save Search
  const handleAddCars = () => {
    // Take existing cars
    const existingCars = JSON.parse(localStorage.getItem("addedCars")) || [];

    // Give unique IDs to each car added
    const newId = existingCars.length > 0 
      ? Math.max(...existingCars.map((s) => s.id)) + 1 
      : 1;
    
    // Renew array
    const newCar = {
      id: newId,
      ...carInfo,
    };

    const updatedCars = [newCar, ...existingCars];

    localStorage.setItem("addedCars", JSON.stringify(updatedCars));
    alert("Car added successfully!");
  };

  // Tab configuration object
  const tabs = {
    "VIN": (
      <div id="vin-inputs" className="car-details-inputs">
        <p className="vin-description">
          Your <u>VIN</u> will allow for more accurate
          details.
        </p>
        <div className="vin-input-group">
          <input
            type="text"
            name="vinNumber"
            id="vinNumber"
            placeholder="Enter your 17-digit VIN"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            className={`vin-input ${error ? "error" : ""}`}
          />
          <button type="button" className="vin-go-btn" onClick={handleVinLookup} disabled={loading}>
            {loading ? "Loading..." : "Go"}
          </button>
        </div>
        { /* Error Message */ }
        {error && <p className="error-message">{error}</p>}
      </div>
    ),

    "Make/Model": (
      <div id="makeModel-inputs" className="car-details-inputs">
        <p className="make-description">Make your own car.</p>
        <div className="car-image">
          <div className="image-upload" onClick={handleImageClick}>
            {carImage ? (
              <img src={carImage} alt="Car Preview" />
            ) : (
              <span>Click to add image</span>
            )}
          </div>
          { /* Do not display the "Choose File" button */ }
          <input id="car-image-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }}/>
        </div>
        <div className="additional-input-group">
          <input
            type="text"
            name="year"
            id="year"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            type="text"
            name="make"
            id="make"
            placeholder="Make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />
          <input
            type="text"
            name="model"
            id="model"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <input
            type="number"
            name="price"
            id="price"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        { /* 2nd Row */ }
        <div className="additional-input-group">
          <input
            type="number"
            name="mileage"
            id="mileage"
            placeholder="Mileage"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
          />
          <input
            type="number"
            name="zipCode"
            id="zipCode"
            placeholder="ZIP Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <input
            type="text"
            name="color"
            id="color"
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <input
            type="text"
            name="engine"
            id="engine"
            placeholder="Engine"
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
          />
        </div>
        <button type="button" className="make-go-btn" onClick={handleAddCars}>
            Add Car
          </button>
      </div>
    ),
  }

  // HTML
    return (
      <div>
        {/* Navigation Header */}
        <div className="headerNav-container">
          <nav>
            <ul className="header-nav-list">
              <li><a href="my-cars">My Cars</a></li>
              <li><a href="add-car" className="active">Add Cars</a></li>
              <li><a href="favorited-cars">Favorited Cars</a></li>
              <li><a href="saved-searches">Saved Searches</a></li>
            </ul>
          </nav>
        </div>

        {/* Main Body */}
        <main>
          { /* Add a Car Text */ }
          <div className="container car-details">

            <h2 className="car-name">
              <strong>Add a Car</strong>
            </h2>
            <p className="instruction-text">
              Add a car to the listing by filling in the information below.
            </p>

            {!carDetails ? (
            <>
             { /* Tab Navigation */ }
            <div className="container add-car-section">
              <h2>Option Select</h2>
              <div className="input-toggle">

                {Object.keys(tabs).map((tabName) => (
                  <div key={tabName}>
                    <input
                      type="radio"
                      id={tabName}
                      name="option"
                      value={tabName}
                      checked={activeTab === tabName}
                      onChange={() => setActiveTab(tabName)}
                    />
                  <label htmlFor={tabName}>{tabName}</label>
                </div>

              ))}
              </div>

              {/* Tab content */}
              {tabs[activeTab]}

            </div>
            </>
            ) : (

            // VIN Results Screen
            <div className="vin-results">
              <p className="vin-details-text">Car Details</p>
              <p className="vin-vin-text">VIN: <strong>{vin}</strong></p>
              <p className="vin-car-text">{carDetails.year} {carDetails.make} {carDetails.model}</p>
              
              <div className="vin-extra-details">
                <p>Category: <strong>{carDetails.category}</strong></p>

                {carDetails.series && carDetails.category && carDetails.doors &&
                <p>Style: <strong>{carDetails.series} {carDetails.category} {carDetails.doors}-D</strong>
                </p>}

                <p>Engine: <strong>V{carDetails.engine}, {carDetails.displacement} Liter</strong></p>
                <p>Transmission: <strong>{carDetails.transmission}
                    {carDetails.transmissionSpeed && `, ${carDetails.transmissionSpeed}-Spd`}
                  </strong>
                </p>
                {carDetails.driveType && <p>Drive Type: <strong>{carDetails.driveType}</strong></p>}
              </div>

              <p className="vin-additional-details">Additional Details</p>
              
              { /* Input */ }
              <div className="vin-extra-inputs">

                { /* Image */ }
                <div className="vin-image-upload" onClick={handleImageClick}>
                  {carImage ? (
                    <img src={carImage} alt="Car Preview" />
                  ) : (
                    <span>Click to add image</span>
                  )}
                <input id="car-image-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }}/>
                </div>
                
                { /* Additional Details */ }
                <div className="vin-additional-input">
                  <input
                    type="number"
                    className="vin-input-btn"
                    placeholder="Mileage"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                  />
                  <input
                    type="number"
                    className="vin-input-btn"
                    placeholder="ZIP Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>

                <div className="vin-additional-input">
                  <input
                      type="number"
                      className="vin-input-btn"
                      placeholder="Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                  />
                  <input
                    type="text"
                    className="vin-input-btn"
                    placeholder="Color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>

              </div>

              { /* Button */ }
              <div className="vin-buttons">
                <button className="back-button" onClick={() => setCarDetails(null)}>
                  Back
                </button>
                <button className="add-button">
                  Add
                </button>
              </div>

            </div>
          )}

            
          </div>
        </main>
  
      </div>
    );
  };
  
  export default AddCar;