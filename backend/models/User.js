const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  naissance: {
    type: Date,
    required: true,
  },
  sexe: {
    type: String,
    required: true,
    enum: ['Homme', 'Femme', 'Autre'] // Or other relevant options
  },
  etablissement: {
    type: String,
    required: true,
  },
  filiere: {
    type: String,
    required: true,
  },
  annee: {
    type: String,
    required: false,
  },
  semestre: {
    type: String,
    required: false,
  },
  groupe: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['etudiant', 'enseignant'],
    default: 'etudiant',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
