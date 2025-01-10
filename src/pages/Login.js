import React from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

import LoginModal from '../components/LoginModal';  // New Login Modal
import RegisterModal from '../components/RegisterModal';  // New Register Modal

function Login() {
    return (
      <div className="login-page">
        <div className = "login-button">
            <LoginModal />
        </div>
        <div className = "register-button">
            <RegisterModal />
        </div>
      </div>
    );
  }

export default Login;