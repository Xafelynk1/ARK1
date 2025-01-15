const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('../server/routes/auth');

const app = express();
app.use(bodyParser.json());
app.use('/api', authRouter);

describe('User Registration', () => {
    it('should register a user successfully', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({
                username: 'johndoe3', // Use a different username
                password: 'jojn112',
                surname: 'Doe',
                email: 'johndoe@gmail.com',
                dob: '1990-01-01',
                confirm_password: 'jojn112'
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    it('should return an error for missing fields', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({
                username: 'johndoe1',
                email: 'john.doe@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('All fields are required');
    });

    // Additional tests can be added here
});
