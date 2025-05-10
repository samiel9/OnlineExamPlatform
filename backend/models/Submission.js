const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    answer: mongoose.Schema.Types.Mixed,
    scoreAwarded: Number
  }],
  totalScore: Number,
  percentage: Number,
  submittedAt: { type: Date, default: Date.now },
  attemptNumber: { type: Number, default: 1 }, // Track which attempt this is
  totalScorePossible: Number,
  totalQuestions: Number,
  correctAnswersCount: Number,
  // Nouvelles informations pour l'analyse détaillée
  startTime: { type: Date }, // Heure de début de l'examen
  timeSpent: { type: Number }, // Temps passé en secondes
  location: {
    city: String,
    country: String,
    latitude: Number,
    longitude: Number,
    accuracy: Number // Added accuracy field
  }
});

module.exports = mongoose.model('Submission', SubmissionSchema);