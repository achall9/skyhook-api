import db from "./db";

const createUser = (request, response) => {
  const { email, password } = request.body;

  db.query(
    "INSERT INTO users (email, password) VALUES ($1, $2)",
    [email, password],
    (err, result) => {
      if (err) {
        response.status(500);
      }

      response.status(200).send(`User added with ID: ${result.insertId}`);
    }
  );
};

const deleteUser = (request, response) => {
  const { params } = request || {};
  const { id } = params || {};

  db.query("DELETE FROM users WHERE id = $1", [id], err => {
    if (err) {
      response.status(500);
    }

    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

const getAllUsers = (request, response) => {
  db.query("SELECT * FROM user ORDER BY id ASC", (err, results) => {
    if (err) {
      response.status(500).json({rows: []});
    }

    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const { params } = request || {};
  const { id } = params || {};

  db.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
    if(err){
      response.status(500).json({});
    }

    response.status(200).json(results.rows);
  }
}

export default {
  createUser,
  deleteUser,
  getAllUsers
};
