const request = require('supertest');
const app = require('../src/index');

describe('API Endpoints', () => {
    it('GET /health should return ok', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });

    it('POST /chaos should return chaos_initiated', async () => {
        const res = await request(app).post('/chaos');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'chaos_initiated');
        expect(res.body).toHaveProperty('theme', 'back_to_the_future');
    });
});
