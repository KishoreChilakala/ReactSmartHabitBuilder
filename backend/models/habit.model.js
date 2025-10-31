import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  // This links the habit to a specific user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  streak: {
    type: Number,
    default: 0,
  },
  completedDates: {
    type: [String], // An array of date strings
    default: [],
  },
}, {
  timestamps: true,
});

// This is CRITICAL for the frontend to work without changes
// It tells Mongoose to return 'id' instead of '_id'
habitSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;

