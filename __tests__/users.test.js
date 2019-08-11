import { db, Users } from "../models";

describe("User Model Tests", () => {
  afterAll(async () => {
    await db.query('delete from users');
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
    const {user_id}= await Users.getUserByEmail('test1@test.com');

    await Users.deleteUserById(user_id);

    const res = await Users.getAllUsers();

    expect(res.length).toEqual(0);
  });
});

