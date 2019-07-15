import request from 'supertest';
import { db, Users } from "../models";
import app from '../app';


describe("User Model Tests", () => {
  afterAll(async () => {
    await db.query('DELETE FROM USERS WHERE user_id < 10').catch(err => { throw err});
    await db.query('ALTER SEQUENCE users_user_id_seq RESTART').catch(err => { throw err});
    await db.query('UPDATE users SET user_id = DEFAULT').catch(err => { throw err});
  });

  test("createUser creates a new user option", async () => {
    const res = await Users.createUser({email: 'test1@test.com', password: '1234'});

    expect(res).toBeDefined(undefined);
    expect(typeof res).toBe('object');
    expect(res.user_id).toBeDefined();
    expect(res.password).toBeUndefined();
  });

  test("getAllUsers should return an array", async () => {
    const res = await Users.getAllUsers();

    expect(Array.isArray(res)).toBe(true);
  });

  test("getUserByEmail should return single instance", async () => {
    const res = await Users.getUserByEmail('test1@test.com');

    expect(res).toBeDefined();
    expect(res.email).toBe('test1@test.com');
    expect(res.password).toBe('1234');
  })

  test("getUserById should return a single element", async () => {
    const res = await Users.getUserById(1);

    expect(res).not.toBe(undefined);
    expect(res.email).toBe('test1@test.com');
    expect(res.password).toBe('1234');
  });

  test("deleteUserById should remove a record", async () => {
    await Users.deleteUserById(1);

    const res = await Users.getAllUsers();

    expect(res.length).toEqual(0);
  });
});

describe("User Routes Tests", () => {
  afterAll(async () => {
    await db.query('DELETE FROM USERS WHERE user_id < 10').catch(err => { throw err});
    await db.query('ALTER SEQUENCE users_user_id_seq RESTART').catch(err => { throw err});
    await db.query('UPDATE users SET user_id = DEFAULT').catch(err => { throw err});
  });
  
  test("POST /users", async () => {
    const response = await request(app)
      .post('/api/users')
      .send({email: 'test@test.com', password: '1234'});

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(1);
  })

  test("GET /users", async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(1);
  })

  test("GET /users/:id", async () => {
    const response = await request(app).get('/api/users/1');

    expect(response.status).toEqual(200);
    expect(response.body.user_id).toEqual(1);
    expect(response.body.email).toEqual('test@test.com');

    const errResponse = await request(app).get('/api/users/123');
    expect(errResponse.status).toEqual(500);
  });

  test("POST /users/:id", async () => {
    const response = await request(app).post('/api/users/1');

    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('User 1 deleted');

    const errResponse = await request(app).post('/api/users/123');
    expect(errResponse.status).toEqual(500);
  });
});
