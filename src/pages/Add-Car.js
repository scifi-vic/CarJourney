// src/pages/Add-Car.js
import React, { useState, useEffect } from "react";
import { doc, setDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadString, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { auth, db, storage } from "../firebaseConfig";
import "./../styles/Add-Car.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Add car
const AddCar = () => {
    // Initialize variables
    const [activeTab, setActiveTab] = useState("VIN");  // Start as the VIN Tab
    const navigate = useNavigate();
    
    // Messages
    const [vinError, setVinError] = useState("");
    const [makeError, setMakeError] = useState("");

    // Make/Model
    const [makeModelZipValid, setMakeModelZipValid] = useState(null);
    const [makeModelZipError, setMakeModelZipError] = useState("");

    // VIN
    const [vin, setVin] = useState("");
    const [vinZipValid, setVinZipValid] = useState(null); // null: no validation yet, true: valid, false: invalid
    const [vinZipError, setVinZipError] = useState("");
    const [loading, setLoading] = useState(false);
    const [vinDetails, setVinDetails] = useState(null);
    const [vinData, setVinData] = useState({
      image: "",
      previewImage: "",
      year: "",
      make: "",
      model: "",
      price: "",
      mileage: "",
      zipCode: "",
      color: "",
      engine: "",
    });

    // Results Section
    const [showResults, setShowResults] = useState(false);
    const [makeModelData, setMakeModelData] = useState({
      image: "",
      previewImage: "",
      year: "",
      make: "",
      model: "",
      price: "",
      mileage: "",
      zipCode: "",
      color: "",
      engine: "",
    });

    // Colors
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
    const [loadingModels, setLoadingModels] = useState(false);  // Loading state for Models

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
      if (makeModelData.year) {
        fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json`)
          .then((response) => response.json())
          .then((data) => {
            const makeValues = data.Results.map((item) => item.MakeName);
            setMakeList(makeValues);
            setModelList([]); // Clear models when year or make changes
          })
          .catch((error) => console.error("Error fetching makes:", error));
      }
    }, [makeModelData.year]);
  
    // Fetch Models for Selected Make and Year
    useEffect(() => {
      if (makeModelData.year && makeModelData.make) {
        setLoadingModels(true); // Start loading
        fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${makeModelData.make}/modelyear/${makeModelData.year}?format=json`
        )
          .then((response) => response.json())
          .then((data) => {
            const modelValues = data.Results.map((item) => item.Model_Name);
            setModelList(modelValues);
            setLoadingModels(false); // End loading
          })
          .catch((error) => console.error("Error fetching models:", error));
          setLoadingModels(false); // End loading even on error
      }
    }, [makeModelData.year, makeModelData.make]);

    /* Handle Images */
    // Handle images
    const handleImageChange = (e) => {
      const file = e.target.files[0];

      if (file) {
        const previewUrl = URL.createObjectURL(file);
        if (activeTab === "VIN") {
          setVinData((prevState) => ({
            ...prevState,
            image: file, // Save File object to makeModelData
            previewImage: previewUrl, // Image Preview
          }));

        } else if (activeTab === "Make/Model") {
          setMakeModelData((prevState) => ({
            ...prevState,
            image: file, // Save File object to makeModelData
            previewImage: previewUrl, // Image Preview
          }));
        }
      }
    };

    // Handle Image Memory Management
    useEffect(() => {   // Release Temporary URL for Memory
      return () => {
        if (vinData.previewImage) URL.revokeObjectURL(vinData.previewImage);
        if (makeModelData.previewImage) URL.revokeObjectURL(makeModelData.previewImage);
      };
    }, [vinData.previewImage, makeModelData.previewImage]);

    // Handle Image File Click
    const handleImageClick = () => {
      document.getElementById('car-image-input').click();
    };

    // Handle Go Button
    const handleGo = () => {
      setShowResults(true); // Show the results section
    };

    // Handle Make/Model Go Button
    const handleMakeGo = async () => {
      // User must be logged in
      if (!auth.currentUser) {
        setMakeError("You must be logged in to add a car.");
        return;
      }

      // Show Results Screen
      handleGo();

      // Clears error message if vvalid
      setMakeError("");
    }

    // Determine if the "Go" button should be enabled
    const enableGoButton =
      !loadingModels && // Ensure models are not loading
      makeModelData.year && // Year is required
      makeModelData.make && // Make is required
      makeModelData.mileage && // Mileage is required
      makeModelData.zipCode && // ZIP Code is required
      makeModelZipValid  && // Checks if zip Code is valid
      (modelList.length === 0 || makeModelData.model); // Either no models available, or a model is selected
      
    // Handle Back Button (Reset Data)
    const handleBack = () => {
      if (activeTab === "VIN") {
        // Reset vinData
        setVinData({
          ...vinData,
          image: "",
          mileage: "",
          zipCode: "",
          color: "",
          price: "",
        });
        // Reset vinDetails
        setVinDetails(null);

      } else if (activeTab === "Make/Model") {
        // Reset makeModelData
        setMakeModelData({
          ...makeModelData,
          image: "",
          engine: "",
          color: "",
          price: "",
        });
      }

      // Unshow Results Section
      setShowResults(false);
    };

    /* Handle Zip Codes */
    // Handle Zip Code
    const validateZipCode = async (zipCode) => {
      // Basic format validation
      const zipRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;
      if (!zipRegex.test(zipCode)) {
        return { isValid: false };
      }
    
      try {
        // Real-time verification using the Zippopotam API
        const response = await axios.get(`https://api.zippopotam.us/us/${zipCode}`);
        if (response.status === 200) {
          return { isValid: true, data: response.data };
        }
      } catch (error) {
        console.error("Error validating ZIP code:", error);
      }
    
      return { isValid: false };
    };
    
    // Handle Zip Code Changes
    const handleZipChange = async (e) => {
      const zip = e.target.value;

      if (activeTab === "VIN") {
        // VIN
        setVinData({ ...vinData, zipCode: zip });
    
        if (zip.length >= 5) {
          const validationResult = await validateZipCode(zip);
          setVinZipValid(validationResult.isValid);
          setVinZipError("ZIP Code is invalid. Please enter a valid one.");
        } else {
          setVinZipValid(null);
          setVinZipError("");
        }

      } else if (activeTab === "Make/Model") {
        // Make/Model
        setMakeModelData({ ...makeModelData, zipCode: zip });
    
        if (zip.length >= 5) {
          const validationResult = await validateZipCode(zip);
          setMakeModelZipValid(validationResult.isValid);
          setMakeModelZipError("ZIP Code is invalid. Please enter a valid one.");
        } else {
          setMakeModelZipValid(null);
          setMakeModelZipError("");
        }
      }

    };

    // Handle VIN
    const handleVinLookup = () => {
      // User must be logged in
      if (!auth.currentUser) {
        setVinError("You must be logged in to add a car.");
        return;
      }

      // VIN must be exactly 17 characters
      if (vin.length !== 17) {
        setVinError("A VIN must contain exactly 17 characters. Please re-enter your VIN.");
        return;
      } 
      
      setVinError(""); // Clears error message if VIN is valid
      setLoading(true); // API Call in Progress

      // API URL
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;

      // Fetch
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const results = data.Results;
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
              setVinDetails({ make, model, year, category, series, doors, engine, displacement, transmission, transmissionSpeed, driveType});
            } else {
              setVinError("Failed to fetch car details. Please check the VIN.");
            }

            // Trigger handleGo after successful lookup
            handleGo();
        })
        // Catch Errors
        .catch((error) => {
            console.error("Error fetching VIN details:", error);
            setVinError("An error occurred. Please try again.");
        })
        // Final Phase
        .finally(() => setLoading(false));
    };

  {/* Handle Added Cars */}
  /**
   * Uploads an image to Firebase Storage and returns its URL.
   * @param {File} file - The image file to upload.
   * @param {string} folder - The folder path in Firebase Storage (e.g., "cars").
   * @returns {Promise<string>} - A promise that resolves to the image's URL.
   */
  const uploadImage = async (file, folder = "images") => {
    try {
      if (!file) throw new Error("No file provided!");
  
      // Step 1: Create a reference to the storage path
      const fileName = `${auth.currentUser.uid}-${Date.now()}-${file.name}`;  
      const storageRef = ref(storage, `${folder}/${fileName}`);
  
      // Step 2: Upload the file (ensure it's a File or Blob object)
      const snapshot = await uploadBytes(storageRef, file); // This line
  
      // Step 3: Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      return downloadURL;
    } catch (error) {
      console.error("Error in uploadImage:", error);
      throw error;
    }
  };

  // Handle Add Cars
  const handleAddCars = async () => {
    try {
      // Variables
      const carData = {}
      const carId = `${Date.now()}`;

      // Determine Car Data
      if (activeTab === "VIN") {  // VIN uses values from vinData and vinDetails respectfully
        carData.image = vinData.image; // If you save the image in vinData
        carData.year = vinDetails.year;
        carData.make = vinDetails.make;
        carData.model = vinDetails.model;
        carData.price = vinData.price;
        carData.mileage = vinData.mileage;
        carData.zipCode = vinData.zipCode;
        carData.color = vinData.color?.name; // Assuming vinData.color contains {name, hex}
        carData.engine = "V" + vinDetails.engine;
  
      } else if (activeTab === "Make/Model") {
        carData.image = makeModelData.image; // If you save the image in makeModelData
        carData.year = makeModelData.year;
        carData.make = makeModelData.make;
        carData.model = makeModelData.model;
        carData.price = makeModelData.price;    
        carData.mileage = makeModelData.mileage;
        carData.zipCode = makeModelData.zipCode;
        carData.color = makeModelData.color?.name; // Assuming makeModelData.color contains {name, hex}
        carData.engine = makeModelData.engine;
      }

      // Upload image to Firebase Storage
      const imageUrl = await uploadImage(carData.image, "cars");

      // Prepare data for Firestore
      const carInfo = {
        ...carData,
        image: imageUrl,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      };

      console.log("Car Info to Save:", carInfo);
      console.log("Saving car to path:", `users/${auth.currentUser.uid}/cars/${carId}`);

      // Save car data to Firestore
      const userCarsRef = collection(db, "users", auth.currentUser.uid, "cars");
      await setDoc(doc(userCarsRef, carId), carInfo);

      console.log("Car successfully added!");

      // Navigate to "My Cars"
      navigate("/my-cars");
    } catch (error) {
      console.error("Error adding car:", error);
    }
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
            className={`vin-input ${vinError ? "error" : ""}`}
          />
          <button type="button" className="vin-go-btn" onClick={handleVinLookup} disabled={loading}>
            {loading ? "Loading..." : "Go"}
          </button>
        </div>
        { /* Error Message */ }
        {vinError && <p className="error-message">{vinError}</p>}
      </div>
    ),

    "Make/Model": (
      <div id="makeModel-inputs" className="car-details-inputs">
        <p className="make-description">Make your own car.</p>

        <div className="make-input-container">
          {/* Year Dropdown */}
          <select
            value={makeModelData.year}
            onChange={(e) => setMakeModelData({ ...makeModelData, year: e.target.value, make: "", model: "" })}
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
            value={makeModelData.make}
            onChange={ (e) => { // Make value and reset Model whenever Make changes
              setMakeModelData({ ...makeModelData, make: e.target.value, model: "" }); 
            }}
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
            value={makeModelData.model}
            onChange={(e) => setMakeModelData({ ...makeModelData, model: e.target.value })}
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
            value={makeModelData.mileage}
            className="make-input"
            onChange={(e) => setMakeModelData({ ...makeModelData, mileage: e.target.value })}
          />
          <input
            type="number"
            name="zipCode"
            id="zipCode"
            placeholder="ZIP Code"
            value={makeModelData.zipCode}
            className="make-input"
            onChange={handleZipChange}
          />

          { /* Button */ }
          <button 
            type="button" 
            className="make-go-btn"
            onClick={handleMakeGo}
            disabled={!enableGoButton}
            >
            Go
          </button>

        </div>
        { /* Error Message */ }
        {makeModelZipValid === false && <p className="error-message">{makeModelZipError}</p>}
        {makeError && <p className="error-message">{makeError}</p>}

      </div>
    ),
  }

  // Results Section
  const resultsSection = {
    "VIN": () => (
      // VIN Results Screen
      <div className="vin-results">
        <p className="vin-details-text">Car Details</p>
        <p className="vin-vin-text">VIN: <strong>{vin}</strong></p>
        <p className="vin-car-text">{vinDetails.year} {vinDetails.make} {vinDetails.model}</p>

        { /* Extra Details */}
        <p className="vin-extra-description"> Here's what we got from your VIN number.</p>
        <div className="vin-extra-details">
          <p>Category: <strong>{vinDetails.category}</strong></p>

          {vinDetails.series && vinDetails.category && vinDetails.doors &&
          <p>Style: <strong>{vinDetails.series} {vinDetails.category} {vinDetails.doors}D</strong>
          </p>}

          <p>Engine: <strong>V{vinDetails.engine}, {vinDetails.displacement} Liter</strong></p>
          <p>Transmission: <strong>{vinDetails.transmission}
              {vinDetails.transmissionSpeed && `, ${vinDetails.transmissionSpeed}-Spd`}
            </strong>
          </p>
          {vinDetails.driveType && <p>Drive Type: <strong>{vinDetails.driveType}</strong></p>}
        </div>

        { /* Image */ }
        <p className="vin-image-text">What does Your Vehicle Look Like?</p>

        <div className="vin-image-container">

          <div className="vin-image-upload" onClick={handleImageClick}>
            {vinData.previewImage ? (
              <img src={vinData.previewImage} alt="Car Preview" />
            ) : (
              <span>Click to add image</span>
            )}
          <input 
            id="car-image-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }}/>
          </div>
    
        </div>

        { /* Color Selector */ }
        <p className="vin-color">What Color is Your Vehicle?</p>

        <div className="color-grid">
          {colors.map((selectedColor) => (
            <div
              key={selectedColor.name}
              className={`color-box ${vinData.color?.name === selectedColor.name ? "selected" : ""}`}
              onClick={() => setVinData({ ...vinData, color: selectedColor })}
            >
              <div className="color-swatch" style={{ backgroundColor: selectedColor.hex }}></div>
              <p className="color-name">{selectedColor.name}</p>
            </div>
          ))}
        </div>

        { /* Price */ }
        <p className="vin-price">What's Your Desired Price?</p>

        <p className="vin-price-description">
          The price for your vehicle is listed in <span>dollars</span> (<span>$</span>).
        </p>

        <div className="price-container">
          <p className="price-symbol">$</p>
          <input
            type="number"
            placeholder="Price"
            value={vinData.price}
            onChange={(e) => setVinData({ ...vinData, price: e.target.value })}
            className="price-input"
          />
        </div>

        { /* Mileage and ZIP Code */ }
        <p className="vin-extra-text">What's Your Mileage and ZIP Code?</p>
          
          <div className="vin-additional-input">
            { /* Mileage */ }
            <input
              type="number"
              className="vin-input-btn"
              placeholder="Mileage"
              value={vinData.mileage}
              onChange={(e) => setVinData({ ...vinData, mileage: e.target.value })}
            />
            { /* ZIP Code */ }
            <input
                type="number"
                className="vin-input-btn"
                placeholder="ZIP Code"
                value={vinData.zipCode}
                onChange={handleZipChange}
            />
          </div>
          {vinZipValid === false && <p className="error-message">{vinZipError}</p>}

        { /* Button */ }
        <div className="vin-buttons">
          <button className="back-button" onClick={handleBack}>
            Back
          </button>
          <button 
            className="add-button"
            disabled={!vin || !vinData.mileage || !vinData.zipCode || !vinData.price || !vinData.color || !vinZipValid}
            onClick={handleAddCars}>
            Add
          </button>
        </div>

      </div>
    ),

    "Make/Model": () => (
      // Make/Model Results Section
      <div className="make-results">
        <p className="make-details-text">Car Details</p>
        <p className="make-car-text">{makeModelData.year} {makeModelData.make} {makeModelData.model}</p>

        { /* Description */ }
        <p className="make-extra-description"> Here's what you inputted.</p>
        <div className="make-extra-details">
          <p>Mileage: <strong>{Number(makeModelData.mileage).toLocaleString()}</strong> miles</p>
          <p>ZIP Code: <strong>{makeModelData.zipCode}</strong></p>
        </div>

        { /* Image */ }
        <p className="make-image-text">What does Your Vehicle Look Like?</p>

        <div className="make-image-container">

          <div className="make-image-upload" onClick={handleImageClick}>
            {makeModelData.previewImage ? (
              <img src={makeModelData.previewImage} alt="Car Preview" />
            ) : (
              <span>Click to add image</span>
            )}
          <input id="car-image-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }}/>
          </div>
    
        </div>

        { /* Engine */ }
        <p className="make-engine">What's Your Vehicle's Engine?</p>
        <p className="make-engine-description">
          Engines are described with "<span>V#</span> notation", where # represents the number of cylinders
        </p>

        <div className="engine-grid">
        {engines.map((engine) => (
          <label
            key={engine}
            className={`engine-box ${makeModelData.engine === engine ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="engine"
              value={engine}
              checked={makeModelData.engine === engine}
              onChange={(e) => setMakeModelData({ ...makeModelData, engine: e.target.value })}
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
              className={`color-box ${makeModelData.color?.name === selectedColor.name ? "selected" : ""}`}
              onClick={() => setMakeModelData({ ...makeModelData, color: selectedColor })}
            >
              <div className="color-swatch" style={{ backgroundColor: selectedColor.hex }}></div>
              <p className="color-name">{selectedColor.name}</p>
            </div>
          ))}
        </div>
        
        { /* Price */ }
        <p className="make-price">What's Your Desired Price?</p>

        <p className="make-price-description">
          The price for your vehicle is listed in <span>dollars</span> (<span>$</span>).
        </p>

        <div className="price-container">
          <p className="price-symbol">$</p>
          <input
            type="number"
            placeholder="Price"
            value={makeModelData.price}
            onChange={(e) => setMakeModelData({ ...makeModelData, price: e.target.value })}
            className="price-input"
          />
        </div>

        { /* Button */ }
        <div className="make-buttons">
          <button className="back-button" onClick={handleBack}>
            Back
          </button>
          <button 
            className="add-button"
            disabled={!makeModelData.image || !makeModelData.engine || !makeModelData.color || !makeModelData.price }
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
            resultsSection[activeTab]()
          
            )}
            
          </div>
        </main>
  
      </div>
    );
  };
  
  export default AddCar;