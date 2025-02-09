// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Reservation from "./components/Reservation";
import Register from "./components/Register";
import Booking from "./components/Booking";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} /> {}
          <Route path="/login" element={<Login />} />
          <Route path="/Booking" element={<Booking />} />
          <Route path="/Reservation" element={<Reservation />} />
          <Route path="/register" element={<Register />} />/{" "}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
