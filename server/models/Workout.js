const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    duration: { type: Number }, // in minutes
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Workout', WorkoutSchema);
