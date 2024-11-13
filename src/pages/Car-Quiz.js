// src/pages/CarQuiz.js
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./../styles/Car-Quiz.css";

const CarQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const questions = [
    {
      question: "What type of car are you interested in?",
      answers: [
        { text: "Sedan", img: "https://res.cloudinary.com/dosquaqi2/image/upload/v1729108743/sedan-quiz_akwltu.svg" },
        { text: "SUV", img: "https://res.cloudinary.com/dosquaqi2/image/upload/v1729108743/suv-quiz_ymxmu9.svg" },
        { text: "Truck", img: "https://res.cloudinary.com/dosquaqi2/image/upload/v1729108743/truck-quiz_cltsmr.svg" },
        { text: "Coupe", img: "https://res.cloudinary.com/dosquaqi2/image/upload/v1729108743/coupe-quiz_vp6gby.svg" },
        { text: "Convertible", img: "https://res.cloudinary.com/dosquaqi2/image/upload/v1729108743/convertible-quiz_xuiaui.svg" },
        { text: "Van", img: "https://res.cloudinary.com/dosquaqi2/image/upload/v1729108745/van-quiz_zmkhzf.svg" },
      ],
    },
    {
      question: "What will you use the car for most?",
      answers: [
        { text: "Daily commute" },
        { text: "Long-distance travel" },
        { text: "Off-road" },
        { text: "City driving" },
        { text: "Family trips" },
      ],
    },
    {
      question: "How important is fuel efficiency?",
      answers: [
        { text: "Very important" },
        { text: "Moderately important" },
        { text: "Not important" },
      ],
    },
    {
      question: "What kind of performance are you looking for?",
      answers: [
        { text: "Comfort-oriented" },
        { text: "Sporty" },
        { text: "Balanced" },
        { text: "High performance" },
      ],
    },
    {
      question: "Do you have a preference for technology features?",
      answers: [
        { text: "Advanced safety features" },
        { text: "Luxury and infotainment" },
        { text: "Basic features are fine" },
      ],
    },
  ];

  const carRecommendations = {
    "Sedan,Daily commute,Very important,Comfort-oriented,Advanced safety features": "Toyota Corolla Hybrid, Honda Civic Hybrid, Hyundai Elantra Hybrid",
    "Sedan,Daily commute,Very important,Comfort-oriented,Luxury and infotainment": "Lexus ES Hybrid, BMW 3 Series Hybrid, Audi A4",
    "Sedan,Long-distance travel,Very important,Comfort-oriented,Advanced safety features": "Honda Accord Hybrid, Toyota Camry Hybrid, Kia K5 Hybrid",
    "SUV,Family trips,Moderately important,Comfort-oriented,Luxury and infotainment": "Honda CR-V, Subaru Forester, Toyota RAV4",
    "SUV,Family trips,Very important,Comfort-oriented,Advanced safety features": "Mazda CX-5, Subaru Ascent, Hyundai Palisade",
    "Truck,Off-road,Not important,High performance,Basic features are fine": "Ford F-150 Raptor, RAM 1500 TRX, Toyota Tacoma TRD Pro",
    "Truck,City driving,Moderately important,Comfort-oriented,Basic features are fine": "Chevrolet Colorado, Ford Ranger, Toyota Tundra",
    "Coupe,Sporty,Not important,High performance,Luxury and infotainment": "Chevrolet Corvette, Porsche 911, BMW M4",
    "Coupe,Daily commute,Moderately important,Sporty,Advanced safety features": "Audi TT, Lexus RC, Infiniti Q60",
    "Convertible,City driving,Very important,Sporty,Luxury and infotainment": "Mazda MX-5 Miata, BMW Z4, Audi A5 Cabriolet",
    "Convertible,Long-distance travel,Very important,Sporty,Advanced safety features": "Mercedes-Benz E-Class Cabriolet, BMW 8 Series Convertible, Audi S5 Cabriolet",
    "SUV,Long-distance travel,Very important,Balanced,Advanced safety features": "Toyota Highlander Hybrid, Ford Explorer Hybrid, Kia Sorento Hybrid",
    "SUV,Off-road,Not important,High performance,Luxury and infotainment": "Land Rover Defender, Mercedes-Benz G-Class, Jeep Wrangler Rubicon",
    "Van,Family trips,Very important,Comfort-oriented,Advanced safety features": "Chrysler Pacifica Hybrid, Honda Odyssey, Toyota Sienna Hybrid",
    "Sedan,Long-distance travel,Moderately important,Balanced,Luxury and infotainment": "Lexus ES, BMW 5 Series, Mercedes-Benz E-Class",
    "Coupe,City driving,Very important,Sporty,Advanced safety features": "Audi TT, Mercedes-Benz CLA Coupe, BMW 2 Series",
    "Convertible,Daily commute,Very important,Balanced,Luxury and infotainment": "Volkswagen Beetle Convertible, MINI Cooper Convertible, Fiat 124 Spider",
    "SUV,Daily commute,Moderately important,Comfort-oriented,Advanced safety features": "Toyota RAV4, Nissan Rogue, Honda CR-V",
    "SUV,City driving,Moderately important,Balanced,Basic features are fine": "Chevrolet Trax, Hyundai Venue, Ford EcoSport",
    "Sedan,City driving,Very important,Comfort-oriented,Basic features are fine": "Hyundai Elantra, Nissan Sentra, Kia Forte",
    "Truck,Off-road,Moderately important,High performance,Luxury and infotainment": "Chevrolet Silverado ZR2, GMC Sierra AT4, RAM 1500 Rebel",
    "Van,City driving,Moderately important,Comfort-oriented,Advanced safety features": "Kia Carnival, Honda Odyssey, Chrysler Voyager",
    "SUV,Family trips,Very important,Comfort-oriented,Basic features are fine": "Mitsubishi Outlander, Subaru Outback, Toyota Venza",
    "Sedan,Daily commute,Moderately important,Comfort-oriented,Advanced safety features": "Nissan Altima, Hyundai Sonata, Kia Optima",
    "Coupe,Daily commute,Very important,Sporty,Advanced safety features": "Mercedes-Benz CLA Coupe, Audi A3, BMW 4 Series",
  };

  const generalizedRecommendations = {
    "Sedan": "Honda Accord, Toyota Camry, Hyundai Sonata",
    "SUV": "Toyota RAV4, Honda CR-V, Subaru Forester",
    "Truck": "Ford F-150, Chevrolet Silverado, Toyota Tacoma",
    "Coupe": "Ford Mustang, Chevrolet Camaro, Dodge Challenger",
    "Convertible": "Mazda MX-5 Miata, BMW Z4, Audi A5 Cabriolet",
    "Van": "Chrysler Pacifica, Honda Odyssey, Toyota Sienna",
  };

  const loadNextQuestion = (answer) => {
    setSelectedAnswers((prev) => [...prev, answer]);
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      showResult();
    }
  };

  const showResult = async () => {
    const resultKey = selectedAnswers.join(",");
    const recommendedCar = carRecommendations[resultKey];
    setResult(recommendedCar || generalizedRecommendations[selectedAnswers[0]]);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "quizResults", auth.currentUser.uid), {
          answers: selectedAnswers,
          recommendation: recommendedCar || generalizedRecommendations[selectedAnswers[0]],
          timestamp: new Date(),
        });
        console.log("Quiz result saved successfully.");
      } catch (error) {
        console.error("Error saving quiz result:", error);
      }
    }
  };

  // Function to reset the quiz state
  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setResult(null);
  };

  return (
    <div className="car-quiz-wrapper">
      <div className="car-quiz" role="main">
        {!result ? (
          <div className="question-container">
            <h2>{questions[currentQuestionIndex].question}</h2>
            <div className="answer-options">
              {questions[currentQuestionIndex].answers.map((answer, index) => (
                <div
                  key={index}
                  className="answer-option"
                  role="button"
                  aria-label={answer.text}
                  onClick={() => loadNextQuestion(answer.text)}
                >
                  {answer.img && (
                    <img
                      src={answer.img}
                      alt={answer.text}
                      className="answer-img"
                      loading="lazy"
                    />
                  )}
                  <button className="answer-btn">{answer.text}</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="result-container">
            <h2>Your Car Recommendation</h2>
            <p>{result}</p>
            <button className="retake-btn" onClick={retakeQuiz}>
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarQuiz;
