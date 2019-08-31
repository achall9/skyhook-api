import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import dotenv from 'dotenv';
import {ApolloServer, AuthenticationError} from 'apollo-server-express';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

dotenv.config();

const app = express();

const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false
});

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(auth);

const server = new ApolloServer({
  typeDefs, 
  resolvers,
  context: ({req}) => {
    const authToken = null;
  }
});
server.applyMiddleware({ app, path:'/api' });

export default app;
