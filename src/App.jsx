import './App.css';


import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';


import Navbar from './Components/Navbar.jsx'
import Home from './Components/Home.jsx';
import Login from './Components/Login.jsx'
import Register from './Components/Register.jsx'
import Session from './Components/Session'

function App() {

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/session" element={<Session />} />
      </Routes>
    </div>
  );
}

export default App;