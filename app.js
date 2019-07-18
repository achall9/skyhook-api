import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import Routes from './controllers';
import passport from './middleware/passport';

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', Routes);

export default app;
