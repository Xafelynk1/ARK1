const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const ebookRouter = require('../server/routes/ebooks');

const app = express();
app.use(bodyParser.json());
app.use('/api', ebookRouter);

describe('Ebook Upload', () => {
    it('should upload an ebook successfully', async () => {
        const response = await request(app)
            .post('/api/upload')
            .send({
                title: 'Sample Ebook',
                author: 'John Doe',
                description: 'A sample ebook for testing.',
                fileUrl: 'http://example.com/sample-ebook.pdf'
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Ebook uploaded successfully');
    });

    it('should return an error for missing fields', async () => {
        const response = await request(app)
            .post('/api/upload')
            .send({
                title: 'Sample Ebook',
                // Missing author, description, and fileUrl
            });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('All fields are required');
    });
});
