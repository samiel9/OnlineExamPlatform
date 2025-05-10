const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['direct', 'qcm'], required: true },
  duration: { type: Number, required: true },
  score: { type: Number, required: true },
  answer: { type: mongoose.Schema.Types.Mixed },
  tolerance: { type: Number },
  options: [String],
  correct: [Number],
  // Nouveau champ pour le fichier associé à la question
  file: {
    filename: String,
    mimetype: String,
    data: Buffer
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
