import { Router } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import auth from '../middleware/auth';
import { Users } from '../models';

dotenv.config();

const router = new Router();

router.post('/login', async (req, res) => {
  const { body } = req;
  const { email, password } = body || {};
  try {
    const user = await Users.getUserByEmail(email);

    if(!user) return res.sendStatus(501);
    const match = await bcrypt.compareSync(password, user.password);

    if(!match) return res.sendStatus(501);

    const token = await auth.generateToken(user);

    return res.json({token});
  }catch (error) {
    return res.sendStatus(500).json(error);
  }
});

router.post('/register', async (req, res) => {
  const { body } = req;
  const { email, password } = body || {};

  await bcrypt.hash(password, 10, async (err, hash) => {
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

router.get('/test', auth.isAuthenticated, async(req, res) => {
  res.status(200).send({ message: 'protected route' });
});

export default router;
