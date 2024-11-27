import React from "react";
import "../styles/CustomerTestimonials.css";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "John Smith",
    review: "CarJourney made it so easy to find my dream car! The process was smooth and stress-free.",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    review: "I absolutely loved the service! Found a great deal and the customer support was excellent.",
    rating: 5,
  },
  {
    name: "Michael Williams",
    review: "Fantastic experience! Highly recommend CarJourney to anyone looking for a reliable car.",
    rating: 5,
  },
  {
    name: "Sarah Brown",
    review: "The best car-buying experience I’ve ever had. Super helpful staff and great car selection!",
    rating: 5,
  },
  {
    name: "David Miller",
    review: "I found the perfect car within minutes. CarJourney truly exceeded my expectations!",
    rating: 5,
  },
  {
    name: "Sophia Davis",
    review: "Amazing website! Everything was straightforward, and I’m so happy with my purchase.",
    rating: 5,
  },
  {
    name: "James Wilson",
    review: "I’m so impressed with CarJourney. I’ll definitely be using their service again in the future!",
    rating: 5,
  },
  {
    name: "Olivia Martinez",
    review: "The whole process was seamless, and the car I bought is in excellent condition.",
    rating: 5,
  },
  {
    name: "Benjamin Anderson",
    review: "CarJourney was super easy to use, and I found the car I wanted at a great price.",
    rating: 5,
  },
  {
    name: "Isabella Thomas",
    review: "I can’t thank CarJourney enough for helping me find the perfect car. Highly recommended!",
    rating: 5,
  },
  {
    name: "John Smith",
    review: "CarJourney made it so easy to find my dream car! The process was smooth and stress-free.",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    review: "I absolutely loved the service! Found a great deal and the customer support was excellent.",
    rating: 5,
  },
  {
    name: "Michael Williams",
    review: "Fantastic experience! Highly recommend CarJourney to anyone looking for a reliable car.",
    rating: 5,
  },
  {
    name: "Sarah Brown",
    review: "The best car-buying experience I’ve ever had. Super helpful staff and great car selection!",
    rating: 5,
  },
  {
    name: "David Miller",
    review: "I found the perfect car within minutes. CarJourney truly exceeded my expectations!",
    rating: 5,
  },
  {
    name: "Sophia Davis",
    review: "Amazing website! Everything was straightforward, and I’m so happy with my purchase.",
    rating: 5,
  },
  {
    name: "James Wilson",
    review: "I’m so impressed with CarJourney. I’ll definitely be using their service again in the future!",
    rating: 5,
  },
  {
    name: "Olivia Martinez",
    review: "The whole process was seamless, and the car I bought is in excellent condition.",
    rating: 5,
  },
  {
    name: "Benjamin Anderson",
    review: "CarJourney was super easy to use, and I found the car I wanted at a great price.",
    rating: 5,
  },
  {
    name: "Isabella Thomas",
    review: "I can’t thank CarJourney enough for helping me find the perfect car. Highly recommended!",
    rating: 5,
  },
];

const CustomerTestimonials = () => {
  return (
    <div className="customer-testimonials">
      <h1>Customer Testimonials</h1>
      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="stars">
              {[...Array(testimonial.rating)].map((_, i) => (
                <FaStar key={i} color="#FFD700" />
              ))}
            </div>
            <p className="review-text">"{testimonial.review}"</p>
            <h3 className="reviewer-name">- {testimonial.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonials;
