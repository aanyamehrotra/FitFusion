const mongoose = require('mongoose');

const WorkoutTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ['push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'cardio', 'custom'], required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    duration: { type: Number }, // in minutes
    daysPerWeek: { type: Number, default: 3 },
    exercises: [{
        name: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        weight: { type: Number },
        restTime: { type: Number }, // in seconds
        notes: { type: String }
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublic: { type: Boolean, default: true },
    timesUsed: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutTemplate', WorkoutTemplateSchema);

