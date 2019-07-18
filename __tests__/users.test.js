import request from 'supertest';
import { db, Users } from "../models";
import app from '../app';


describe("User Model Tests", () => {
  afterAll(async () => {
    await db.query('delete from users where email="test1@test.com"').catch(err => { throw err});
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
    const { user_id } = await Users.getUserByEmail('test1@test.com');
    const res = await Users.getUserById(user_id);

    expect(res).not.toBe(undefined);
    expect(res.email).toBe('test1@test.com');
    expect(res.password).toBe('1234');
  });

  test("deleteUserById should remove a record", async () => {
    const { user_id } = await Users.getUserByEmail('test1@test.com');
    await Users.deleteUserById(user_id);

    const res = await Users.getAllUsers();

    expect(res.length).toEqual(1);
  });
});

describe("User Routes Tests", () => {
  afterAll(async () => {
    await db.query('delete from users where email="test@test.com"').catch(err => { throw err});
  });
  
  test("POST /users", async () => {
    const response = await request(app)
      .post('/api/users')
      .send({email: 'test@test.com', password: '1234'});

    expect(response.status).toEqual(200);
  })

  test("GET /users", async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toEqual(200);
  })

  test("GET /users/:id", async () => {
    const {user_id} = await Users.getUserByEmail('test@test.com');
    const response = await request(app).get(`/api/users/${user_id}`);

    expect(response.status).toEqual(200);
    expect(response.body.email).toEqual('test@test.com');

    const errResponse = await request(app).get('/api/users/123');
    expect(errResponse.status).toEqual(500);
  });

  test("POST /users/:id", async () => {
    const { user_id } = await Users.getUserByEmail('test@test.com');
    const response = await request(app).post(`/api/users/${user_id}`);

    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual(`User ${user_id} deleted`);

    const errResponse = await request(app).post('/api/users/123');
    expect(errResponse.status).toEqual(500);
  });
});
