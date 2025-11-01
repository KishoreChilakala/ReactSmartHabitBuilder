import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios to make HTTP requests

// 1. Get the API URL from the environment variable
// This is the only line that really needs to change
const API_URL = `${import.meta.env.VITE_API_URL}/auth/signup`;

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Added success state
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Make the function async to handle the API call
  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success

    // Client-side validation
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Fill in all fields.");
      return;
    }

    setIsLoading(true); // Set loading to true before the request

    try {
      // 2. Use the new API_URL variable
      await axios.post(API_URL, {
        name: form.name,
        email: form.email,
        password: form.password
      });

      // If successful, show a success message and redirect
      setSuccess("Account created! Redirecting to login...");
      setForm({ name: "", email: "", password: "" }); // Clear form
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Wait 2 seconds before redirecting

    } catch (_err) {
      // This block runs if the API call fails
      const message = _err.response?.data?.message || "Signup failed. Please try again.";
      setError(message);
    } finally {
      // This runs after the try or catch block
      setIsLoading(false); // Set loading to false
    }
  }

  return (
    <div className="center-card" style={{ maxWidth: 400, margin: "3rem auto" }}>
      <h2 style={{ textAlign: "center", color: "#4265fa", fontWeight: "bold" }}>Sign Up</h2>
      
      {/* Show error or success messages */}
      {error && (
        <div className="error" role="alert" style={{ color: "red", marginBottom: "1rem", fontWeight: 600 }}>
          {error}
        </div>
      )}
      {success && (
        <div className="success" role="alert" style={{ color: "green", marginBottom: "1rem", fontWeight: 600 }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            autoFocus
            required
            disabled={isLoading} // Disable input while loading
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@email.com"
            required
            disabled={isLoading} // Disable input while loading
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            required
            disabled={isLoading} // Disable input while loading
          />
        </label>
        {/* Disable button and show loading text */}
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: 15 }}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}

export default Signup;

