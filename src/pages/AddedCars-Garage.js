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

    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
  
    useEffect(() => {
      // Fetch user's cars from Firestore (placeholder code)
      // You would replace this with the actual code to fetch cars from your Firestore collection
      const fetchedCars = [
        { id: 1, name: "2019 Toyota Camry", mileage: "15000 miles", image: "/images/camry1.jpg", description: "Luxury Sedan 4D" },
        { id: 2, name: "2018 Honda Civic", mileage: "20000 miles", image: "/images/camry2.png", description: "W12 Sedan 4D" },
        { id: 3, name: "2020 Ford Mustang", mileage: "5000 miles", image: "mustang.jpg", description: "Premium Sports Car" },
        { id: 4, name: "2017 Chevrolet Malibu", mileage: "30000 miles", image: "malibu.jpg", description: "Comfort Sedan 4D" },
        { id: 5, name: "2021 Nissan Altima", mileage: "10000 miles", image: "altima.jpg", description: "Family Sedan 4D" }
      ];
      setCars(fetchedCars);
    }, []);
  
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
            <h2>You Have {cars.length} Saved Cars</h2>
        </section>

        <div className="my-cars-container">
        <div>
            {cars.length === 0 ? (
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
                  {cars.map((car) => (
                    <li key={car.id} className="car-item" onClick={() => handleCarSelect(car)}>
                      <img src={car.image} alt={car.name} className="car-image" />
                      <div className="car-info">
                        <h3>{car.name}</h3>
                        <p>Mileage: {car.mileage}</p>
                      </div>
                    </li>
                  ))}
                </div></>
            )}
        </div>
          <div class="car-details-container">
              { /* Car Details Header */ }
              <div class="car-details-header">

                <h2 class="car-details-title">Car Details</h2>

                { /* Remove Car Option */}
                <div className="remove-car-container" >
                  <FontAwesomeIcon className="x-icon" icon={fasXMark}></FontAwesomeIcon>
                  <p className="remove-car">Remove this car</p>
                </div>

              </div>
              { /* Car Details Card */ }
              <div className="car-details-card">
                  {selectedCar ? (
                  <div className="car-details-info">
                      <h2 class="car-info-title">{selectedCar.name}</h2>

                      <div class="car-image-container">
                        <img src={selectedCar.image} alt={selectedCar.name} className="car-image-large" />
                      </div>
                      
                      <div className="car-details-text">
                        <p>Price: </p>
                        <p>Mileage: <span>{selectedCar.mileage}</span></p>
                        <p>ZIP Code: </p>
                        <p>Color: </p>
                        <p>Engine: </p>
                      </div>
                  </div>
                  ) : (
                  <p>Select a car to view details</p>
                  )}
              </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyCars;
