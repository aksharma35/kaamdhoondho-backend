process.env.NODE_ENV = 'test';

const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/db');

after(() => prisma.$disconnect());

test('GET /api/v1/health returns health status', async () => {
  const res = await request(app).get('/api/v1/health');
  assert.ok([200, 503].includes(res.status));
  assert.ok(['ok', 'degraded'].includes(res.body.data.status));
  assert.ok(res.body.data.services.database);
});

test('unknown route returns 404 in standard error shape', async () => {
  const res = await request(app).get('/api/v1/does-not-exist');
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /Route not found/);
});

test('malformed JSON returns 400', async () => {
  const res = await request(app)
    .post('/api/v1/health')
    .set('Content-Type', 'application/json')
    .send('{"bad json"');
  assert.equal(res.status, 400);
  assert.equal(res.body.message, 'Malformed JSON in request body');
});
