const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let quizzes = [];
let blogs = [];
let multimedia = [];

// Endpoint to submit a quiz
app.post('/submit-quiz', (req, res) => {
    const { question, answer, timer } = req.body;
    quizzes.push({ question, answer, timer });
    res.status(201).send('Quiz submitted successfully!');
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
