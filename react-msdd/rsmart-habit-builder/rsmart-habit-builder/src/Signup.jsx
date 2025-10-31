import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import axios to make HTTP requests

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Make the function async to handle the API call
  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Client-side validation
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Fill in all fields.");
      return;
    }

    setIsLoading(true); // Set loading to true before the request

    try {
      // This replaces all the localStorage logic
      // Send a POST request to the backend signup endpoint
      // We await the request but don't need to store the response
      await axios.post('http://localhost:4000/api/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password
      });

      // If successful, the backend will send a 201 status.
      // We can then navigate the user to the login page.
      navigate("/login");

    } catch (err) {
      // This block runs if the API call fails
      if (err.response && err.response.data && err.response.data.message) {
        // This will display server-side errors, like "User with this email already exists."
        setError(err.response.data.message);
      } else {
        // This handles network errors or if the server is down
        setError("Signup failed. Please check your connection and try again.");
      }
    } finally {
      // This runs after the try or catch block
      setIsLoading(false); // Set loading to false
    }
  }

  return (
    <div className="center-card" style={{ maxWidth: 400, margin: "3rem auto" }}>
      <h2 style={{ textAlign: "center", color: "#4265fa", fontWeight: "bold" }}>Sign Up</h2>
      {/* Updated error display to be more prominent, like in Login.jsx */}
      {error && (
        <div className="error" role="alert" style={{ color: "red", marginBottom: "1rem", fontWeight: 600 }}>
          {error}
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

