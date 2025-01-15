const express = require('express');
const router = express.Router();

// Route to handle quiz chat room functionality
router.post('/quiz', async (req, res) => {
    const { question, answer } = req.body;

    // Input validation
    if (!question || !answer) {
        return res.status(400).json({ error: 'Question and answer are required' });
    }

    try {
        // Simulate quiz processing (Replace with actual quiz logic)
        return res.status(200).json({ message: 'Quiz processed successfully' });
    } catch (error) {
        console.error('Error processing quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; // Ensure this exports the router instance
