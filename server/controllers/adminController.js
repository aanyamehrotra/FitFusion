const User = require('../models/User');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

// Check if user is admin
const isAdmin = (user) => {
    return user && user.role === 'admin';
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create user
exports.createUser = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const { name, email, role = 'user' } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create user with default password (in production, you'd send email with temp password)
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        user = new User({ name, email, password, role });
        await user.save();

        const userResponse = await User.findById(user._id).select('-password');
        res.json(userResponse);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const { name, email, role } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ msg: 'Email already in use' });
            }
            user.email = email;
        }

        if (name) user.name = name;
        if (role) user.role = role;

        await user.save();
        const userResponse = await User.findById(user._id).select('-password');
        res.json(userResponse);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        await user.deleteOne();
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all workouts
exports.getAllWorkouts = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const workouts = await Workout.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(workouts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create workout
exports.createWorkout = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const { userId, title, duration, notes, date } = req.body;
        
        const workout = new Workout({
            user: userId || req.user.id,
            title,
            duration,
            notes,
            date: date || new Date()
        });
        
        await workout.save();
        const workoutWithUser = await Workout.findById(workout._id).populate('user', 'name email');
        res.json(workoutWithUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update workout
exports.updateWorkout = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(404).json({ msg: 'Workout not found' });
        }
        
        const { title, duration, notes, date, userId } = req.body;
        if (title) workout.title = title;
        if (duration !== undefined) workout.duration = duration;
        if (notes !== undefined) workout.notes = notes;
        if (date) workout.date = date;
        if (userId) workout.user = userId;

        await workout.save();
        const workoutWithUser = await Workout.findById(workout._id).populate('user', 'name email');
        res.json(workoutWithUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete workout
exports.deleteWorkout = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(404).json({ msg: 'Workout not found' });
        }
        await workout.deleteOne();
        res.json({ msg: 'Workout removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all exercises
exports.getAllExercises = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const exercises = await Exercise.find()
            .populate('workout')
            .populate('workout.user', 'name email')
            .sort({ createdAt: -1 });
        res.json(exercises);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create exercise
exports.createExercise = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const { workoutId, name, sets, reps, weight } = req.body;
        
        if (!workoutId) {
            return res.status(400).json({ msg: 'workoutId is required' });
        }

        const workout = await Workout.findById(workoutId);
        if (!workout) {
            return res.status(404).json({ msg: 'Workout not found' });
        }

        const exercise = new Exercise({
            workout: workoutId,
            name,
            sets,
            reps,
            weight: weight || 0
        });

        await exercise.save();
        const exerciseWithWorkout = await Exercise.findById(exercise._id)
            .populate('workout')
            .populate('workout.user', 'name email');
        res.json(exerciseWithWorkout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update exercise
exports.updateExercise = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).json({ msg: 'Exercise not found' });
        }
        
        const { name, sets, reps, weight, workoutId } = req.body;
        if (name) exercise.name = name;
        if (sets !== undefined) exercise.sets = sets;
        if (reps !== undefined) exercise.reps = reps;
        if (weight !== undefined) exercise.weight = weight;
        if (workoutId) exercise.workout = workoutId;

        await exercise.save();
        const exerciseWithWorkout = await Exercise.findById(exercise._id)
            .populate('workout')
            .populate('workout.user', 'name email');
        res.json(exerciseWithWorkout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete exercise
exports.deleteExercise = async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).json({ msg: 'Exercise not found' });
        }
        await exercise.deleteOne();
        res.json({ msg: 'Exercise removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

