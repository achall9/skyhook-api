import request from 'supertest';
import { db } from '../models';
import app from '../app';

describe('Auth Endpoints', () => {
  test('local login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({email: 'authTest@test.com', password: '1234'});

    expect(response.status).toEqual(200);
  });
});
