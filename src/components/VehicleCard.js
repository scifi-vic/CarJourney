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
import { collection, query, where, getDoc, getDocs, addDoc, setDoc, deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Ensure you import this
import { auth, db, serverTimestamp } from "../firebaseConfig";

const VehicleCard = ({ vehicle, detailed = false }) => {
  const [isLiked, setIsLiked] = useState(false); // Toggle Favorite
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setButtonDisabled(user.uid === vehicle.ownerId);
      }
    });
  }, []);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const docRef = doc(db, "users", vehicle.ownerId, "cars", vehicle.carId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchCarData();
  }, [vehicle.ownerId, vehicle.carId]);

  {
    /* Miguel's Code
    Favorite Function */
  }
  // Function to toggle the favorite state of a car
  const toggleFavorite = async () => {
    // Variables
    const favoriteId = vehicle.carId; // Use `carId` as the unique identifier
    const date = new Date(Date.now());

    // Check if user is logged in
    const user = auth.currentUser;

    // Define details of car
    const carDetails = {
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      cost: vehicle.price,
      odometer: vehicle.mileage,
      seller: vehicle.seller,
      image: vehicle.image,
      owner: vehicle.ownerId,
      carId: vehicle.carId,
      date: date,
    };

    if (user) {
      // Logged-in user: Save or remove from Firebase
      const userFavRef = doc(db, "users", user.uid, "favoritedCars", favoriteId);
  
      try {
        if (isLiked) {
          // Remove from Firebase
          await deleteDoc(userFavRef);
          console.log("Car removed from Firebase for user:", user.uid);
        } else {
          // Add to Firebase
          await setDoc(userFavRef, carDetails);
          console.log("Car saved to Firebase for user:", user.uid);
        }
      } catch (error) {
        console.error("Error toggling car favorite in Firebase:", error);
      }
    } else {
      // Guest user: Save or remove from localStorage
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  
      // Renew array
      const newCar = {
        id: carDetails.carId,
        ...carDetails,
      };
      
      // Check if the car is already in favorites
      const carIndex = favorites.findIndex((car) => car.carId === carDetails.carId);
  
      if (carIndex > -1) {
        // Remove the car if it already exists
        console.log("Car removed from localStorage:", vehicle.carId);

        // Only keep the cars that do not match the new car's carId
        favorites = favorites.filter((car) => car.carId !== carDetails.carId);
      } else {
        // Add the new car if it does not already exist
        console.log("Car saved to localStorage:", vehicle.carId);

        // Replace `favorites` with just the new car object
        favorites = [...favorites, newCar];
      }
  
      // Save the updated favorites list to localStorage
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  
    // Update the heart icon state
    setIsLiked(!isLiked);
  };

  // Update the heart icon based on favorite status on component mount
  useEffect(() => {
    let unsubscribeFirestore; // To clean up Firestore listener
  
    const initializeFavoriteState = async () => {
      const user = auth.currentUser;
  
      if (user) {
        // Listen to Firebase changes for logged-in users
        const userFavRef = collection(db, "users", user.uid, "favoritedCars");
        unsubscribeFirestore = onSnapshot(userFavRef, (snapshot) => {
          const favoritedCars = snapshot.docs.map((doc) => doc.data().carId);
          const isFavorited = favoritedCars.includes(vehicle.carId);
          setIsLiked(isFavorited);
        });
      } else {
        // For guests, check localStorage
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const isFavorited = favorites.some((car) => car.carId === vehicle.carId);
        setIsLiked(isFavorited);
      }
    };
  
    // Listen for authentication changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeFirestore) unsubscribeFirestore(); // Clean up Firestore listener if it exists
  
      if (user) {
        // User logged in: reinitialize favorite state
        initializeFavoriteState();
      } else {
        // User logged out: reset favorite state for guests
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const isFavorited = favorites.some((car) => car.carId === vehicle.carId);
        setIsLiked(isFavorited);
      }
    });
  
    // Cleanup on unmount
    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      unsubscribeAuth();
    };
  }, [vehicle.carId]);
  
  const ContactSeller = () => {
    const chatsCollection = collection(db, "chats");
    const q = query(
      chatsCollection,
      where(`members.${auth.currentUser.uid}`, "==", true),
      where(`members.${vehicle.ownerId}`, "==", true)
    );
    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) {
        addDoc(chatsCollection, {
          members: { [auth.currentUser.uid]: true, [vehicle.ownerId]: true },
        }).then((docRef) => {
          addDoc(collection(db, "messages", docRef.id, "messages"), {
            text: `Hello, I'm interested in your ${vehicle.year} ${vehicle.make} ${vehicle.model}!`,
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

  return (
    <div className={`vehicle-card ${detailed ? "detailed-vehicle-card" : ""}`}>
      <h2 className="vehicle-title">
        {vehicle.year} {vehicle.make} {vehicle.model}
      </h2>
      <p className="vehicle-price">Cost: ${Number(vehicle.price).toLocaleString()}</p>
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
                <FaPaintBrush /> Exterior Color: {vehicle.color || "Unknown"}
              </div>
              <div>
                <FaRoad /> Odometer: {Number(vehicle.mileage).toLocaleString()} miles
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VehicleCard;
