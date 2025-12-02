const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'trainer', 'admin'], default: 'client' },
    
    // Profile Information
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    dateOfBirth: { type: Date },
    
    // Physical Stats
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    goalWeight: { type: Number }, // in kg
    bodyType: { type: String, enum: ['ectomorph', 'mesomorph', 'endomorph'], default: 'mesomorph' },
    
    // Fitness Goals
    fitnessGoals: [{ type: String }], // e.g., ['weight_loss', 'muscle_gain', 'endurance']
    activityLevel: { type: String, enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'], default: 'moderately_active' },
    
    // Trainer Specific Fields
    trainerInfo: {
        specialization: [{ type: String }], // e.g., ['weightlifting', 'cardio', 'yoga']
        certifications: [{ type: String }],
        experience: { type: Number, default: 0 }, // years
        hourlyRate: { type: Number },
        availability: { type: String },
        location: { type: String },
        socialMedia: {
            instagram: { type: String },
            youtube: { type: String },
            website: { type: String }
        }
    },
    
    // Client Specific Fields
    clientInfo: {
        currentTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        workoutPreference: { type: String, enum: ['home', 'gym', 'both'], default: 'gym' },
        dietaryRestrictions: [{ type: String }]
    },
    
    // Privacy Settings
    isProfilePublic: { type: Boolean, default: true },
    showContactInfo: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
