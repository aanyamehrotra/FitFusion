const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true },
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Exercise', ExerciseSchema);
