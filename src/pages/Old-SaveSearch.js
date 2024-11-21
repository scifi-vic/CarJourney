// src/pages/SaveSearch.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./../styles/SaveSearch.css";


const SaveSearch = () => {
  // Handle Saved Cars
  const [savedSearches, setSavedSearches] = useState([]);

  const handleSaveSearch = (newSearch) => {
      setSavedSearches((prevSearches) => [...prevSearches, newSearch]);
  };
  
  // Redirect Link
  const navigate = useNavigate(); // React Router hook for navigation

  const handleRedirect = () => {
      navigate("/advanced-search"); // Redirect to the AdvancedSearchPage route
  };

  return (
    <div>

      {/* Header Navigator */}
      <div className="headerNav-container">
        <nav>
          <ul className="header-nav-list">
            <li>
              <a href="add-car">Add Cars</a>
            </li>
            <li>
              <a href="favorited-cars">Favorited Cars</a>
            </li>
            <li>
              <a href="saved-searches" className="active">
                Saved Searches
              </a>
            </li>
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
          <div>
            <h2>You Have {savedSearches.length} Saved Search{savedSearches.length !== 1 ? "es" : ""}</h2>
            <ul>
                {savedSearches.map((search, index) => (
                    <li key={index}>
                        <strong>Make:</strong> {search.make}, <strong>Model:</strong> {search.model}, <strong>ZIP Code:</strong> {search.zipCode}, <strong>Distance:</strong> {search.distance}
                    </li>
                ))}
            </ul>
          </div>
        )}
      </main>

    </div>
  );
};

export default SaveSearch;
