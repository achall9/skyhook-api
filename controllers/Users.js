import { Router } from 'express'; 
import Bcrypt from 'bcrypt';

import { Users } from '../models';

const router = Router();

router.post('/', async (req, res) => {
  const { body } = req;
  const { email, password } = body || {};

  await Bcrypt.hash(password, 10, async (err, hash) => {
    if(err) {
      res.status(500).send(err);
      throw err;
    }

    const user = { email, password: hash };

    await Users.createUser(user).then(response => {
      const { user_id: userId } = response || {};

      res.status(200).send({id: userId});
    })
  })
});

router.get('/', async (req, res) => {
  const users = await Users.getAllUsers()
    .catch(err => {
      res.status(500).send(err);
      throw err;
    });

  res.status(200).send(users);
});

router.get('/:id', async (req, res) => {
  const { params } = req;
  const { id } = params || {};

  const user = await Users.getUserById(id)
    .catch(err => {
      throw err;
    });

  if(!user){
    res.status(500).send({message: "User not found"});
  }

  res.status(200).send(user);
});

router.post('/:id', async (req, res) => {
  const { params } = req;
  const { id } = params || {};

  const user = await Users.getUserById(id)
    .catch(err => {
      res.status(500).send({message: "User not found"});
      throw err;
    });

  if(user) {
    await Users.deleteUserById(id)
      .catch(err => { 
        throw err;
      });
    res.status(200).send({message: `User ${id} deleted`});
  } else {
    res.status(500).send({message: "User not found"});
  }
});

export default router;
