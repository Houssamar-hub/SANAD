const request = require('supertest');
const app = require('../src/server');

jest.setTimeout(30000);

describe('SANAD Backend API Test Suite', () => {
  it('GET /api/health should return 200 with online status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('online');
    expect(res.body.app).toEqual('SANAD API');
  });

  it('GET /api/legal/categories should return all legal categories', async () => {
    const res = await request(app).get('/api/legal/categories');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(5);
  });

  it('GET /api/legal should return verified Moroccan legal documents', async () => {
    const res = await request(app).get('/api/legal');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.documents.length).toBeGreaterThan(0);
    // Should contain Loi 103-13
    const hasLoi103 = res.body.documents.some(d => d.lawNumber && d.lawNumber.includes('103-13'));
    expect(hasLoi103).toBe(true);
  });

  it('GET /api/centers should return verified support centers in Morocco', async () => {
    const res = await request(app).get('/api/centers');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.centers.length).toBeGreaterThan(0);
    expect(res.body.cities).toContain('Casablanca');
    expect(res.body.cities).toContain('Rabat');
  });

  it('GET /api/quizzes should return educational quizzes', async () => {
    const res = await request(app).get('/api/quizzes');
    expect(res.statusCode).toEqual(200);
    expect(res.body.quizzes.length).toBeGreaterThan(0);
  });

  it('POST /api/ai/chat should detect emergency and return emergency numbers', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: 'Au secours ! Danger immédiat il me bat !' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.isEmergency).toBe(true);
    expect(res.body.emergencyHotlines.police).toBe('19');
    expect(res.body.emergencyHotlines.gendarmerie).toBe('177');
  });

  it('POST /api/ai/chat should handle Moroccan Darija / Arabizi question', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: 'Chno ndir ila chi wahed kayhaddedni b tsawer dyali ?' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.detectedLanguage).toBe('darija_arabizi');
    expect(res.body.answer).toBeDefined();
  });
});
