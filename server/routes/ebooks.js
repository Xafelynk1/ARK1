const express = require('express');
const Ebook = require('../models/Ebook');
const router = express.Router();

// Route to upload an ebook
router.post('/upload', async (req, res) => {
    const { title, author, description, fileUrl } = req.body;

    // Input validation
    if (!title || !author || !description || !fileUrl) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const ebook = new Ebook(title, author, description, fileUrl);
        await ebook.upload();
        res.status(201).json({ message: 'Ebook uploaded successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
