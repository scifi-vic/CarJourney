import React, { useEffect, useState } from "react";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./../styles/AddedCars-Garage.css";

/* FontAwesome Icons */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus as fasPlus, faXmark as fasXMark } from "@fortawesome/free-solid-svg-icons";

const Garage = () => {
  // State variables
  const [selectedCar, setSelectedCar] = useState(null); // Stores the currently selected car
  const [savedCars, setSavedCars] = useState([]); // Stores the list of saved cars

  // Automatically selects the first car in the list when the garage loads
  useEffect(() => {
    if (savedCars.length > 0) {
      setSelectedCar(savedCars[0]); // Select the first car in the list
    }
  }, [savedCars]);

  // Fetch saved cars from Firestore on component mount
  useEffect(() => {
    const fetchSavedCars = async () => {
      try {
        auth.onAuthStateChanged(async (user) => {
          if (!user) return; // If user is not authenticated, do nothing
          const carsCollection = collection(db, "users", auth.currentUser.uid, "cars");
          const snapshot = await getDocs(carsCollection);

          // Map Firestore documents to an array of car objects
          const storedCars = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSavedCars(storedCars);
        });
      } catch (error) {
        console.error("Error fetching saved cars:", error);
      }
    };

    fetchSavedCars();
  }, []);

  // Function to handle removing a car from Firestore and updating the state
  const handleRemoveCar = async (id) => {
    try {
      const carDocRef = doc(db, "users", auth.currentUser.uid, "cars", id);
      await deleteDoc(carDocRef); // Delete the car document from Firestore
      setSavedCars(savedCars.filter((car) => car.id !== id)); // Update local state
      console.log(`Car with ID ${id} has been removed.`);
    } catch (error) {
      console.error("Error removing car:", error);
    }
  };

  // Function to handle selecting a car
  const handleCarSelect = (car) => {
    setSelectedCar(car); // Update the selected car state
  };

  // Render the component
  return (
    <div>
      {/* Navigation Headbar */}
      <div className="headerNav-container">
        <nav>
          <ul className="header-nav-list">
            <li>
              <a href="my-cars" className="active">
                My Cars
              </a>
            </li>
            <li>
              <a href="add-car">Add Cars</a>
            </li>
            <li>
              <a href="favorited-cars">Favorited Cars</a>
            </li>
            <li>
              <a href="saved-searches">Saved Searches</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main>
        <section className="car-amount">
          <h2>
            You Have {savedCars.length} Saved Car
            {savedCars.length !== 1 ? "s" : ""}
          </h2>
        </section>

        <div className="my-cars-container">
          <div>
            {savedCars.length === 0 ? (
              <p>No cars found.</p>
            ) : (
              <>
                <div className="my-cars-header">
                  <h2 className="my-cars-title">My Cars</h2>

                  {/* Add Car Option */}
                  <div className="add-car-container">
                    <FontAwesomeIcon className="plus-icon" icon={fasPlus} />
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
              </>
            )}
          </div>
          {savedCars.length === 0 ? (
            <p></p>
          ) : (
            <div className="car-details-container">
              {/* Car Details Header */}
              <div className="car-details-header">
                <h2 className="car-details-title">Car Details</h2>

                {/* Remove Car Option */}
                <div className="remove-car-container">
                  <FontAwesomeIcon className="x-icon" icon={fasXMark} />
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

                    <div className="car-details-text">
                      <p>
                        Price:{" "}
                        <span>${Number(selectedCar.price).toLocaleString()}</span>
                      </p>
                      <p>
                        Mileage:{" "}
                        <span>{Number(selectedCar.mileage).toLocaleString()} miles</span>
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
      </main>
    </div>
  );
};

export default Garage;
