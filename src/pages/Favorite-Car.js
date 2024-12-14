// src/pages/Favorite-Car.js
import React, { useEffect, useState } from "react";
import "./../styles/Favorite-Car.css";
/* FontAwesome Icons */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons"; // Solid heart
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { auth, db, serverTimestamp } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const FavoriteList = () => {
  // Initialize variables
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  // Navigation
  const navigate = useNavigate();

  // Fetch searches when the component mounts or user state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch searches from Firestore
        await fetchFavoritesFromFirestore(currentUser.uid);
      } else {
        // Fetch searches from localStorage
        fetchFavoritesFromLocalStorage();
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch favorited cars from Firestore
  const fetchFavoritesFromFirestore = async (userId) => {
    try {
      const userFavRef = collection(db, "users", userId, "favoritedCars");
      const querySnapshot = await getDocs(userFavRef);
      const storedFavorites = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate() || new Date(), // Convert Firestore Timestamp to Date
        };
      });

      setFavorites(storedFavorites);
      console.log("Fetched cars from Firestore:", storedFavorites);
    } catch (error) {
      console.error("Error fetching cars from Firestore:", error);
    }
  };

  // Fetch favorited cars from localStorage
  const fetchFavoritesFromLocalStorage = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
    console.log("Fetched cars from localStorage:", storedFavorites);
  };

  // Remove the selected car from favorites
  const removeFromFavorites = async (id) => {
    // Define user
    const user = auth.currentUser;

    if (user) {
      // Remove from Firestore
      try {
        const userFavRef = doc(db, "users", user.uid, "favoritedCars", id);
        await deleteDoc(userFavRef);
        console.log(`Car with ID ${id} removed from Firestore`);

        // Update state to reflect the deletion in real-time
        setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.carId !== id));

      } catch (error) {
        console.error("Error removing car from Firestore:", error);
      }

    } else {
      // Remove from localStorage
      const updatedFavorites = favorites.filter((car) => car.carId !== id);
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      console.log(`Car with ID ${id} removed from localStorage`);
    }

  };

  // Get Chat ID (Contact Seller)
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
                text: `Hello, I'm interested in your ${car.year} ${car.make} ${car.model}!`,
                timestamp: serverTimestamp(),
                sender_id: auth.currentUser.uid,
              }).then(() => {
                window.location.href = `/messaging/${docRef.id}`;

                // Navigate to Messaging
                navigate(`/messaging/${docRef.id}`)
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
              {favorites
              .sort((a, b) => {
                const dateA = new Date(a.date).getTime(); // Ensure valid timestamp
                const dateB = new Date(b.date).getTime();
                return dateA - dateB; // Oldest first
              })
              .reverse() // Reverse the array to render the oldest at the bottom
              .map((car) => (
                <div key={car.id} className="car-item">
                  <div className="car-image">
                    <a href={`carlistingpage/${car.owner}/${car.carId}`}>
                      <img src={car.image} alt={`${car.year} ${car.make} ${car.model}`}/>
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
                        {car.year} {car.make} {car.model}
                      </h3>
                      <p className="car-cost">
                        ${Number(car.cost).toLocaleString()}
                      </p>
                    </div>
                    <p className="odometer">
                      {Number(car.odometer).toLocaleString()} miles
                    </p>
                    <p className="seller">{car.seller}</p>

                    {/* Only show Contact Seller when User is logged in or the car is not owned by the same user */}
                    {(user && user.uid !== car.owner) &&
                      <p className="contact-seller">
                        <a className="contact-seller-link" onClick={() => getChatId(car)}>
                          Contact Seller{" "}
                          <i>
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                          </i>
                        </a>
                      </p>
                    }
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
