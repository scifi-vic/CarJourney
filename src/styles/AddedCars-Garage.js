// src/pages/AddedCars-Garage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./../styles/AddedCars-Garage.css";

/* FontAwesome Icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus as fasPlus, faXmark as fasXMark} from '@fortawesome/free-solid-svg-icons';

// My Cars
const MyCars = () => {
    // Initiate variables
    const [selectedCar, setSelectedCar] = useState(null);  // Set ID as 0
  
    // Load saved cars from localStorage (Initiate array)
    const [savedCars, setSavedCars] = useState([]);

    // Automatically selects the first car on Garage load
    useEffect(() => {
      if (savedCars.length > 0) {
          setSelectedCar(savedCars[0]); // Select the first car in the list
      }
    }, [savedCars]); // Runs whenever the `cars` array changes

    // Load saved searches from localStorage on component mount
    useEffect(() => {
      const storedCars = JSON.parse(localStorage.getItem("addedCars")) || [];
      setSavedCars(storedCars);
    }, []);

    // Remove a search by the ID
    const handleRemoveCar = (id) => {
      const updatedCars = savedCars.filter((car) => car.id !== id);
      setSavedCars(updatedCars);
      localStorage.setItem("addedCars", JSON.stringify(updatedCars));
    };

    // Select Car
    const handleCarSelect = (car) => {
      setSelectedCar(car);
    };

    /* Navigation */
    const navigate = useNavigate();

    // Reusable function for redirection
    const handleRedirect = (url) => {
      navigate(url); // Redirect to the provided URL
    };

  // HTML
  return (
    <div>

      {/* Navigation Headbar */}
      <div className="headerNav-container">
        <nav>
          <ul className="header-nav-list">
            <li><a href="my-cars" className="active">My Cars</a></li>
            <li><a href="add-car">Add Cars</a></li>
            <li><a href="favorited-cars">Favorited Cars</a></li>
            <li><a href="saved-searches">Saved Searches</a></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main>
        {savedCars.length === 0 ? (
          <div className="no-cars-container">
            <p className="no-cars-text">Welcome to "My Cars"</p>
            <p className="no-cars-instructions">This page is your personal garage, where you can add or remove cars you listed.</p>
            <p className="no-cars-instructions">Other pages allow you to favorite cars and organize your searches.</p>
            <div className="redirect-button-container">
              <button className="add-car-button" onClick={() => handleRedirect("/add-car")}>
                Add Cars
              </button>
              <button className="favorite-car-button" onClick={() => handleRedirect("/favorited-cars")}>
                Favorite Cars
              </button>
              <button className="saved-searches-button" onClick={() => handleRedirect("/saved-searches")}>
                Saved Searches
              </button>
            </div>
          </div>  
        ) : (
          <>
            <section className="car-amount">
              <h2>
                You Have {savedCars.length} Saved Car{savedCars.length !== 1 ? "s" : ""}
              </h2>
            </section>
            <div className="my-cars-container">
              <div>
                <div className="my-cars-header">
                  <h2 className="my-cars-title">My Cars</h2>

                  {/* Remove Car Option */}
                  <div className="add-car-container">
                    <FontAwesomeIcon className="plus-icon" icon={fasPlus}></FontAwesomeIcon>
                    <a href="add-car" className="add-car-link">
                      Add another car
                    </a>
                  </div>
                </div>
                <div className="car-list-view">
                  {savedCars.map((car) => (
                    <li
                      key={car.id}
                      className="car-item"
                      onClick={() => handleCarSelect(car)}
                    >
                      <img src={car.image} alt={car.name} className="car-image" />
                      <div className="car-info">
                        <h3>
                          {car.year} {car.make} {car.model}
                        </h3>
                        <p>Mileage: {Number(car.mileage).toLocaleString()} miles</p>
                      </div>
                    </li>
                  ))}
                </div>
              </div>
              {savedCars.length > 0 && (
                <div className="car-details-container">
                  {/* Car Details Header */}
                  <div className="car-details-header">
                    <h2 className="car-details-title">Car Details</h2>

                    {/* Remove Car Option */}
                    <div className="remove-car-container">
                      <FontAwesomeIcon className="x-icon" icon={fasXMark}></FontAwesomeIcon>
                      <p
                        className="remove-car"
                        onClick={() => handleRemoveCar(selectedCar.id)}
                      >
                        Remove this car
                      </p>
                    </div>
                  </div>

                  {/* Car Details Card */}
                  <div className="car-details-card">
                    {selectedCar ? (
                      <div className="car-details-info">
                        <h2 className="car-info-title">
                          {selectedCar.year} {selectedCar.make} {selectedCar.model}
                        </h2>
                        <div className="car-image-container">
                          <img
                            src={selectedCar.image}
                            alt={selectedCar.name}
                            className="car-image-large"
                          />
                        </div>

                        {/* Horizontal Line */}
                        <hr className="horizontal-line" />

                        {/* Car Details */}
                        <div className="car-details-text">
                          <p>
                            Price: <span>${Number(selectedCar.price).toLocaleString()}</span>
                          </p>
                          <p>
                            Mileage: <span>{Number(selectedCar.mileage).toLocaleString()} miles</span>
                          </p>
                          <p>
                            ZIP Code: <span>{selectedCar.zipCode}</span>
                          </p>
                          <p>
                            Color: <span>{selectedCar.color}</span>
                          </p>
                          <p>
                            Engine: <span>{selectedCar.engine}</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p>Select a car to view details</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

    </div>
  );
};

export default MyCars;
