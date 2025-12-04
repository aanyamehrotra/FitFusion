const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'trainer', 'admin'], default: 'client' },

    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    dateOfBirth: { type: Date },
    
    height: { type: Number }, 
    weight: { type: Number }, 
    goalWeight: { type: Number }, 
    bodyType: { type: String, enum: ['ectomorph', 'mesomorph', 'endomorph'], default: 'mesomorph' },
    
    fitnessGoals: [{ type: String }], 
    activityLevel: { type: String, enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'], default: 'moderately_active' },

    trainerInfo: {
        specialization: [{ type: String }], 
        certifications: [{ type: String }],
        experience: { type: Number, default: 0 }, 
        hourlyRate: { type: Number },
        availability: { type: String },
        location: { type: String },
        socialMedia: {
            instagram: { type: String },
            youtube: { type: String },
            website: { type: String }
        }
    },
    
    
    clientInfo: {
        currentTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        workoutPreference: { type: String, enum: ['home', 'gym', 'both'], default: 'gym' },
        dietaryRestrictions: [{ type: String }]
    },
    
    
    isProfilePublic: { type: Boolean, default: true },
    showContactInfo: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
