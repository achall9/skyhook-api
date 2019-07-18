import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import { Users } from '../models';

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
  const user = await Users.getUserByEmail(email)
    .catch(err => {throw err});
  
    if(!user) return done(null, false);
  
    const match = await bcrypt.compare(password, user.password).catch(err => {throw err;});
  
    if(!match) return done(null, false);
  
    return done(null, user);
}));

passport.serializeUser((user, cb) => { cb(null, user); });
passport.deserializeUser((obj, cb) => { cb(null, obj); });

export default passport;
