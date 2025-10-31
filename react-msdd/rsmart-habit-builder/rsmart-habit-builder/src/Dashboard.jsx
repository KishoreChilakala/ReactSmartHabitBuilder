import React, { useState, useEffect } from "react";
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// Helper function to get today's date
function today() {
  return new Date().toISOString().split('T')[0];
}

// --- API Helper ---
// Create an axios instance with default settings
// This will automatically add our auth token to every request
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
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


const Dashboard = () => {
  // Remove currentUser, it's no longer needed here
  const [habits, setHabits] = useState([]); // Default to empty array
  const [habitName, setHabitName] = useState("");
  const [completedToday, setCompletedToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Start loading
  const [error, setError] = useState(""); // To store API errors
  const navigate = useNavigate();

  // --- Data Fetching ---
  useEffect(() => {
    // Fetch habits from the backend when the component mounts
    const fetchHabits = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await api.get('/habits');
        setHabits(response.data); // Set habits from API response
      } catch (err) {
        // Handle different types of errors
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          // 401 (Unauthorized) or 403 (Forbidden) means token is bad or expired
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token"); // Clear bad token
          localStorage.removeItem("currentUser");
          navigate("/login"); // Redirect to login
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
  // This effect runs whenever the 'habits' state changes
  useEffect(() => {
    const doneToday = habits.filter(h => h.completedDates.includes(today())).length;
    setCompletedToday(doneToday);
    // Removed saveHabits(), as the server is our source of truth
  }, [habits]);

  // --- Event Handlers ---

  const addHabit = async (e) => {
    e.preventDefault();
    const name = habitName.trim();
    if (!name) return;

    try {
      // Send POST request to the backend
      const response = await api.post('/habits', { name });
      // The backend sends back the new full list of habits
      setHabits(response.data);
      setHabitName(""); // Clear input on success
    } catch { // Removed unused 'err' variable
      setError("Failed to add habit. Please try again.");
    }
  };

  const markComplete = async (id) => {
    try {
      // Send PUT request to the specific habit's endpoint
      const response = await api.put(`/habits/${id}/complete`);
      // The backend sends back the updated full list of habits
      setHabits(response.data);
    } catch { // Removed unused 'err' variable
      setError("Failed to mark habit complete. Please try again.");
    }
  };

  const completionRate = habits.length
    ? Math.round((completedToday / habits.length) * 100)
    : 0;

  // --- Render ---

  // Show loading state
  if (isLoading) {
    return <div style={{ padding: "2rem", textAlign: "center", fontSize: "1.5rem" }}>Loading Dashboard...</div>;
  }

  return (
    <div style={{ padding: "2rem", background: "#f7f9fd", minHeight: "100vh" }}>
      {/* Show API error message */}
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
          Add New Habit
        </h1>
        <form onSubmit={addHabit} style={{ display: "flex", gap: "1rem", justifyContent: "center", margin: "1.5em auto 0 auto", maxWidth: 480 }}>
          <input
            value={habitName}
            onChange={e => setHabitName(e.target.value)}
            placeholder="Enter habit name (e.g., Drink 8 glasses of water)"
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
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", margin: "2.5rem 0" }}>
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

