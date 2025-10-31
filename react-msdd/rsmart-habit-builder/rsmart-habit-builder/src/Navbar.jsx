import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

// Get user info from localStorage
const isLoggedIn = !!localStorage.getItem("token");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from storage
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    // Redirect to login page and refresh the window
    navigate("/login");
    window.location.reload(); // Force reload to clear all state
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <span role="img" aria-label="target">🎯</span>
        <span>Smart Habit Builder</span>
      </div>
      <ul className="navbar__menu">
        {/* Show Dashboard link if logged in */}
        {isLoggedIn && (
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        )}
        
        {/* Keep these links for logged-in users */}
        {isLoggedIn && (
          <>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </>
        )}

        {/* Show Home/Login for logged-out users */}
        {!isLoggedIn && (
           <li><NavLink to="/" end>Home</NavLink></li>
        )}

        {/* Conditional Login/Logout Button */}
        <li>
          {isLoggedIn ? (
            <>
              <span style={{ marginRight: '1.5em', color: '#555' }}>
                Hi, {currentUser ? currentUser.name : 'User'}!
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn-login">Login</NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
