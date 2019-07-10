import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import db from '../models';

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password) => {

}));
