import React from "react";
import VehicleCard from "../components/VehicleCard";
import "../styles/CarListing.css";

const CarListingPage = () => {
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
      <VehicleCard vehicle={exampleVehicle} detailed={true} />
    </div>
  );
};

export default CarListingPage;
