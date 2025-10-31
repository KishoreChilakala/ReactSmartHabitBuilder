import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }
    // Load users from localStorage
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let match = users.find(
      (u) => u.email === form.email && u.password === form.password
    );
    if (match) {
      localStorage.setItem("token", "signedin");
      localStorage.setItem("currentUser", JSON.stringify(match));
      navigate("/dashboard"); // or "/"
    } else {
      setError("Invalid email or password.");
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
        <button type="submit">Login</button>
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
