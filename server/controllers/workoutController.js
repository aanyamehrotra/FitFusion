const Workout = require('../models/Workout');

exports.createWorkout = async (req, res) => {
    try {
        const newWorkout = new Workout({
            ...req.body,
            user: req.user.id
        });
        const workout = await newWorkout.save();
        res.json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getWorkouts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '-date', search } = req.query;
        const query = { user: req.user.id };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const workouts = await Workout.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Workout.countDocuments(query);

        res.json({
            workouts,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) return res.status(404).json({ msg: 'Workout not found' });
        if (workout.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        res.json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateWorkout = async (req, res) => {
    try {
        let workout = await Workout.findById(req.params.id);
        if (!workout) return res.status(404).json({ msg: 'Workout not found' });
        if (workout.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        workout = await Workout.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) return res.status(404).json({ msg: 'Workout not found' });
        if (workout.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await workout.deleteOne();
        res.json({ msg: 'Workout removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
