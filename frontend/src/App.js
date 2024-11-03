// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Statistics from "./components/Statistics";
import './styles.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </Router>
  );
}

export default App;
