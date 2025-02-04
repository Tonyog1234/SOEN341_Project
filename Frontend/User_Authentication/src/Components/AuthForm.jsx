import React, { useState } from "react";
import axios from "axios";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthForm = () => {
  const [message, setMessage] = useState("");

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post("/api/login", { username, password });
      localStorage.setItem("token", response.data.token);
      setMessage("Login successful!");
    } catch (error) {
      setMessage("Login failed: " + error.response.data.message);
    }
  };

  const handleRegister = async (username, password, role) => {
    try {
      await axios.post("/api/register", { username, password, role });
      setMessage("Registration successful! You can now log in.");
    } catch (error) {
      setMessage("Registration failed: " + error.response.data.message);
    }
  };

  return (
    <div className="FormContainer">
      <h1 className="Authentication">Authentication</h1>
      <LoginForm onLogin={handleLogin} />
      <hr className="my-4" />
      <RegisterForm onRegister={handleRegister} />
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default AuthForm;
