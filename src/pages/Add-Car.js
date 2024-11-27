// src/pages/Add-Car.js
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./../styles/Add-Car.css";

const AddCar = () => {
    // Initialize variables
    const [searchType, setSearchType] = useState("VIN");
    const [vin, setVin] = useState("");
    const [carImage, setCarImage] = useState("");
    const [year, setYear] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [price, setPrice] = useState("");
    const [mileage, setMileage] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [color, setColor] = useState("");
    const [engine, setEngine] = useState("");
    const [message, setMessage] = useState("");

    // Handle tabs
    const handleRadioChange= (e) => setSearchType(e.target.value);

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

    // Handle Go Button
    const handleGoClick = () => {
      if (searchType === "VIN") {
        console.log("Searching by VIN:", vin);
      } else if (searchType === "Make/Model") {
        console.log("Adding Car:", { year, make, model, price, mileage, zipCode });
      }
    };

    // Handle VIN
    const handleVinLookup = () => {
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;

      fetch(url)
          .then((response) => response.json())
          .then((data) => {
              const results = data.Results;
              console.log(data.Results)
              const carMake = results.find((r) => r.Variable === "Make")?.Value;
              const carModel = results.find((r) => r.Variable === "Model")?.Value;
              const carYear = results.find((r) => r.Variable === "Model Year")?.Value;
              const engine = results.find((r) => r.Variable === "Engine Number of Cylinders")?.Value

              if (carMake && carModel && carYear) {
                  setMake(carMake);
                  setModel(carModel);
                  setYear(carYear);
                  setEngine(engine);
                  setMessage("Car details fetched successfully!");
              } else {
                  setMessage("Failed to fetch car details. Please check the VIN.");
              }

          })
          .catch((error) => {
              console.error("Error fetching VIN details:", error);
              setMessage("An error occurred. Please try again.");
          });

    };

  {/* Handle Save Search */}
  // Save Filters to Storage
  const carInfo = {
    image: carImage,
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
          <div className="container car-details">
            <h2 className="car-name">
              <strong>Add a Car</strong>
            </h2>
            <p className="instruction-text">
              Add a car to the listing by filling in the information below.
            </p>
  
            <div className="container add-car-section">
              <h2>Option Select</h2>
              <div className="input-toggle">
                <input
                  type="radio"
                  id="vin"
                  name="searchType"
                  value="VIN"
                  checked={searchType === "VIN"}
                  onChange={handleRadioChange}
                />
                <label htmlFor="vin">VIN</label>
  
                <input
                  type="radio"
                  id="makeModel"
                  name="searchType"
                  value="Make/Model"
                  checked={searchType === "Make/Model"}
                  onChange={handleRadioChange}
                />
                <label htmlFor="makeModel">Make/Model</label>
  
              </div>
  
              {searchType === "VIN" && (
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
                    />
                    <button type="button" className="vin-go-btn" onClick={handleVinLookup}>
                      Go
                    </button>
                  </div>
                </div>
              )}
  
              {searchType === "Make/Model" && (
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
                      type="text"
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
                      type="text"
                      name="mileage"
                      id="mileage"
                      placeholder="Mileage"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                    />
                    <input
                      type="text"
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
              )}
  
            </div>
          </div>
        </main>
  
      </div>
    );
  };
  
  export default AddCar;