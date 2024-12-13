// src/pages/Favorite-Car.js
import React, { useEffect, useState } from "react";
import "./../styles/Favorite-Car.css";
/* FontAwesome Icons */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons"; // Solid heart
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { collection, query, where, getDocs, addDoc, doc } from "firebase/firestore";
import { auth, db, serverTimestamp } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const FavoriteList = () => {
  // Initialize variables
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();
  // Load favorites from localStorage when the component mounts
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Remove the selected car from favorites
  const removeFromFavorites = (id) => {
    const updatedFavorites = favorites.filter((car) => car.id !== id);
    // updatedFavorites.splice(id, 1);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const getChatId = (car) => {

    const chatCollection = collection(db, "chats");
    const q = query(chatCollection, where(`members.${auth.currentUser.uid}`, "==", true),
                                    where(`members.${car.owner}`, "==", true))

    getDocs(q).then((querySnapshot) => {
          if (querySnapshot.empty) {
            // No chat found, create a new one
            addDoc(chatCollection, {
              members: {[auth.currentUser.uid]: true, [car.owner]: true},
            }).then((docRef) => {
              addDoc(collection(db, "messages", docRef.id, "messages"), {
                text: `Hello, I'm interested in your ${car.make} ${car.model}!`,
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

  // HTML
  return (
    <div className="favorite-list">
      {/* Navigation Headbar */}
      <div className="headerNav-container">
        <nav>
          <ul className="header-nav-list">
            <li>
              <a href="my-cars">My Cars</a>
            </li>
            <li>
              <a href="add-car">Add Cars</a>
            </li>
            <li>
              <a href="favorited-cars" className="active">
                Favorited Cars
              </a>
            </li>
            <li>
              <a href="saved-searches">Saved Searches</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main>
        {favorites.length === 0 ? (
          <div className="no-cars-container">
            <p className="no-cars-text">No Favorited Cars Found</p>
            <p className="no-cars-instructions">
              Save the cars you like by organizing them here in just one click!
            </p>
            <p className="no-cars-instructions">Here's how:</p>
            <p className="no-cars-steps">
              <strong>Step 1:</strong> Go to any listed car and visit its page.
            </p>
            <p className="no-cars-steps">
              <strong>Step 2:</strong> Click on the "Save" button next to the
              "Contact Seller".
            </p>
            <p className="no-cars-steps">
              <strong>Step 3:</strong> Your favorited car should save here.
            </p>
          </div>
        ) : (
          <div className="container car-details">
            <h2>Favorited Cars</h2>
            <div id="favorite-cars-container" className="car-list">
              {favorites.map((car) => (
                <div key={car.id} className="car-item">
                  <div className="car-image">
                    <a href={`car-listing?make=${car.make}&model=${car.model}`}>
                      <img src={car.image} alt={car.make} />
                    </a>
                    <FontAwesomeIcon
                      icon={fasHeart}
                      className="heart-icon"
                      onClick={() => removeFromFavorites(car.id)}
                    />
                  </div>
                  <div className="car-details">
                    <div className="title-cost">
                      <h3>
                        {car.make} {car.model}
                      </h3>
                      <p className="car-cost">
                        ${Number(car.cost).toLocaleString()}
                      </p>
                    </div>
                    <p className="odometer">
                      {Number(car.odometer).toLocaleString()} miles
                    </p>
                    <p className="seller">{car.seller}</p>
                    <p className="contact-seller">
                      <a href="contact-seller" className="contact-seller-link">
                        Contact Seller{" "}
                        <i>
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </i>
                      </a>

                      <button
                        className="contact-seller"
                        onClick={() => getChatId(car)}
                      >
                        Contact Seller
                      </button>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoriteList;
