const express = require('express');
const NeDB = require('nedb');
const User = require('../models/User');
const router = express.Router();

// Initialize NeDB
const db = new NeDB({ filename: 'server/database/users.db', autoload: true });

// User registration route
router.post('/register', (req, res) => {
    const { surname, firstname, dob, email, phone, password } = req.body;
    const user = new User(surname, firstname, dob, email, phone, password);

    // Save user to the database
    db.insert(user, (err, newUser) => {
        if (err) {
            return res.status(400).json({ error: 'Error registering user' });
        }
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    });
});

// User login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find user in the database
    db.findOne({ email, password }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'User logged in successfully', user });
    });
});

module.exports = router;
