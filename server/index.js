const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use('/api/templates', require('./routes/workoutTemplateRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.get('/', (req, res) => res.send('FitFusion API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
