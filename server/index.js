const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let quizzes = [];
let blogs = [];
let multimedia = [];

const usersDB = require('./config/database');

// Endpoint to handle user signup
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    usersDB.insert({ username, password }, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error saving user.' });
        }
        res.status(201).json({ success: true, message: 'User registered successfully!' });
    });
});

// Endpoint to handle user signin
app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    usersDB.findOne({ username, password }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        res.status(200).json({ success: true, message: 'Signin successful!' });
    });
});

// Endpoint to submit a blog
app.post('/submit-blog', (req, res) => {
    const { title, content } = req.body;
    blogs.push({ title, content });
    res.status(201).send('Blog submitted successfully!');
});

// Endpoint to submit multimedia
app.post('/submit-multimedia', (req, res) => {
    const { title, price, files } = req.body;
    multimedia.push({ title, price, files });
    res.status(201).send('Multimedia submitted successfully!');
});

// Endpoint to get all submissions
app.get('/submissions', (req, res) => {
    res.json({ quizzes, blogs, multimedia });
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
