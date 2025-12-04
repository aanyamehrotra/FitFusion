const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        

        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Please provide all required fields (name, email, password)' });
        }
 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: 'Please provide a valid email address' });
        }


        if (password.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
        }


        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured in environment variables');
            return res.status(500).json({ msg: 'Server configuration error. Please contact administrator.' });
        }

        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password: hashedPassword,
            role: role || 'client'
        });
        
        await user.save();
        console.log(`✅ User registered successfully: ${user.email}`);

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                console.error('JWT Error:', err);
                return res.status(500).json({ msg: 'Error generating authentication token' });
            }
            res.json({ 
                token, 
                user: { 
                    id: user._id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role 
                } 
            });
        });
    } catch (err) {
        console.error('Register Error:', err);

        if (err.code === 11000) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ msg: errors.join(', ') });
        }
        
        res.status(500).json({ msg: 'Registration failed. Please try again.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please provide both email and password' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured in environment variables');
            return res.status(500).json({ msg: 'Server configuration error. Please contact administrator.' });
        }
        
        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        console.log(`✅ User logged in successfully: ${user.email}`);

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
            if (err) {
                console.error('JWT Error:', err);
                return res.status(500).json({ msg: 'Error generating authentication token' });
            }
            res.json({ 
                token, 
                user: { 
                    id: user._id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role 
                } 
            });
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ msg: 'Login failed. Please try again.' });
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
