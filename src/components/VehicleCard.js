import React, { useEffect, useState } from "react";
import "../styles/CarListing.css";
import {
  FaCar,
  FaGasPump,
  FaCogs,
  FaRoad,
  FaPaintBrush,
  FaUser,
} from "react-icons/fa";

/* FontAwesome Icons */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons"; // Regular heart
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons"; // Solid heart
import { collection, query, where, getDocs, addDoc, doc } from "firebase/firestore";
import { auth, db, serverTimestamp } from "../firebaseConfig";

const VehicleCard = ({ vehicle, detailed = false }) => {
  {
    /* Miguel's Code
    Favorite Function */
  }
  // Define details of car
  const carDetails = {
    make: vehicle.make,
    model: vehicle.model,
    cost: vehicle.price,
    odometer: vehicle.mileage,
    seller: vehicle.seller,
    image: vehicle.image,
    owner: vehicle.owner_id,
  };

  const [isLiked, setIsLiked] = useState(false); // Toggle Favorite

  // Function to toggle the favorite state of a car
  const toggleFavorite = () => {
    // Define favorites
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Give unique IDs to each car added
    const newId =
      favorites.length > 0 ? Math.max(...favorites.map((s) => s.id)) + 1 : 1;

    // Renew array
    const newCar = {
      id: newId,
      ...carDetails,
    };
    const updatedFavorites = [newCar, ...favorites];

    // Check if the car is already in favorites
    const carIndex = favorites.findIndex((car) => car.make === carDetails.make);

    if (carIndex > -1) {
      // If car is already favorited, remove it from the list
      favorites.splice(carIndex, 1);
    } else {
      // If car is not favorited, add it to the list
      favorites.push(carDetails);
    }

    // Save the updated list to local storage
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Update the heart icon state
    setIsLiked(!isLiked);
  };

  const ContactSeller = () => {
    const chatsCollection = collection(db, "chats");
    const q = query(
      chatsCollection,
      where(`members.${auth.currentUser.uid}`, "==", true),
      where(`members.${carDetails.owner}`, "==", true)
    );
    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) {
        // No chat found, create a new one
        addDoc(chatsCollection, {
          members: {[auth.currentUser.uid]: true, [carDetails.owner]: true},
        }).then((docRef) => {
          addDoc(collection(db, "messages", docRef.id, "messages"), {
            text: `Hello, I'm interested in your ${carDetails.make} ${carDetails.model}!`,
            timestamp: serverTimestamp(),
            sender_id: auth.currentUser.uid,
          }).then(() => {
            window.location.href = `/messaging/${docRef.id}`;
          });
        });
      } else {
        const chatId = querySnapshot.docs[0].id;
        window.location.href = `/messaging/${chatId}`;
      }
    });
  };

  // Update the heart icon based on favorite status on component mount
  useEffect(() => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isFavorited = favorites.some((car) => car.make === carDetails.make);
    setIsLiked(isFavorited);
  }, [carDetails.make]);

  return (
    <div className={`vehicle-card ${detailed ? "detailed-vehicle-card" : ""}`}>
      <h2 className="vehicle-title">
        {vehicle.make} {vehicle.model}
      </h2>
      <p className="vehicle-price">Cost: ${vehicle.price}</p>
      <p className="vehicle-odometer">Odometer: {vehicle.mileage} miles</p>
      <p className="vehicle-seller">Sold by: {vehicle.seller}</p>

      {/* Favorite Button */}
      <div className="contact-container">
        <div className="heart-save-container" onClick={toggleFavorite}>
          <FontAwesomeIcon
            icon={isLiked ? fasHeart : farHeart}
            className="heart-icon"
          />
          <span>{isLiked ? "Saved" : "Save"}</span>
        </div>
        {/* Move the Contact Seller button here */}
        <button className="contact-button" onClick={() => ContactSeller()}>
          Contact Seller
        </button>
      </div>
      {/* End of Miguel's Code */}

      <div className="image-box">
        <img
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="vehicle-image"
        />
      </div>

      {detailed && (
        <>
          <div className="vehicle-overview">
            <h2>Overview</h2>
            <p>
              The {vehicle.make} {vehicle.model} is a reliable, fuel-efficient
              sedan offering comfortable seating and advanced safety features,
              making it popular among families and commuters alike.
            </p>
          </div>

          <div className="vehicle-highlights">
            <h2>Vehicle Highlights</h2>
            <div className="highlights-grid">
              <div>
                <FaCar /> Body Style: SUV
              </div>
              <div>
                <FaRoad /> MPG City/Hwy: 50
              </div>
              <div>
                <FaCogs /> Drive Type: RWD
              </div>
              <div>
                <FaGasPump /> Transmission: Automatic
              </div>
              <div>
                <FaUser /> Interior Color: Black
              </div>
              <div>
                <FaPaintBrush /> Exterior Color: White
              </div>
            </div>
          </div>

          <div className="vehicle-specs">
            <h2>Features and Specs</h2>
            <ul>
              <li>Engine: 2.5L 4-Cylinder</li>
              <li>Transmission: Automatic</li>
              <li>Fuel Economy: 28 MPG city / 39 MPG highway</li>
              <li>Seats: 5</li>
              <li>Bluetooth Connectivity</li>
              <li>Backup Camera</li>
              <li>Lane Departure Warning</li>
              <li>Adaptive Cruise Control</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default VehicleCard;
