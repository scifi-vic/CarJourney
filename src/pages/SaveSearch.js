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

  // Remove a search by index
  const handleRemoveSearch = (indexToRemove) => {
    const updatedSearches = savedSearches.filter((_, index) => index !== indexToRemove);
    setSavedSearches(updatedSearches);
    localStorage.setItem("savedSearches", JSON.stringify(updatedSearches));
  };

  // Redirect Link
  const navigate = useNavigate(); // React Router hook for navigation

  const handleRedirect = () => {
      navigate("/advanced-search"); // Redirect to the AdvancedSearchPage route
  };

  // Initiate Date
  const date = new Date(Date.now());

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
            <section className="re-search">
              <p className="search-number">You Have {savedSearches.length} Saved Search{savedSearches.length !== 1 ? "es" : ""}</p>
              <button className="re-search-button" onClick={handleRedirect}>
                Start a New Search
              </button>
              <ul>
                  {savedSearches.map((search, index) => (
                    <div key={index}>
                        <div className="search-header">
                          <p className="search-title">Saved Search ({index + 1})</p>
                          <p className="remove-text" onClick={() => handleRemoveSearch(index)}>Remove</p>
                        </div>
                        <p className="created-text">Created on: <span>{date.toLocaleDateString('en-US')}</span></p>
                        <p className="search-criteria">Search Criteria</p>

                        <p className="search-filters">Make: <span>{search.make}</span></p>
                        <p className="search-filters">Model: <span>{search.model}</span></p> 
                        <p className="search-filters">ZIP Code: <span>{search.zipCode}</span></p>
                        <p className="search-filters">Distance: <span>{search.distance}</span></p>

                        <button className="view-search-button">View Search Results</button>
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
