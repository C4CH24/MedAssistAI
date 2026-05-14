const request = require('supertest');
const app = require('./server');

describe('Fadhili AI Service', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toContain('Fadhili AI is running');
  });

  it('should require API key for /process', async () => {
    const response = await request(app)
      .post('/process')
      .send({ query: 'test' });
    expect(response.status).toBe(401);
  });

  it('should process query with valid API key', async () => {
    const response = await request(app)
      .post('/process')
      .set('x-api-key', process.env.FADHILI_API_KEY || 'test_key')
      .send({
        query: 'What are side effects of paracetamol?',
        context: { language: 'en' }
      });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});