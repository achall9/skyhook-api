import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import passport from '../middleware/passport';

const router = new Router();

dotenv.config();

router.post('/login', async (req, res) => {
  passport.authenticate('login', {session: false}, (err, user) => {
    if(err || !user) {
      return res.status(400).send({
        message: 'Something sploded',
        user
      });
    }

    req.login(user, {session: false}, (err) => {
      if(err) res.send(err);

      const { user_id: id, email, created_on: createdOn } = user || {};
      const userToken =  {
        id,
        email,
        createdOn
      };

      const token = jwt.sign(userToken, process.env.JWT_SECRET);
      return res.json({user: userToken, token});
    });
  })(req, res);
});

router.get('/setup2fa', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.send({message: 'authenticated route'});
})

export default router;
