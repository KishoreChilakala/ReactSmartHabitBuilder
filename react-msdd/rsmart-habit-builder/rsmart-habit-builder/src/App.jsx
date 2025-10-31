import { useState } from "react"; // Import useState
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Signup from './Signup';
import './index.css';

function App() {
  // Use state to track login status
  // Initialize state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  // This function will be passed to Login.jsx
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // This function will be passed to Navbar.jsx
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    navigate("/login"); // Navigate to login after state is set
  };

  return (
    <>
      {/* Always render Navbar, but pass isLoggedIn to it */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Pass the login handler to all Login component instances */}
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes: Check state variable, not localStorage */}
        <Route path="/about" element={isLoggedIn ? <About /> : <Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/contact" element={isLoggedIn ? <Contact /> : <Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login onLoginSuccess={handleLoginSuccess} />} />
      </Routes>
    </>
  );
}
export default App;
