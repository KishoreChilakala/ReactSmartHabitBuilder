import { Routes, Route } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Signup from './Signup';
import './index.css';

function App() {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={isLoggedIn ? <About /> : <Login />} />
        <Route path="/contact" element={isLoggedIn ? <Contact /> : <Login />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login />} />
      </Routes>
    </>
  );
}
export default App;
