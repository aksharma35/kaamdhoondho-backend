const { test } = require('node:test');
const assert = require('node:assert/strict');
const { z } = require('zod');
const validate = require('../../src/middlewares/validate.middleware');

const schema = z.object({ title: z.string().min(3), salary: z.coerce.number() });

test('passes and replaces body with parsed data', () => {
  const req = { body: { title: 'Plumber', salary: '500', extra: 'x' } };
  let error;
  validate({ body: schema })(req, {}, (err) => (error = err));
  assert.equal(error, undefined);
  assert.deepEqual(req.body, { title: 'Plumber', salary: 500 });
});

test('returns 422 ApiError with field details on failure', () => {
  const req = { body: { title: 'ab' } };
  let error;
  validate({ body: schema })(req, {}, (err) => (error = err));
  assert.equal(error.statusCode, 422);
  assert.equal(error.details.length, 2);
  assert.equal(error.details[0].location, 'body');
});
