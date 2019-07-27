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
  
    if(!user) return res.status(401).send("Invalid Credentials");

    const match = await bcrypt.compare(password, user.password);
    
    if(!match) return res.status(401).send("Invalid Credentials");

    const token = await auth.generateToken(email);

    return res.status(200).send({token});

  } catch(err) {
    throw err;
  }
});

router.get('/test', auth.isAuthenticated, async(req, res) => {
  res.send({ message: 'protected route' });
});

export default router;
