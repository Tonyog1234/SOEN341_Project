import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import AdminDash from "./components/AdminDash";
import AdminChannel from "./components/AdminChannel";
import MemberDash from "./components/MemberDash";
import MemberChannel from "./components/MemberChannel";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/Admin"
          element={
            <ProtectedRoute>
              <AdminDash />
            </ProtectedRoute>
          }
        />
        <Route path="" />
        <Route
          path="/Member"
          element={
            <ProtectedRoute>
              <MemberDash />
            </ProtectedRoute>
          }
        />
        <Route path="" />
        <Route path="/channel/:id" element={<AdminChannel />} />
       
        <Route path="/channelmember/:id" element={<MemberChannel />} />
      </Routes>
    </Router>
  );
}

export default App;
