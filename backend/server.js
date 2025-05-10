const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const authRoutes = require('./routes/auth'); // Import auth routes
const examRoutes = require('./routes/exams'); // Import exam routes
const cors = require('cors');

const app = express();

// Enable CORS for development
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Connect Database and start server only when this module is run directly
if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', authRoutes); // Use auth routes
app.use('/api/exams', examRoutes); // Use exam routes

// Export app for testing
module.exports = app;
