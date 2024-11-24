// src/pages/SaveSearch.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./../styles/SaveSearch.css";

const SaveSearch = () => {
  // Load saved searches from localStorage
  const [savedSearches, setSavedSearches] = useState([]);

  // Load saved searches from localStorage on component mount
  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem("savedSearches")) || [];
    setSavedSearches(storedSearches);
  }, []);

  // Remove a search by the ID
  const handleRemoveSearch = (id) => {
    const updatedSearches = savedSearches.filter((search) => search.id !== id);
    setSavedSearches(updatedSearches);
    localStorage.setItem("savedSearches", JSON.stringify(updatedSearches));
  };

  // Redirect Link
  const navigate = useNavigate(); // React Router hook for navigation

  const handleRedirect = () => {
      navigate("/advanced-search"); // Redirect to the AdvancedSearchPage route
  };

  // Handle "View Search Results"
  const handleViewResults = (id) => {
    const search = savedSearches.find((s) => s.id === id);
    if (search) {
      const url = `/results?make=${search.make}&model=${search.model}`
                  + `&minPrice=${search.minPrice}&maxPrice=${search.maxPrice}`
                  + `&minYear=${search.minYear}&maxYear=${search.maxYear}`
                  + `&mileage=${search.mileage}&transmission=${search.transmission}`
                  + `&fuelType=${search.fuelType}&bodyStyle=${search.bodyStyle}`
                  + `&driveType=${search.driveType}&color=${search.color}`;
      navigate(url);
    }
  };

  // Initiate Date
  const date = new Date(Date.now());

  return (
    <div>

      {/* Header Navigator */}
      <div className="headerNav-container">
        <nav>
          <ul className="header-nav-list">
            <li><a href="my-cars">My Cars</a></li>
            <li><a href="add-car">Add Cars</a></li>
            <li><a href="favorited-cars">Favorited Cars</a></li>
            <li><a href="saved-searches" className="active">Saved Searches</a></li>
          </ul>
        </nav>
      </div>

      {/* Main Body */}
      <main>
        {/* If savedSearches = 0 */}
        {savedSearches.length === 0 ? (
          <section className="saved-searches">
            <h2>You Have 0 Saved Searches</h2>
            <p>Save your searches by organizing them here in just one click!</p>
            <p>Here's how:</p>
            <ul>
              <li>
                <strong>Step 1:</strong> Start a new search and select the search
                criteria you want.
              </li>
              <li>
                <strong>Step 2:</strong> View results - if you like what you see,
                click "Save Search."
              </li>
              <li>
                <strong>Step 3:</strong> Your current search filters should then save here.
              </li>
            </ul>
            <button className="new-search-button" onClick={handleRedirect}>
              Start a New Search
            </button>
          </section>
          // If savedSearches > 1
          ) : (
            <section className="re-search">
              <p className="search-number">You Have {savedSearches.length} Saved Search{savedSearches.length !== 1 ? "es" : ""}</p>
              <button className="re-search-button" onClick={handleRedirect}>
                Start a New Search
              </button>
              <ul>
                  {savedSearches.map((search) => (
                    <div key={search.id}>
                        <div className="search-header">
                          <p className="search-title">Saved Search ({search.id})</p>
                          <p className="remove-text" onClick={() => handleRemoveSearch(search.id)}>Remove</p>
                        </div>
                        <p className="created-text">Created on: <span>{date.toLocaleDateString('en-US')}</span></p>
                        <p className="search-criteria">Search Criteria</p>

                        { /*  Search Filters
                              Checks if certain filters exist, do not display if it does not exist */}
                        <div className="search-filters">
                          {search.make && <p>Make: <span>{search.make}</span></p>}
                          {search.model && <p>Model: <span>{search.model}</span></p>}
                          {search.distance && <p>Distance: <span>{search.distance} miles</span></p>}
                          {search.zipCode && <p>ZIP Code: <span>{search.zipCode}</span></p>}

                          { /* Handle Year Range */ }
                          { /* Minimum Year */ }
                          {search.minYear && !search.maxYear && (
                            <p>Min. Year: <span>{search.minYear}</span></p>
                          )}
                          { /* Max Year */ }
                          {search.maxYear && !search.minYear && (
                            <p>Max Year: <span>{search.maxYear}</span></p>
                          )}
                          { /* Both Min and Max Year  */ }
                          {search.minYear && search.maxYear && (
                            <p>Year Range: <span>{search.minYear} to {search.maxYear}</span></p>
                          )}

                          { /* Handle Price Range */ }
                          { /* Minimum Price */ }
                          {search.minPrice && !search.maxPrice && (
                            <p>Min. Price: <span>${Number(search.minPrice).toLocaleString()}</span></p>
                          )}
                          { /* Max Price */ }
                          {search.maxPrice && !search.minPrice && (
                            <p>Max Price: <span>${Number(search.maxPrice).toLocaleString()}</span></p>
                          )}
                          { /* Both Min and Max Price  */ }
                          {search.minPrice && search.maxPrice && (
                            <p>Price Range: <span>${Number(search.minPrice).toLocaleString()} to ${Number(search.maxPrice).toLocaleString()}</span></p>
                          )}         

                          {search.mileage && <p>Mileage: <span>{Number(search.mileage).toLocaleString()} miles</span></p>    }
                          {search.transmission && <p>Transmission: <span>{search.transmission}</span></p>}
                          {search.fuelType && <p>Fuel Type: <span>{search.fuelType}</span></p>}
                          {search.driveType && <p>Drive Type: <span>{search.driveType}</span></p>}
                          {search.bodyStyle && <p>Body Style: <span>{search.bodyStyle}</span></p>}
                          {search.engineType && <p>Engine Type: <span>{search.engineType}</span></p>}
                          {search.color && <p>Color Type: <span>{search.color}</span></p>}
                        </div>

                        { /* View Search Results */ }
                        <button 
                          key={search.id}
                          onClick={() => handleViewResults(search.id)}
                          className="view-search-button">
                            View Search Results
                        </button>

                        { /* Horizontal Line */ }
                        <hr className="horizontal-line" />
                    </div>
                  ))}
              </ul>
          </section>
        )}
      </main>

    </div>
  );
};

export default SaveSearch;
