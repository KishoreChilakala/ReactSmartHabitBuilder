import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  // Adds createdAt and updatedAt timestamps automatically
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;

