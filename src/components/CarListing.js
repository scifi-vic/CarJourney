// src/components/CarListing.js
import React, { useState } from "react";
import VehicleCard from "./VehicleCard";
import "../styles/CarListing.css";

const CarListing = () => {
  const [vehicles] = useState([
    {
      make: "Toyota",
      model: "Corolla",
      year: 2018,
      price: 15000,
      mileage: 35000,
      location: "Cypress, CA",
      image: "/images/corolla.jpg",
      dateAdded: "2024-09-12",
      drivetrain: "FWD",
    },
    {
      make: "Honda",
      model: "Civic",
      year: 2019,
      price: 17000,
      mileage: 30000,
      location: "Los Angeles, CA",
      image: "/images/civic.jpg",
      dateAdded: "2024-09-10",
      drivetrain: "FWD",
    },
    {
      make: "Tesla",
      model: "Model 3",
      year: 2022,
      price: 45000,
      mileage: 5000,
      location: "Pasadena, CA",
      image: "/images/tesla.jpg",
      dateAdded: "2024-08-20",
      drivetrain: "AWD",
    },
  ]);

  return (
    <main>
      <div id="vehicle-listings">
        {vehicles.map((vehicle, index) => (
          <VehicleCard key={index} vehicle={vehicle} />
        ))}
      </div>
    </main>
  );
};

export default CarListing;
