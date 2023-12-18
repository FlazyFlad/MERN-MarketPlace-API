// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middlewares/verifyToken.js');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { Username, Password, Repassword, Email } = req.body;

        console.log(req.body)

        const existingEmail = await User.findOne({ Email });
        if (existingEmail) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (Password !== Repassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (Username.length < 4) {
            return res.status(400).json({ message: 'Username should be at least 4 characters' });
        }

        if (Password.length < 8) {
            return res.status(400).json({ message: 'Password should be at least 8 characters' });
        }

        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(Password)) {
            return res.status(400).json({ message: 'Password must contain both letters and digits' });
        }

        const existingUser = await User.findOne({ Username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        const newUser = new User({
            Username,
            PasswordHash: hashedPassword,
            Email,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;

        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(401).json({ message: 'User with this email not found' });
        }

        const passwordMatch = await bcrypt.compare(Password, user.PasswordHash);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '2h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/profile', verifyToken, (req, res) => {
    res.json({ userId: req.userId, message: 'Profile accessed successfully' });
});

router.get('/user-info', verifyToken, async (req, res) => {
    try {
        // Retrieve user information from MongoDB using the userId
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user information
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;