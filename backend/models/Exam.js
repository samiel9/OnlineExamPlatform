const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating unique links

const ExamSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  publicCible: { // Target audience
    type: String,
    required: true,
  },
  lienExamen: { // Unique link for the exam
    type: String,
    default: uuidv4,
    unique: true,
  },
  status: {
    type: String,
    enum: ['actif', 'enPause', 'archivé'],
    default: 'actif',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (teacher)
    required: true,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question', // We'll create this model later
  }],
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  // Add other fields like duration, status (draft, published), etc. as needed
});

module.exports = mongoose.model('Exam', ExamSchema);