const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error('MONGO_URI is not set in environment variables');
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB...');
    const safeUri = mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log('MongoDB URI:', safeUri);

    const conn = await mongoose.connect(mongoURI);

    console.log('MongoDB Connected Successfully!');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    console.error('Please check:');
    console.error('1. MongoDB server is reachable');
    console.error('2. MONGO_URI in .env matches your connection string');
    process.exit(1);
  }
};

module.exports = connectDB;
