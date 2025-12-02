const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }
        
        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ 
            name, 
            email: email.toLowerCase().trim(), 
            password: hashedPassword,
            role: role || 'client'
        });
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                console.error('JWT Error:', err);
                return res.status(500).json({ msg: 'Error generating token' });
            }
            res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error('Register Error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please provide email and password' });
        }
        
        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                console.error('JWT Error:', err);
                return res.status(500).json({ msg: 'Error generating token' });
            }
            res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
