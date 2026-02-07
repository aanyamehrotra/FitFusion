const express = require('express');
const cors = require('cors');
require('dotenv').config();

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error(' Missing required environment variables:');
    missingEnvVars.forEach(varName => {
        console.error(`   - ${varName}`);
    });
    console.error('\nPlease check your .env file in the server directory.');
    console.error('Required variables:');
    console.error('   MONGO_URI=mongodb://localhost:27017/fitfusion');
    console.error('   JWT_SECRET=your-secret-key-here');
    process.exit(1);
}

const connectDB = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


connectDB();


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use('/api/templates', require('./routes/workoutTemplateRoutes'));
app.use('/api/diet', require('./routes/dietRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.get('/', (req, res) => res.send('FitFusion API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
