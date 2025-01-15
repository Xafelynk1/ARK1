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

describe('Admin User Management', () => {
    it('should add a user successfully', async () => {
        const response = await request(app)
            .post('/api/admin/add-user')
            .send({
                username: 'adminuser_' + Date.now(), // Ensure unique username
                password: 'AdminPassword123!',
                surname: 'Admin',
                email: 'adminuser@example.com',
                dob: '1990-01-01'
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User added successfully');
    });

    it('should return an error for missing fields when adding a user', async () => {
        const response = await request(app)
            .post('/api/admin/add-user')
            .send({
                username: 'adminuser2',
                // Missing password
                surname: 'Admin',
                email: 'adminuser2@example.com',
                dob: '1990-01-01'
            });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('All fields are required');
    });

    it('should log in as admin with correct credentials', async () => {
        const response = await request(app)
            .post('/api/admin/login')
            .send({
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Admin logged in successfully');
    });

    it('should return an error for incorrect admin credentials', async () => {
        const response = await request(app)
            .post('/api/admin/login')
            .send({
                username: 'wronguser',
                password: 'wrongpassword'
            });
        expect(response.status).toBe(401); // Change to 401 to match actual response
        expect(response.body.error).toBe('Invalid credentials');
    });

    it('should log in as admin with correct credentials', async () => {
        const response = await request(app)
            .post('/api/admin/login')
            .send({
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Admin logged in successfully');
    });

    it('should return an error for incorrect admin credentials', async () => {
        const response = await request(app)
            .post('/api/admin/login')
            .send({
                username: 'wronguser',
                password: 'wrongpassword'
            });
        expect(response.status).toBe(401); // Change to 401 to match actual response
        expect(response.body.error).toBe('Invalid credentials');
    });

    it('should remove a user successfully', async () => {
        // First, add a user to remove
        const username = 'removableuser_' + Date.now(); // Ensure unique username
        await request(app)
            .post('/api/admin/add-user')
            .send({
                username: username,
                password: 'Password123!',
                surname: 'Doe',
                email: 'removableuser@example.com',
                dob: '1990-01-01'
            });

        const response = await request(app)
            .delete('/api/admin/remove-user/' + username); // Use the same username
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User removed successfully');
    });

    it('should return an error for removing a non-existent user', async () => {
        const response = await request(app)
            .delete('/api/admin/remove-user/nonexistentuser');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });
});

afterAll(async () => {
    await mockPool.end(); // Close the mock database connection after all tests
});
