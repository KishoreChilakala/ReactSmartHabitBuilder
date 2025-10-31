import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Fill in all fields.");
      return;
    }

    // Load users array (or start with an empty array)
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    // Prevent duplicate signup with same email
    if (users.find((u) => u.email === form.email)) {
      setError("User with this email already exists.");
      return;
    }
    // Add this signup to users array
    users.push({
      name: form.name,
      email: form.email,
      password: form.password
    });
    localStorage.setItem("users", JSON.stringify(users));
    // Optionally remove old signupUser key
    localStorage.removeItem("signupUser");
    navigate("/login");
  }

  return (
    <div className="center-card" style={{ maxWidth: 400, margin: "3rem auto" }}>
      <h2 style={{ textAlign: "center", color: "#4265fa", fontWeight: "bold" }}>Sign Up</h2>
      {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}
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
          />
        </label>
        <button type="submit" className="btn-primary">Sign Up</button>
      </form>
      <p style={{ textAlign: "center", marginTop: 15 }}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}

export default Signup;
