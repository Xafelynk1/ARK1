const express = require('express');
const User = require('../models/User');
const router = express.Router();

// User registration route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const user = new User(email, password);
    try {
        const userRecord = await user.register();
        res.status(201).json({ message: 'User registered successfully', user: userRecord });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// User login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = new User(email, password);
    try {
        const userRecord = await user.login();
        res.status(200).json({ message: 'User logged in successfully', user: userRecord });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
