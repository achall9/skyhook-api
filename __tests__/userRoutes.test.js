import request from 'supertest';
import { db, Users } from "../models";
import app from '../app';

describe("User Routes Tests", () => {
  beforeAll(async () => {
    const user = await request(app).post('/api/auth/register').send({email: "test@test.com", password: "1234"});
  });

  afterAll(async () => {
    await db.query('delete from users');
  });

  test("GET /users", async () => {
    const { body } = await request(app)
      .post('/api/auth/login')
      .send({email: 'test@test.com', password: "1234"});

    const { token } = body;

    const response = await request(app).get('/api/users').set('Authorization', token);

    expect(response.status).toEqual(200);
  })

  test("GET /users/:id", async () => {
    const userToken = await request(app)
      .post('/api/auth/login')
      .send({email: 'test@test.com', password: "1234"});

    const { body } = userToken;
    const { token } = body;

    const {user_id} = await Users.getUserByEmail('test@test.com');

    const response = await request(app)
      .get(`/api/users/${user_id}`)
      .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.email).toEqual('test@test.com');

    const errResponse = await request(app)
      .get('/api/users/123')
      .set('Authorization', token);
    expect(errResponse.status).toEqual(500);
  });

  test("DELETE /users/:id", async () => {
    const userToken = await request(app)
      .post('/api/auth/login')
      .send({email: 'test@test.com', password: "1234"});

    const { body } = userToken;
    const { token } = body;

    const user = await Users.getUserByEmail('test@test.com');
    const { user_id } = user;
    const response = await request(app)
      .delete(`/api/users/${user_id}`)
      .set('Authorization', token).catch(err => console.error(err));

    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual(`User ${user_id} deleted`);

    const errResponse = await request(app)
      .post('/api/users/123')
      .set('Authorization', token);

    expect(errResponse.status).toEqual(404);
  });
});
