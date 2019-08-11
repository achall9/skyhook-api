import { Router } from 'express'; 

import { Users } from '../models';
import auth from '../middleware/auth';

const router = Router();


router.get('/', auth.isAuthenticated, async (req, res) => {
  const users = await Users.getAllUsers()

  res.status(200).send(users);
});

router.get('/:id', auth.isAuthenticated, async (req, res) => {
  const { params } = req;
  const { id } = params || {};

  const user = await Users.getUserById(id)

  if(!user){
    res.status(500).send({message: "User not found"});
  }

  res.status(200).send(user);
});

router.delete('/:id', async (req, res) => {
  const { params } = req;
  const { id } = params || {};

  if(id) {
    await Users.deleteUserById(id);

    res.status(200).send({message: `User ${id} deleted`});
  } else {
    res.status(500).send({message: "User not found"});
  }
});

export default router;
