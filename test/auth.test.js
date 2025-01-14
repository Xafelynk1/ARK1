const request = require('supertest');
const app = require('../server'); // Assuming the server is exported from the main server file

describe('User Authentication', () => {
    it('should register a user successfully', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should log in a user successfully', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User logged in successfully');
    });
});
