const User = require('../models/User');
const path = require('path');
const fs = require('fs');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updateData = req.body;
        delete updateData.password; // Don't allow password update through this route
        delete updateData.email; // Don't allow email update through this route
        delete updateData.role; // Don't allow role update through this route

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Delete old profile picture if exists
        if (user.profilePicture && user.profilePicture !== '') {
            const oldFilePath = path.join(__dirname, '../../uploads', path.basename(user.profilePicture));
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        // Update user with new profile picture path
        user.profilePicture = `/uploads/${req.file.filename}`;
        await user.save();

        res.json({ 
            profilePicture: user.profilePicture,
            message: 'Profile picture updated successfully'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getTrainers = async (req, res) => {
    try {
        const trainers = await User.find({ 
            role: 'trainer',
            isProfilePublic: true
        }).select('-password').sort({ 'trainerInfo.experience': -1 });

        res.json(trainers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getTrainerProfile = async (req, res) => {
    try {
        const trainer = await User.findOne({ 
            _id: req.params.id,
            role: 'trainer'
        }).select('-password');

        if (!trainer) {
            return res.status(404).json({ msg: 'Trainer not found' });
        }

        if (!trainer.isProfilePublic && trainer._id.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Profile is private' });
        }

        res.json(trainer);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

