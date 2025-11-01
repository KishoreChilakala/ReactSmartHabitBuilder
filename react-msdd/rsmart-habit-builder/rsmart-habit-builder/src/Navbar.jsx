import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

// 1. Accept isLoggedIn and onLogout as props from App.jsx
const Navbar = ({ isLoggedIn, onLogout }) => {

  // Get user's name from localStorage (this is okay to do here)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const userName = currentUser ? currentUser.name : "User";

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <span role="img" aria-label="target">🎯</span>
        <span>Smart Habit Builder</span>
      </div>
      <ul className="navbar__menu">
        {/* 2. Show these links ONLY when logged in */}
        {isLoggedIn ? (
          <>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </>
        ) : (
          // 3. Show this link ONLY when logged out
          <li><NavLink to="/" end>Home</NavLink></li>
        )}

        {/* 4. Conditional Login/Logout Button */}
        <li>
          {isLoggedIn ? (
            <>
              <span style={{ marginRight: '1.5em', color: '#555' }}>
                Hi, {userName}!
              </span>
              <button onClick={onLogout} className="btn-logout" style={{border: 'none', cursor: 'pointer'}}>
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

