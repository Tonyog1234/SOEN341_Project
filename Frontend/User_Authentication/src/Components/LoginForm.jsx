import React, { useState } from "react";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="FormSubmit">
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
      <button type="submit" className="LoginButton">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
