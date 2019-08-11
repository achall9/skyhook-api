import request from 'supertest';
import { db } from '../models';
import app from '../app';

describe('Auth Endpoints', () => {
  afterAll(async () => {
    await db.query("delete from users");
  });

  test('should create a user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({email: 'authTest@test.com', password: '1234'});

    expect(response.status).toEqual(200);
  });

  test('login should be successful', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({email: 'authTest@test.com', password: '1234'});

    expect(response.status).toEqual(200);
  });

  test('login should fail with wrong email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({email: 'totally@wrong.com', password: '1234'});

    expect(response.status).toEqual(501);
  });

  test('login should fail with wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({email: 'authTest@test.com', password: 'abcdef'});

    expect(response.status).toEqual(501);
  });

  test('successful login should return a JWT', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({email: 'authTest@test.com', password: '1234'});

    const { body } = response;
    const { token } = body;

    expect(body).toBeDefined();
    expect(token).toBeDefined();
  });

  test('protected route should 404 without token', async () => {
    const response = await request(app)
      .get('/api/auth/test');

    expect(response.status).toEqual(401);
  });

  test('protected route should 400 with invalid token', async () => {
    const response = await request(app)
      .get('/api/auth/test')
      .set('Authorization', '1234');

    expect(response.status).toEqual(400);
  });

  test('protected route should return 200 with token', async () => {
    const user = await request(app)
      .post('/api/auth/login')
      .send({email: 'authTest@test.com', password: '1234'});

    const { body } = user;
    const { token } = body;

    const response = await request(app)
      .get('/api/auth/test')
      .set('Authorization', token);

    expect(response.status).toEqual(200);
  });
});
