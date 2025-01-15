const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const quizRouter = require('../server/routes/quiz');
const mockPool = require('../mock-db'); // Import the mock database

const app = express();
app.use(bodyParser.json());
app.use('/api', quizRouter);

describe('Quiz Processing', () => {
    it('should process quiz successfully', async () => {
        const response = await request(app)
            .post('/api/quiz')
            .send({
                question: 'What is the capital of France?',
                answer: 'Paris'
            });
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Quiz processed successfully');
    });

    it('should return an error for missing fields', async () => {
        const response = await request(app)
            .post('/api/quiz')
            .send({
                // Missing question and answer
            });
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Question and answer are required');
    });
});

afterAll(async () => {
    await mockPool.end(); // Close the mock database connection after all tests
});
