const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};


// Register User
exports.registerUser = async (req, res) => {
    const { username, password, role } = req.body;


    try {
        const userExists = await User.findOne({ username });


        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const user = await User.create({ username, password, role });
       


        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error',error });
    }
};


// Login User
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;


    try {
        const user = await User.findOne({ username });


        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Get User Profile (Protected Route)
exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);


    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
