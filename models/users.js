import db from "./db";

const getAllUsers = async () => {
  const results = await db.query("SELECT * FROM USERS")
    .then(result => result.rows)

  return results;
};

const getUserByEmail = async (email) => {
  const results = await db.query("SELECT * FROM USERS WHERE email=$1", [email])
    .then(result => result.rows[0])

  return results;
}

const getUserById = async (id) => {
  const results = await db.query("SELECT * FROM USERS WHERE user_id=$1", [id])
    .then(result => result.rows[0])

  return results;
};


const deleteUserById = async (id) => {
  await db.query("DELETE FROM USERS WHERE user_id = $1 RETURNING *", [id]).catch(err => { throw err });

  return { data: `User ${id} deleted` }
};

const createUser = async (user) => {
  const { email, password } = user;

  const date = await db.query('SELECT NOW()').then(res => res.rows[0]);
  const results = await db.query(`INSERT INTO USERS(email, password, created_on) VALUES($1, $2, $3) RETURNING user_id`, 
    [email, password, date.now])
    .then(res => res.rows[0])

  return results;
};

export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  deleteUserById,
  createUser
};
