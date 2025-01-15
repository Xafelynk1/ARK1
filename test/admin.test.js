const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('../server/routes/auth');
const mockPool = require('../mock-db'); // Import the mock database

const app = express();
app.use(bodyParser.json());
app.use('/api', authRouter);

describe('Admin Login', () => {
    it('should log in an admin successfully', async () => {
        const response = await request(app)
            .post('/api/admin/login')
            .send({
                username: 'xafelynkark2', // Use the correct username
                password: 'Sam1$12580064' // Use the correct password
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Admin logged in successfully');
    });

    it('should return an error for invalid credentials', async () => {
        const response = await request(app)
            .post('/api/admin/login')
            .send({
                username: 'wrongUser',
                password: 'wrongPassword'
            });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid username or password');
    });

afterAll(async () => {
  await mockPool.end(); // Close the mock database connection after all tests
});

it('should return an error for missing fields', async () => {
        const response = await request(app)
            .post('/api/admin/login')
            .send({
                username: 'xafelynkark2',
                // Missing password
            });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing username or password');
    });
});
