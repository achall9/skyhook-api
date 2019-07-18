import { Router } from 'express';
import jwt from 'jsonwebtoken';

import passport from '../middleware/passport';

const router = new Router();

router.post('/login', async (req, res) => {
  passport.authenticate('local', {session: false}, (err, user) => {
    if(err || !user) {
      return res.status(400).send({
        message: 'Something sploded',
        user
      });
    }

    req.login(user, {session: false}, (err) => {
      if(err) res.send(err);

      const token = jwt.sign(user, 'jwt_secret');
      return res.json({user, token});
    });
  })(req, res);
});

export default router;
