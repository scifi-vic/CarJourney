// src/pages/Garage.js
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebaseConfig'; // Adjust the path if necessary

const auth = getAuth(app);

const Garage = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe; // Clean up the listener on component unmount
  }, []);

  return (
    <div>
      {currentUser ? (
        <p>Welcome, {currentUser.name}</p>
      ) : (
        <p>Please log in to access your garage.</p>
      )}
    </div>
  );
};

export default Garage;
