import React, { useEffect, useState } from "react";
import "../styles/CarComparison.css";

const CarComparison = () => {
  const [car1, setCar1] = useState(null);
  const [car2, setCar2] = useState(null);

  useEffect(() => {
    // Fetch car details from localStorage
    const car1Data = JSON.parse(localStorage.getItem("car1")) || {
      make: "Toyota",
      model: "Camry",
      year: 2024,
    };
    const car2Data = JSON.parse(localStorage.getItem("car2")) || {
      make: "Nissan",
      model: "Altima",
      year: 2024,
    };

    setCar1(car1Data);
    setCar2(car2Data);
  }, []);

  return (
    <div>
      <header>
        <div className="container">
          <h1>Compare Results</h1>
        </div>
      </header>

      <main>
        {/* Car Info Section */}
        <div className="comparison-section">
          <div className="car-info">
            <div className="car-image">
              <img
                src="/images/car1.jpg" // Replace with actual car image path
                alt={`${car1?.make} ${car1?.model}`}
              />
            </div>
            <h2>{`${car1?.make} ${car1?.model}`}</h2>
            <p>{`${car1?.model} Sedan\nNew ${car1?.year}`}</p>
            <button className="details-btn">See Details</button>
          </div>

          <div className="car-info">
            <div className="car-image">
              <img
                src="/images/car2.jpg" // Replace with actual car image path
                alt={`${car2?.make} ${car2?.model}`}
              />
            </div>
            <h2>{`${car2?.make} ${car2?.model}`}</h2>
            <p>{`${car2?.model} Sedan\nNew ${car2?.year}`}</p>
            <button className="details-btn">See Details</button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="comparison-table">
          <div className="comparison-row">
            <div className="comparison-label">Starting Price</div>
            <div className="comparison-car">$27,515</div>
            <div className="comparison-car">$27,510</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Fuel Economy</div>
            <div className="comparison-car">City 28/Hwy 39/Comb 32 MPG</div>
            <div className="comparison-car">City 27/Hwy 39/Comb 32 MPG</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Fuel Type</div>
            <div className="comparison-car">Gas</div>
            <div className="comparison-car">Gas</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Seating Capacity</div>
            <div className="comparison-car">5</div>
            <div className="comparison-car">5</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Basic Warranty</div>
            <div className="comparison-car">3 years or 36,000 miles</div>
            <div className="comparison-car">3 years or 36,000 miles</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Horsepower</div>
            <div className="comparison-car">206 @ 6800 RPM</div>
            <div className="comparison-car">188 @ 6000 RPM</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Engine</div>
            <div className="comparison-car">4-Cyl, 2.5 Liter</div>
            <div className="comparison-car">4-Cyl, 2.5 Liter</div>
          </div>
          <div className="comparison-row">
            <div className="comparison-label">Drivetrain</div>
            <div className="comparison-car">FWD</div>
            <div className="comparison-car">FWD</div>
          </div>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2024 CarJourney. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CarComparison;
