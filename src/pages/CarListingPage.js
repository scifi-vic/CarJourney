import React from "react";
import VehicleCard from "../components/VehicleCard";
import "../styles/CarListing.css";
import { useEffect } from "react";
import { useParams } from "react-router";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  getDoc,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

const CarListingPage = () => {
  const {ownerId,carId}= useParams();

  useEffect(() => {
    async function fetchCar() {
      // get car data from the url param
      const snapshot = await getDoc(doc(db, "users", ownerId, "cars", carId));

      // get owner name
      const userSnapshot = await getDoc(doc(db, "users", ownerId));
      const fullName = userSnapshot.data().firstName + " " + userSnapshot.data().lastName; 

      // returns car data with owner name
      setCar({...snapshot.data(), seller: fullName, ownerId, carId});
    }
    
    fetchCar();
  }, []);

  const [car, setCar] = React.useState({});
  const exampleVehicle = {
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 22000,
    mileage: 32000,
    seller: "John Adams",
    image: "/images/camry1.jpg", // Correct path for the public folder
  };

  return (
    <div className="car-listing-page">
      <VehicleCard vehicle={car} detailed={true} />
    </div>
  );
};

export default CarListingPage;
