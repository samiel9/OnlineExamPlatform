const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure dotenv is configured to access JWT_SECRET

exports.registerUser = async (req, res) => {
  const { 
    email, nom, prenom, naissance, sexe, etablissement, 
    filiere, annee, semestre, groupe, password, role 
  } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user instance
    user = new User({
      email,
      nom,
      prenom,
      naissance,
      sexe,
      etablissement,
      filiere,
      annee,
      semestre,
      groupe,
      password,
      role,
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // For now, just return a success message or the user object (without password)
    // JWT generation will be handled in the login controller later
    res.status(201).json({ msg: 'User registered successfully', userId: user.id, role: user.role });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // User matched, create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // Expires in 1 hour (adjust as needed)
      (err, token) => {
        if (err) throw err;
        res.json({ token, userId: user.id, role: user.role });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get current authenticated user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update current authenticated user
exports.updateCurrentUser = async (req, res) => {
  try {
    const allowed = ['nom', 'prenom', 'naissance', 'sexe', 'etablissement', 'filiere', 'annee', 'semestre', 'groupe'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) { // Add this check
      return res.status(404).json({ msg: 'User not found for update' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
