import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Signup from './Signup';
import './index.css';

function App() {
  // 1. Use state to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  // 2. A function to update state when login is successful
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // 3. A function to clear state and redirect on logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <>
      {/* 4. Pass login status and logout function to Navbar */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* 5. Pass the handleLogin function to the Login component */}
        <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
        
        <Route path="/signup" element={<Signup />} />
        
        {/* 6. Protect all other routes */}
        <Route path="/about" element={isLoggedIn ? <About /> : <Login onLoginSuccess={handleLogin} />} />
        <Route path="/contact" element={isLoggedIn ? <Contact /> : <Login onLoginSuccess={handleLogin} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login onLoginSuccess={handleLogin} />} />
      </Routes>
    </>
  );
}
export default App;

