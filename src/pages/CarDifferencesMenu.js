import React, { useState, useEffect } from "react";
import "../styles/carDifferences-menu.css";

const CarDifferencesMenu = () => {
  const [numCars, setNumCars] = useState(1); // User choice: 1 or 2 cars
  const [vin1, setVin1] = useState(""); // VIN for Car 1
  const [vin2, setVin2] = useState(""); // VIN for Car 2
  const [car1Details, setCar1Details] = useState(null); // Decoded details for Car 1
  const [car2Details, setCar2Details] = useState(null); // Decoded details for Car 2
  const [differences, setDifferences] = useState(null); // Differences between two cars
  const [error, setError] = useState(""); // Error message
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Variables to decode and compare
  const selectedVariables = [
    "Body Class",
    "Make",
    "Model",
    "Model Year",
    "Doors",
    "Drive Type",
    "Engine Number of Cylinders",
    "Transmission Style",
    "Curb Weight (lbs)",
    "Seating Capacity",
    "Fuel Economy (MPG)",
  ];

  // Fetch and decode VIN
  const fetchAndDecodeVin = async (vin, setDetails) => {
    if (!vin || vin.length !== 17) {
      setError("Please enter a valid 17-character VIN.");
      setDetails(null);
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
      const data = await response.json();

      if (data.Results) {
        const details = data.Results.reduce((acc, item) => {
          acc[item.Variable] = item.Value || "Data not available";
          return acc;
        }, {});
        setDetails(details);
      } else {
        setError("No results found for the VIN.");
        setDetails(null);
      }
    } catch (error) {
      setError("Error decoding VIN: " + error.message);
      setDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically compare cars when both VINs are decoded
  const compareCars = () => {
    if (!car1Details || !car2Details) {
      setError("Please decode both cars to view the differences.");
      return;
    }

    const comparison = selectedVariables.reduce((diff, key) => {
      if (car1Details[key] !== car2Details[key]) {
        diff[key] = {
          car1: car1Details[key] || "N/A",
          car2: car2Details[key] || "N/A",
        };
      }
      return diff;
    }, {});

    setDifferences(comparison);
  };

  // Automatically trigger comparison when Car 2 details are updated
  useEffect(() => {
    if (car1Details && car2Details) {
      compareCars();
    }
  }, [car2Details]);

  const handleVinChange = (setter, value) => {
    setter(value);
    setError("");
  };

  return (
    <div className="vin-decoder">
      <h2>VIN Decoder</h2>
      <p>Decode vehicle information based on VIN. Compare one or two vehicles.</p>

      {/* Number of Cars Selection */}
      <div className="car-selection">
        <label>Would you like to decode 1 car or 2 cars?</label>
        <select value={numCars} onChange={(e) => setNumCars(Number(e.target.value))}>
          <option value={1}>1 Car</option>
          <option value={2}>2 Cars</option>
        </select>
      </div>

      {/* VIN Input for Car 1 */}
      <div className="vin-input">
        <h3>Car 1</h3>
        <label>Enter VIN:</label>
        <input
          type="text"
          value={vin1}
          onChange={(e) => handleVinChange(setVin1, e.target.value)}
          placeholder="Enter VIN for Car 1"
        />
        <button onClick={() => fetchAndDecodeVin(vin1, setCar1Details)} disabled={isLoading}>
          {isLoading ? "Decoding..." : "Decode VIN"}
        </button>
      </div>

      {/* VIN Input for Car 2 (if selected) */}
      {numCars === 2 && (
        <div className="vin-input">
          <h3>Car 2</h3>
          <label>Enter VIN:</label>
          <input
            type="text"
            value={vin2}
            onChange={(e) => handleVinChange(setVin2, e.target.value)}
            placeholder="Enter VIN for Car 2"
          />
          <button onClick={() => fetchAndDecodeVin(vin2, setCar2Details)} disabled={isLoading}>
            {isLoading ? "Decoding..." : "Decode VIN"}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

{/* Decoded Details for Car 1 and Car 2 */}
{(car1Details || car2Details) && (
  <div className="car-details-container">
    {car1Details && (
      <div className="car-details">
        <h3 className="car-label">Car 1</h3> {/* Added label above the details */}
        <ul>
          {selectedVariables.map((variable) => (
            <li key={variable}>
              <strong>{variable}:</strong> {car1Details[variable] || "N/A"}
            </li>
          ))}
        </ul>
      </div>
    )}
    {car2Details && (
      <div className="car-details">
        <h3 className="car-label">Car 2</h3> {/* Added label above the details */}
        <ul>
          {selectedVariables.map((variable) => (
            <li key={variable}>
              <strong>{variable}:</strong> {car2Details[variable] || "N/A"}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}

      {/* Differences Display */}
      {differences && (
        <div className="differences">
          <h3>Differences</h3>
          <ul>
            {Object.keys(differences).map((key) => (
              <li
                key={key}
                className={differences[key].car1 === differences[key].car2 ? "no-difference" : "difference"}
              >
                <strong>{key}:</strong> Car 1: {differences[key].car1}, Car 2: {differences[key].car2}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CarDifferencesMenu;
