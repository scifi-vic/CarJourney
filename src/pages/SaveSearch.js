// src/pages/SaveSearch.js
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./../styles/SaveSearch.css";


const SaveSearch = () => {
  const handleNewSearch = () => {
    console.log("Start a new search button clicked!");
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
              click "Save this search."
            </li>
            <li>
              <strong>Step 3:</strong> Name your search criteria for easy
              organizing.
            </li>
          </ul>
          <button className="new-search-button" onClick={handleNewSearch}>
            Start a New Search
          </button>
        </section>
      </main>

    </div>
  );
};

export default SaveSearch;
