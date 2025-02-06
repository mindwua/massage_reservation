// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Reservation from './components/Reservation';
import RegisterForm from "./components/RegisterForm";
import Booking from "./components/Booking";

import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} /> {}
          <Route path="/login" element={<Login />} />
          <Route path="/Booking" element={<Booking />} />
          <Route path="/Reservation" element={<Reservation />} />
          <Route path="/register" element={<RegisterForm />} />
/        </Routes>
      </div>
    </Router>
  );
}

export default App;
