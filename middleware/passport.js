import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import  { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import { Users } from '../models';

dotenv.config();

passport.use('login', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
  const user = await Users.getUserByEmail(email)
    .catch(err => {throw err});

  if(!user) return done(null, false);

  const match = await bcrypt.compare(password, user.password).catch(err => {throw err;});

  if(!match) return done(null, false);

  return done(null, user);
}));

passport.use('jwt', new JWTStrategy({ 
  secretOrKey: process.env.JWT_SECRET,  
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT')},
  async (token, done) => {
    try {
      const user = await Users.getUserByEmail(token.email);

      if(!user) return done(null, false);

      return done(null, {id: user.user_id, email: user.email, createdOn: user.createdOn});
    } catch( error ) {
      return done(error);
    }
  })
);

passport.serializeUser((user, cb) => { cb(null, user); });
passport.deserializeUser((obj, cb) => { cb(null, obj); });

export default passport;
