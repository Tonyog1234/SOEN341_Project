import React, { useState } from "react";

const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(username, password, role);
  };

  return (
    <form onSubmit={handleSubmit} className="FormRegister">
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
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select a role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      <button type="submit" className="SubmitButton">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
