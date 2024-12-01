// src/pages/Add-Car.js
import React, { useState, useEffect } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./../styles/Add-Car.css";

// Add car
const AddCar = () => {
    // Initialize variables
    const [activeTab, setActiveTab] = useState("VIN");  // Start as the VIN Tab
    const [carImage, setCarImage] = useState("");
    const [year, setYear] = useState("");
    const [make, setMake] = useState("");
    const [category, setCategory] = useState("");
    const [series, setSeries] = useState("");
    const [model, setModel] = useState("");
    const [price, setPrice] = useState("");
    const [mileage, setMileage] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [color, setColor] = useState("");
    const [engine, setEngine] = useState("");
    const [doors, setDoors] = useState("");
    const [displacement, setDisplacement] = useState("");
    const [driveType, setDriveType] = useState("");

    // Messages
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // VIN
    const [vin, setVin] = useState("");
    const [loading, setLoading] = useState(false);

    // Results Section
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);

    // Color
    const colors = [
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Black", hex: "#000000" },
      { name: "Blue", hex: "#0000FF" },
      { name: "Brown", hex: "#A52A2A" },
      { name: "Burgundy", hex: "#800020" },
      { name: "Gold", hex: "#FFD700" },
      { name: "Gray", hex: "#808080" },
      { name: "Green", hex: "#008000" },
      { name: "Orange", hex: "#FFA500" },
      { name: "Pink", hex: "#FFC0CB" },
      { name: "Purple", hex: "#800080" },
      { name: "Red", hex: "#FF0000" },
      { name: "Silver", hex: "#C0C0C0" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Yellow", hex: "#FFFF00" },
    ];

    // Engine
    const engines = [
      "V-twin (V2)",
      "V3",
      "V4",
      "V5",
      "V6",
      "V8",
      "V10",
      "V12",
      "V14",
      "V16",
      "V18",
      "V20",
      "V24",
      "V32",
    ];

    { /* Fetch Car Models */ }
    const [yearList, setYearList] = useState([]); // Available years
    const [makeList, setMakeList] = useState([]); // Available makes for the selected year
    const [modelList , setModelList] = useState([]); // Available models for the selected make and year
  
    // Generate a range of years between 1992 and the current year
    const getYearRange = () => {
      const currentYear = new Date().getFullYear();
      const range = [];
      for (let year = currentYear; year >= 1992; year--) {
        range.push(year.toString());
      }
      return range;
    };
  
    useEffect(() => {
      // Use a programmatically generated range for years
      const filteredYears = getYearRange();
      setYearList(filteredYears);
    }, []);
  
    // Fetch Makes for Selected Year
    useEffect(() => {
      if (year) {
        fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json`)
          .then((response) => response.json())
          .then((data) => {
            const makeValues = data.Results.map((item) => item.MakeName);
            setMakeList(makeValues);
            setModelList([]); // Clear models when year or make changes
          })
          .catch((error) => console.error("Error fetching makes:", error));
      }
    }, [year]);
  
    // Fetch Models for Selected Make and Year
    useEffect(() => {
      if (year && make) {
        fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`
        )
          .then((response) => response.json())
          .then((data) => {
            const modelValues = data.Results.map((item) => item.Model_Name);
            setModelList(modelValues);
          })
          .catch((error) => console.error("Error fetching models:", error));
      }
    }, [year, make]);

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
    const handleGo = () => {
      if (activeTab === "VIN" && vin) {
        setResults({
          vin,
          message: "VIN Results: Successfully fetched!",
        });
      } else if (activeTab === "Make/Model" && make && model && year) {
        setResults({
          year,
          make,
          model,
          mileage,
          zipCode,
          price,
          color,
           engine,
          message: "Make/Model Results: Successfully added!",
        });
      }
      setShowResults(true); // Show the results section
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
            console.log(results);
            setMake(results.find((r) => r.Variable === "Make")?.Value || "Unknown");
            setModel(results.find((r) => r.Variable === "Model")?.Value || "Unknown");
            setYear(results.find((r) => r.Variable === "Model Year")?.Value || "Unknown");
            setCategory(results.find((r) => r.Variable === "Body Class")?.Value || "Unknown");
            setSeries(results.find((r) => r.Variable === "Series")?.Value || "Unknown");
            setDoors(results.find((r) => r.Variable === "Doors")?.Value || "Unknown");
            setEngine(results.find((r) => r.Variable === "Engine Number of Cylinders")?.Value || "Unknown");
            setDisplacement(results.find((r) => r.Variable === "Displacement (L)")?.Value || "Unknown");
            setDriveType(results.find((r) => r.Variable === "Drive Type")?.Value || "Unknown");

            // Trigger handleGo after successful lookup
            handleGo();
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
  // Handle Save Search
  const handleAddCars = async () => {
    // Save Filters to Storage
    const carInfo = {
      image: carImage || "/images/no-image.png", // No Image Placeholder
      year: year,
      make: make,
      category: category,
      series: series,
      model: model,
      doors: doors,
      driveType: driveType,
      price: price,
      mileage: mileage,
      zipCode: zipCode,
      color: color,
      engine:  engine,
      owner_id: auth.currentUser.uid,
      forSale: false
    };

    // Take existing cars
    // const existingCars = JSON.parse(localStorage.getItem("addedCars")) || [];

    // // Give unique IDs to each car added
    // const newId = existingCars.length > 0 
    //   ? Math.max(...existingCars.map((s) => s.id)) + 1 
    //   : 1;
    
    // // Renew array
    // const newCar = {
    //   id: newId,
    //   ...carInfo,
    // };

    // const updatedCars = [newCar, ...existingCars];

    // localStorage.setItem("addedCars", JSON.stringify(updatedCars));
      
    await addDoc(collection(db, "cars"), carInfo);
  
    // Optionally reset the input fields
    setMileage("");
    setZipCode("");
    setPrice("");
    setColor("");
    setCarImage(null);

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

        <div className="make-input-container">
          {/* Year Dropdown */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={!yearList.length}
            className="make-input"
          >
            <option value="" disabled>
              Year
            </option>
            {yearList.map((selectedYear) => (
              <option key={selectedYear} value={selectedYear}>
                {selectedYear}
              </option>
            ))}
          </select>

          {/* Make Dropdown */}
          <select
            value={make}
            onChange={(e) => { setMake(e.target.value); setModel("")}}
            disabled={!makeList.length}
            className="make-input"
          >
            <option value="" disabled>
              Make
            </option>
            {makeList.map((selectedMake) => (
              <option key={selectedMake} value={selectedMake}>
                {selectedMake}
              </option>
            ))}
          </select>

          {/* Model Dropdown */}
          <select 
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!modelList.length} 
            className="make-model-input">
            <option value="" disabled>
              Model
            </option>
            {modelList.map((selectedModel) => (
              <option key={selectedModel} value={selectedModel}>
                {selectedModel}
              </option>
            ))}
          </select>

        </div>
        { /* 2nd Row */ }
        <div className="make-input-container">
          <input
            type="number"
            name="mileage"
            id="mileage"
            placeholder="Mileage"
            value={mileage}
            className="make-input"
            onChange={(e) => setMileage(e.target.value)}
          />
          <input
            type="number"
            name="zipCode"
            id="zipCode"
            placeholder="ZIP Code"
            value={zipCode}
            className="make-input"
            onChange={(e) => setZipCode(e.target.value)}
          />

          { /* Button */ }
          <button 
            type="button" 
            className="make-go-btn" 
            onClick={handleGo}
            disabled={!year || !make || !mileage ||!zipCode }
            >
            Go
          </button>

        </div>

      </div>
    ),
  }

  // Results Section
  const resultsSection = {
    "VIN": (results) => (
      // VIN Results Screen
      <div className="vin-results">
        <p className="vin-details-text">Car Details</p>
        <p className="vin-vin-text">VIN: <strong>{vin}</strong></p>
        <p className="vin-car-text">{year} {make} {model}</p>
        <div className="vin-extra-details">
          <p>Category: <strong>{category}</strong></p>

          { series &&  category &&  doors &&
          <p>Style: <strong>{series} {category} {doors}D</strong>
          </p>}

          <p>Engine: <strong>V{ engine}, { displacement} Liter</strong></p>
          { driveType && <p>Drive Type: <strong>{ driveType}</strong></p>}
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
          <button className="back-button" onClick={() => {setShowResults(false); }}>
            Back
          </button>
          <button 
            className="add-button"
            disabled={!vin || !mileage || !zipCode || !price || !color}
            onClick={handleAddCars}>
            Add
          </button>
        </div>

      </div>
    ),

    "Make/Model": (results) => (
      // Make/Model Results Section
      <div className="make-results">
        <p className="make-details-text">Car Details</p>
        <p className="make-car-text">{results.year} {results.make} {results.model}</p>

        { /* Description */ }
        <p className="make-extra-description"> Here's what you inputted.</p>
        <div className="make-extra-details">
          <p>Mileage: <strong>{Number(results.mileage).toLocaleString()}</strong> miles</p>
          <p>ZIP Code: <strong>{results.zipCode}</strong></p>
        </div>

        { /* Image */ }
        <p className="make-image-text">What does Your Vehicle Look Like?</p>

        <div className="make-image-container">

          <div className="make-image-upload" onClick={handleImageClick}>
            {carImage ? (
              <img src={carImage} alt="Car Preview" />
            ) : (
              <span>Click to add image</span>
            )}
          <input id="car-image-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }}/>
          </div>
    
        </div>

        { /* Engine */ }
        <p className="make-engine">What is Your Vehicle's Engine?</p>
        <p className="make-engine-description">
          Engines are described with "<span>V#</span> notation", where # represents the number of cylinders
        </p>

        <div className="engine-grid">
        {engines.map((engine) => (
          <label
            key={engine}
            className={`engine-box ${ engine === engine ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="engine"
              value={engine}
              checked={ engine === engine}
              onChange={() => setEngine(engine)}
            />
            {engine}
          </label>
        ))}
      </div>

        { /* Color Selector */ }
        <p className="make-color">What Color is Your Vehicle?</p>

        <div className="color-grid">
          {colors.map((selectedColor) => (
            <div
              key={selectedColor.name}
              className={`color-box ${color === selectedColor.name ? "selected" : ""}`}
              onClick={() => setColor(selectedColor.name)}
            >
              <div className="color-swatch" style={{ backgroundColor: selectedColor.hex }}></div>
              <p className="color-name">{selectedColor.name}</p>
            </div>
          ))}
        </div>
        
        { /* Price */ }
        <p className="make-price">What is Your Desired Price?</p>

        <p className="make-engine-description">
          The price for your vehicle is listed in <span>dollars</span> (<span>$</span>).
        </p>

        <div className="price-container">
          <p className="price-symbol">$</p>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="price-input"
          />
        </div>

        { /* Button */ }
        <div className="make-buttons">
          <button className="back-button" onClick={() => {setShowResults(false); }}>
            Back
          </button>
          <button 
            className="add-button"
            disabled={!carImage || ! engine || !color || !price }
            onClick={handleAddCars}>
            Add
          </button>
        </div>

      </div>
    ),
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
          { /* Add a Car Text */ }
          <div className="container car-details">

            <h2 className="car-name">
              <strong>Add a Car</strong>
            </h2>
            <p className="instruction-text">
              Add a car to the listing by filling in the information below.
            </p>

            {!showResults ? (
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

            // Dynamically render the results section based on the active tab
            resultsSection[activeTab](results)
          
            )}
            
          </div>
        </main>
  
      </div>
    );
  };
  
  export default AddCar;