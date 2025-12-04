const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');

exports.createExercise = async (req, res) => {
    try {
        const { workoutId, name, sets, reps, weight } = req.body;

        
        const workout = await Workout.findById(workoutId);
        if (!workout) return res.status(404).json({ msg: 'Workout not found' });
        if (workout.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const newExercise = new Exercise({
            workout: workoutId,
            name,
            sets,
            reps,
            weight
        });

        const exercise = await newExercise.save();
        res.json(exercise);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getExercises = async (req, res) => {
    try {
        
        const workout = await Workout.findById(req.params.workoutId);
        if (!workout) return res.status(404).json({ msg: 'Workout not found' });
        if (workout.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const exercises = await Exercise.find({ workout: req.params.workoutId });
        res.json(exercises);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateExercise = async (req, res) => {
    try {
        let exercise = await Exercise.findById(req.params.id).populate('workout');
        if (!exercise) return res.status(404).json({ msg: 'Exercise not found' });

        
        if (exercise.workout.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        exercise = await Exercise.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(exercise);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id).populate('workout');
        if (!exercise) return res.status(404).json({ msg: 'Exercise not found' });

        if (exercise.workout.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await exercise.deleteOne();
        res.json({ msg: 'Exercise removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
