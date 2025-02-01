import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  //useState is a hook that allows you to add state to a functional component
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    //async means it will use "await" to wait for the response
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { username, password });
      //await pause the function until the response is received
      //{ username, password } is the request body
      //"/api/login" MIGHT change depending on the backend
      localStorage.setItem("token", response.data.token);
      //localStorage is a key-value pair, "token" is the key, response.data.token is the value
      setMessage("Login successful!");
    } catch (error) {
      setMessage("Login failed: " + error.response.data.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/register", { username, password, role });
      setMessage("Registration successful! You can now log in.");
    } catch (error) {
      setMessage("Registration failed: " + error.response.data.message);
    }
  };

  return (
    <div className="OuterContainer">
      {/* "min-h-screen flex items-center justify-center bg-gray-100" */}
      <div className="FormContainer">
        {/* w-full max-w-md p-6 bg-white rounded-lg shadow-md */}
        <h1 className="Authentication">Authentication</h1>
        {/* text-2xl font-bold mb-4 text-center */}
        <form onSubmit={handleLogin} className="FormSubmit">
          {/* onSubmit is an event handler that is called when the form is submitted */}
          {/* space-y-4 */}
          <div>
            <label className="UserName">Username</label>
            {/* block mb-2 text-sm font-medium */}
            <input
              type="text"
              className="InputUser"
              // w-full p-2 border border-gray-300 rounded-lg
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // e.target refer to input field
              required
              // required means the input field cannot be empty
            />
          </div>
          <div>
            <label className="Password">Password</label>
            <input
              type="password"
              //  type password will hide input
              className="InputPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="LoginButton"
          >
            {/* w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 */}
            Login
          </button>
        </form>
        <hr className="my-4" />
        {/* horizontal line */}
        <form onSubmit={handleRegister} className="FormRegister">
          <div>
            <label className="UserName">Username</label>
            <input
              type="text"
              className="InputUser"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="Password">Password</label>
            <input
              type="password"
              className="InputPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="Role">Role</label>
            <select
              className="RoleSelect"
              // w-full p-2 border border-gray-300 rounded-lg
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button
            type="submit"
            className="SubmitButton"
            // w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600
          >
            Register
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default App;
