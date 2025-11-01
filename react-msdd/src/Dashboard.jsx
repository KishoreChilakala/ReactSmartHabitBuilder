import React, { useState, useEffect } from "react";
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// --- API Helper ---
// 1. Get the base URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL; 

// Create an axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL, // 2. Use the variable here
});

// Use an "interceptor" to add the token to headers before each request is sent
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// --- End of API Helper ---

// Helper function to get today's date
function today() {
  return new Date().toISOString().split('T')[0];
}

const Dashboard = () => {
  const [habits, setHabits] = useState([]); // Default to empty array
  const [habitName, setHabitName] = useState("");
  const [completedToday, setCompletedToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Start loading
  const [error, setError] = useState(""); // To store API errors
  const navigate = useNavigate();

  // Get user's name from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const userName = currentUser ? currentUser.name : "Guest";

  // --- Data Fetching ---
  useEffect(() => {
    const fetchHabits = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await api.get('/habits'); // Fetches from /api/habits
        setHabits(response.data); // Set habits from API response
      } catch (_err) { // Use _err to avoid lint warning
        if (_err.response && (_err.response.status === 401 || _err.response.status === 403)) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token"); 
          localStorage.removeItem("currentUser");
          navigate("/login"); 
        } else {
          setError("Failed to load habits. Please check your connection or try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchHabits();
  }, [navigate]); // Add navigate to dependency array

  // --- Statistics Calculation ---
  useEffect(() => {
    const doneToday = habits.filter(h => h.completedDates.includes(today())).length;
    setCompletedToday(doneToday);
  }, [habits]);

  // --- Event Handlers ---

  const addHabit = async (e) => {
    e.preventDefault();
    const name = habitName.trim();
    if (!name) return;

    try {
      const response = await api.post('/habits', { name });
      setHabits(response.data);
      setHabitName(""); 
    } catch (_err) { // Use _err to avoid lint warning
      setError("Failed to add habit. Please try again.");
    }
  };

  const markComplete = async (id) => {
    try {
      const response = await api.put(`/habits/${id}/complete`);
      setHabits(response.data);
    } catch (_err) { // Use _err to avoid lint warning
      setError("Failed to mark habit complete. Please try again.");
    }
  };

  const deleteHabit = async (id) => {
    try {
      const response = await api.delete(`/habits/${id}`);
      setHabits(response.data);
    } catch (_err) { // Use _err to avoid lint warning
      setError("Failed to delete habit. Please try again.");
    }
  };

  const completionRate = habits.length
    ? Math.round((completedToday / habits.length) * 100)
    : 0;

  // --- Render ---
  if (isLoading) {
    return <div style={{ padding: "2rem", textAlign: "center", fontSize: "1.5rem" }}>Loading Dashboard...</div>;
  }

  return (
    <div style={{ padding: "2rem", background: "#f7f9fd", minHeight: "100vh" }}>
      {error && (
        <div style={{
          background: "#ffdddd", border: "1px solid #d32f2f", color: "#d32f2f",
          padding: "1rem", borderRadius: "8px", textAlign: "center", marginBottom: "1.5rem", fontWeight: 600
        }}>
          {error}
        </div>
      )}

      <div style={{
        background: "#fff", padding: "1.3rem", borderRadius: "18px",
        marginBottom: "2rem", textAlign: "center", boxShadow: "0 2px 16px #dde3fb"
      }}>
        <h1 style={{ color: "#4f74f9", fontSize: "2.1em", fontWeight: 800, marginBottom: "0.2em" }}>
          Welcome, {userName}!
        </h1>
        <form onSubmit={addHabit} style={{ display: "flex", gap: "1rem", justifyContent: "center", margin: "1.5em auto 0 auto", maxWidth: 480 }}>
          <input
            value={habitName}
            onChange={e => setHabitName(e.target.value)}
            placeholder="Enter a new habit..."
            style={{ flex: 1, padding: "0.7em", borderRadius: "8px", border: "1px solid #e5eafc" }}
          />
          <button type="submit" style={{
            background: "#4265fa", color: "#fff", borderRadius: "8px", fontWeight: 700,
            padding: "0.7em 1.5em", border: "none"
          }}>
            + Add Habit
          </button>
        </form>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", margin: "2.5rem 0", flexWrap: "wrap" }}>
        <div className="dashboard-stat">
          <div className="stat-icon" style={{ background: "#e5edfe" }}>🔥</div>
          <div className="stat-value">{habits.length}</div>
          <div className="stat-label">Total Habits</div>
        </div>
        <div className="dashboard-stat">
          <div className="stat-icon" style={{ background: "#e6f7ee" }}>✅</div>
          <div className="stat-value">{completedToday}</div>
          <div className="stat-label">Completed Today</div>
        </div>
        <div className="dashboard-stat">
          <div className="stat-icon" style={{ background: "#fff4e0" }}>📈</div>
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
      </div>
      <div style={{
        background: "#fff", padding: "2rem", borderRadius: "18px", boxShadow: "0 2px 14px #e8e9fa",
        marginBottom: "3rem"
      }}>
        <h2>Your Habits</h2>
        {habits.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ba4b5", padding: "2.5em 0" }}>
            <span style={{ fontSize: "2em", marginBottom: 10, display: "block" }}>🌱</span>
            <strong>No habits yet</strong>
            <p style={{ fontSize: "0.98em" }}>Start building better habits by adding your first one above!</p>
          </div>
        )}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {habits.map(({ id, name, completedDates, streak }) => (
            <li key={id} style={{
              padding: "0.95em 0.7em", borderBottom: "1px solid #f0f2fa",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div>
                <strong>{name}</strong>
                <div style={{ color: "#2e8e4d", fontWeight: 500, fontSize: "1em" }}>
                  Streak: {streak} 🔥
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  style={{
                    background: completedDates.includes(today())
                      ? "#b5dbf5" : "#53b98f",
                    color: "#fff",
                    border: "none",
                    padding: "0.55em 1.5em",
                    borderRadius: "8px",
                    cursor: completedDates.includes(today()) ? "not-allowed" : "pointer",
                    fontWeight: 700
                  }}
                  onClick={() => !completedDates.includes(today()) && markComplete(id)}
                  disabled={completedDates.includes(today())}
                >
                  {completedDates.includes(today()) ? "Completed" : "Mark Complete"}
                </button>
                <button
                  title="Delete habit"
                  onClick={() => deleteHabit(id)}
                  style={{
                    background: '#fde8e8',
                    color: '#d9534f',
                    border: 'none',
                    borderRadius: '8px',
                    width: '38px',
                    height: '38px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    lineHeight: '1',
                  }}
                >
                  &times;
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

