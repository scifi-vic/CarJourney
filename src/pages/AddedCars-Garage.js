// src/pages/AddedCars-Garage.js
import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./../styles/AddedCars-Garage.css";

/* FontAwesome Icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus as fasPlus, faXmark as fasXMark} from '@fortawesome/free-solid-svg-icons';

// My Cars
const MyCars = () => {

    // Initiate variables
    const [selectedCar, setSelectedCar] = useState(null);
  
    // Load saved cars from localStorage (Initiate array)
    const [savedCars, setSavedCars] = useState([]);

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

    const handleCarSelect = (car) => {
      setSelectedCar(car);
    };

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

        <section className="car-amount">
            <h2>You Have {savedCars.length} Saved Car{savedCars.length !== 1 ? "s" : ""}</h2>
        </section>

        <div className="my-cars-container">
        <div>
            {savedCars.length === 0 ? (
              <p>No cars found.</p>
            ) : (
              <>
              <div class="my-cars-header">
                <h2 class="my-cars-title">My Cars</h2>

                { /* Remove Car Option */}
                <div className="add-car-container" >
                  <FontAwesomeIcon className="plus-icon" icon={fasPlus}></FontAwesomeIcon>
                  <a href="add-car" class="add-car-link">Add another car</a>
                </div>

              </div>
              <div className="car-list-view">
                  {savedCars.map((car) => (
                    <li key={car.id} className="car-item" onClick={() => handleCarSelect(car)}>
                      <img src={car.image} alt={car.name} className="car-image" />
                      <div className="car-info">
                        <h3>{car.year} {car.make} {car.model}</h3>
                        <p>Mileage: {car.mileage} miles</p>
                      </div>
                    </li>
                  ))}
                </div></>
            )}
        </div>
          {savedCars.length === 0 ? (
            <p></p>
            ) : (
            <div class="car-details-container">
                { /* Car Details Header */ }
                <div class="car-details-header">
                  <h2 class="car-details-title">Car Details</h2>

                  { /* Remove Car Option */}
                  <div className="remove-car-container" >
                    <FontAwesomeIcon className="x-icon" icon={fasXMark}></FontAwesomeIcon>
                    <p className="remove-car" onClick={() => handleRemoveCar(selectedCar.id)}>Remove this car</p>
                  </div>
                </div>

                { /* Car Details Card */ }
                <div className="car-details-card">
                  {selectedCar ? (
                    <div className="car-details-info">
                        <h2 class="car-info-title">{selectedCar.year} {selectedCar.make} {selectedCar.model}</h2>

                        <div class="car-image-container">
                          <img src={selectedCar.image} alt={selectedCar.name} className="car-image-large" />
                        </div>
                        
                        <div className="car-details-text">
                          <p>Price: <span>${selectedCar.price}</span></p>
                          <p>Mileage: <span>{selectedCar.mileage} miles</span></p>
                          <p>ZIP Code: <span>{selectedCar.zipCode}</span></p>
                          <p>Color: <span>{selectedCar.color}</span></p>
                          <p>Engine: <span>{selectedCar.engine}</span></p>
                        </div>
                    </div>
                    ) : (
                    <p>Select a car to view details</p>
                  )}
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyCars;
