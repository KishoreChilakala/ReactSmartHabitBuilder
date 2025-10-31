import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar__logo">
      <span role="img" aria-label="target"></span>
      <span>Smart Habit Builder</span>
    </div>
    <ul className="navbar__menu">
      <li><NavLink to="/" end>Home</NavLink></li>
      <li><NavLink to="/about">About</NavLink></li>
      <li><NavLink to="/contact">Contact</NavLink></li>
      <li><NavLink to="/login" className="btn-login">Login</NavLink></li>
    </ul>
  </nav>
);

export default Navbar;
