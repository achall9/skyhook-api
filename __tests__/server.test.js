import request from 'supertest';
import app from '../app';

test('GET method should respond with 200', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
});
