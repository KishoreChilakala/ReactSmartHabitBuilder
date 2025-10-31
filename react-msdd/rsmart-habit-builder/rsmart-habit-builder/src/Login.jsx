import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// 1. It must accept { onLoginSuccess } as a prop
const Login = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      // Save credentials
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));

      // 2. It MUST call onLoginSuccess() right here
      onLoginSuccess(); 
      
      // 3. Then it navigates
      navigate("/dashboard");

    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page" style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h1>Login to Smart Habit Builder</h1>
      {error && <div className="error" role="alert" style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">
          Email Address
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Forgot your password? <a href="/forgot-password">Click here</a>
      </p>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </main>
  );
};

export default Login;

