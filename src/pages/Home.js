import React from "react";
import { Link } from "react-router-dom";
import Garage from "../pages/Garage";
//import BannerImage from "../assets/pizza.jpeg";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <div className="headerContainer">
        <h1> CarJourney </h1>
        <Garage/>
      </div>
    </div>
  );
}

export default Home;