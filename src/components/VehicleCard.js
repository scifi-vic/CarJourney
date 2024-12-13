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
import { collection, query, where, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { auth, db, serverTimestamp } from "../firebaseConfig";

const VehicleCard = ({ vehicle, detailed = false }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [carColor, setCarColor] = useState(""); // State to hold car color
  const [carYear, setCarYear] = useState(""); // State to hold car year

  const carDetails = {
    make: vehicle.make,
    model: vehicle.model,
    year: carYear, // Add year here
    cost: vehicle.price,
    odometer: vehicle.mileage,
    seller: vehicle.seller,
    image: vehicle.image,
    owner: vehicle.ownerId,
    carId: vehicle.carId,
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setButtonDisabled(user.uid === carDetails.owner);
      }
    });
  }, []);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const docRef = doc(db, "users", carDetails.owner, "cars", carDetails.carId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCarColor(data.color); // Set the color dynamically from Firestore
          setCarYear(data.year); // Set the year dynamically from Firestore
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, [carDetails.owner, carDetails.carId]);

  const toggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const newId =
      favorites.length > 0 ? Math.max(...favorites.map((s) => s.id)) + 1 : 1;

    const newCar = {
      id: newId,
      ...carDetails,
    };
    const updatedFavorites = [newCar, ...favorites];

    const carIndex = favorites.findIndex((car) => car.make === carDetails.make);

    if (carIndex > -1) {
      favorites.splice(carIndex, 1);
    } else {
      favorites.push(newCar);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

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
        addDoc(chatsCollection, {
          members: { [auth.currentUser.uid]: true, [carDetails.owner]: true },
        }).then((docRef) => {
          addDoc(collection(db, "messages", docRef.id, "messages"), {
            text: `Hello, I'm interested in your ${carDetails.year} ${carDetails.make} ${carDetails.model}!`,
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

  useEffect(() => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isFavorited = favorites.some((car) => car.make === carDetails.make);
    setIsLiked(isFavorited);
  }, [carDetails.make]);

  return (
    <div className={`vehicle-card ${detailed ? "detailed-vehicle-card" : ""}`}>
      <h2 className="vehicle-title">
        {carYear} {vehicle.make} {vehicle.model}
      </h2>
      <p className="vehicle-price">Cost: ${vehicle.price}</p>
      <p className="vehicle-seller">Sold by: {vehicle.seller}</p>

      <div className="contact-container">
        <div className="heart-save-container" onClick={toggleFavorite}>
          <FontAwesomeIcon
            icon={isLiked ? fasHeart : farHeart}
            className="heart-icon"
          />
          <span>{isLiked ? "Saved" : "Save"}</span>
        </div>
        <button
          className="contact-button"
          style={{
            backgroundColor: buttonDisabled ? "gray" : "#007bff",
            color: buttonDisabled ? "lightgray" : "white",
            cursor: buttonDisabled ? "not-allowed" : "pointer",
          }}
          onClick={() => ContactSeller()}
          disabled={buttonDisabled}
        >
          Contact Seller
        </button>
      </div>

      <div className="image-box">
        <img
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="vehicle-image"
        />
      </div>

      {detailed && (
        <>
          <div className="vehicle-highlights">
            <h2>Vehicle Highlights</h2>
            <div className="highlights-grid">
              <div>
                <FaPaintBrush /> Exterior Color: {carColor || "Unknown"}
              </div>
              <div>
                <FaRoad /> Odometer: {vehicle.mileage} miles
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VehicleCard;
