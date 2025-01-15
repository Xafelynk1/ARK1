const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('../server/routes/auth');
const mockPool = require('../mock-db'); // Import the mock database

const app = express();
app.use(bodyParser.json());
app.use('/api', authRouter);

// Clear the mock database before each test
beforeEach(() => {
    mockPool.query = async (query, values) => {
        if (query.startsWith('INSERT INTO users')) {
            const newUser = {
                id: mockAdmins.length + 1,
                username: values[0],
                password: values[1],
                surname: values[2],
                email: values[3],
                dob: values[4],
            };
            mockAdmins.push(newUser);
            return { rows: [newUser] };
        }
        if (query.startsWith('SELECT * FROM users')) {
            return { rows: mockAdmins.filter(user => user.username === values[0]) };
        }
        throw new Error('Query not recognized');
    };
});

describe('User Registration', () => {
    it('should register a user successfully', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({
                username: 'newuser_' + Date.now(), // Ensure unique username
                password: 'Password123!',
                surname: 'Doe',
                email: 'newuser@example.com',
                dob: '1990-01-01'
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    it('should return an error for missing fields', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({
                username: 'uniqueuser2',
                // Missing password
                surname: 'Doe',
                email: 'uniqueuser2@example.com',
                dob: '1990-01-01'
            });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('All fields are required');
    });

    it('should return an error for duplicate usernames', async () => {
        // First registration
        await request(app)
            .post('/api/register')
            .send({
                username: 'duplicateuser', // Use a fixed username for testing
                password: 'Password123!',
                surname: 'Doe',
                email: 'duplicateuser@example.com',
                dob: '1990-01-01'
            });

        // Attempt to register again with the same username
        const response = await request(app)
            .post('/api/register')
            .send({
                username: 'duplicateuser', // Use the same username
                password: 'Password123!',
                surname: 'Doe',
                email: 'duplicateuser@example.com',
                dob: '1990-01-01'
            });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Username already exists.');
    });
});

afterAll(async () => {
    await mockPool.end(); // Close the mock database connection after all tests
});
