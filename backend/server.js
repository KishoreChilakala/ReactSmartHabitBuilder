import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import 'dotenv/config'; // Import and configure dotenv

// Import models
import User from './models/user.model.js';
import Habit from './models/habit.model.js';

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this';

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if we can't connect
  });

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is invalid" });
    }
    // Add user's email and database ID to the request object
    req.user = user;
    next();
  });
};

// --- Helper Functions ---
function today() {
  return new Date().toISOString().split('T')[0];
}

// --- Auth Routes (Public) ---

/**
 * [POST] /api/auth/signup
 * Registers a new user
 */
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user to database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    console.log('User signed up:', newUser);
    res.status(201).json({ message: "User created successfully. Please log in." });
  
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error during signup." });
  }
});

/**
 * [POST] /api/auth/login
 * Logs in a user
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter both email and password." });
    }

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create JWT
    // We store the user's database ID (_id) and email in the token
    const tokenPayload = { 
      id: user._id, 
      email: user.email, 
      name: user.name 
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: "Login successful",
      token,
      user: { email: user.email, name: user.name }
    });
  
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// --- Habit Routes (Protected) ---
app.use('/api/habits', authenticateToken);

/**
 * [GET] /api/habits
 * Gets all habits for the logged-in user
 */
app.get('/api/habits', async (req, res) => {
  try {
    // req.user.id comes from the JWT token
    const userHabits = await Habit.find({ user: req.user.id });
    res.json(userHabits);
  } catch (error) {
    console.error("Get Habits Error:", error);
    res.status(500).json({ message: "Failed to fetch habits." });
  }
});

/**
 * [POST] /api/habits
 * Adds a new habit for the logged-in user
 */
app.post('/api/habits', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Habit name is required." });
    }

    const newHabit = new Habit({
      name: name.trim(),
      user: req.user.id, // Link habit to the logged-in user
      streak: 0,
      completedDates: [],
    });

    await newHabit.save();
    
    // Fetch and return the updated list
    const userHabits = await Habit.find({ user: req.user.id });
    res.status(201).json(userHabits);

  } catch (error) {
    console.error("Add Habit Error:", error);
    res.status(500).json({ message: "Failed to add habit." });
  }
});

/**
 * [PUT] /api/habits/:id/complete
 * Marks a habit as complete for today
 */
app.put('/api/habits/:id/complete', async (req, res) => {
  try {
    const habitId = req.params.id;
    const habit = await Habit.findOne({ _id: habitId, user: req.user.id });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.completedDates.includes(today())) {
      // Already completed, just return the current habits
      const userHabits = await Habit.find({ user: req.user.id });
      return res.json(userHabits);
    }

    // Calculate streak
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const streak =
      habit.completedDates.length && habit.completedDates[habit.completedDates.length - 1] === yesterday
        ? habit.streak + 1
        : 1;

    // Update the habit
    habit.streak = streak;
    habit.completedDates.push(today());
    await habit.save();

    // Fetch and return updated list
    const userHabits = await Habit.find({ user: req.user.id });
    res.json(userHabits);

  } catch (error) {
    console.error("Mark Complete Error:", error);
    res.status(500).json({ message: "Failed to mark habit complete." });
  }
});

/**
 * [DELETE] /api/habits/:id
 * Deletes a habit
 */
app.delete('/api/habits/:id', async (req, res) => {
  try {
    const habitId = req.params.id;
    
    // Find and delete the habit that matches the ID and the logged-in user
    const result = await Habit.deleteOne({ _id: habitId, user: req.user.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Habit not found or you're not authorized to delete it." });
    }

    // Fetch and return the new list of habits
    const userHabits = await Habit.find({ user: req.user.id });
    res.json(userHabits);

  } catch (error) {
    console.error("Delete Habit Error:", error);
    res.status(500).json({ message: "Failed to delete habit." });
  }
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

