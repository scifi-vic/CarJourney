import React from "react";
import { Link } from "react-router-dom";
//import BannerImage from "../assets/pizza.jpeg";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <div className="headerContainer">
        <h1> CarJourney </h1>
        <Link to="/garage">
          <button> Garage </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;