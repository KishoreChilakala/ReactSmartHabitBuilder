import React, { useState, useEffect } from "react";

function today() {
  return new Date().toISOString().split('T')[0];
}

function getCurrentUserKey() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  return user ? "habits_" + user.email : "habits_guest";
}

function loadHabits() {
  return JSON.parse(localStorage.getItem(getCurrentUserKey()) || '[]');
}
function saveHabits(habits) {
  localStorage.setItem(getCurrentUserKey(), JSON.stringify(habits));
}

const Dashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const [habits, setHabits] = useState(loadHabits());
  const [habitName, setHabitName] = useState("");
  const [completedToday, setCompletedToday] = useState(0);

  useEffect(() => {
    const doneToday = habits.filter(h => h.completedDates.includes(today())).length;
    setCompletedToday(doneToday);
    saveHabits(habits);
  }, [habits]);

  const addHabit = (e) => {
    e.preventDefault();
    const name = habitName.trim();
    if (!name) return;
    setHabits([
      ...habits,
      {
        id: Date.now(),
        name,
        streak: 0,
        completedDates: [],
        createdAt: today()
      }
    ]);
    setHabitName("");
  };

  const markComplete = (id) => {
    setHabits(
      habits.map(h => {
        if (h.id !== id) return h;
        if (h.completedDates.includes(today())) return h;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const streak =
          h.completedDates.length && h.completedDates[h.completedDates.length - 1] === yesterday
            ? h.streak + 1
            : 1;
        return {
          ...h,
          streak,
          completedDates: [...h.completedDates, today()]
        };
      })
    );
  };

  const completionRate = habits.length
    ? Math.round((completedToday / habits.length) * 100)
    : 0;

  return (
    <div style={{ padding: "2rem", background: "#f7f9fd", minHeight: "100vh" }}>
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
