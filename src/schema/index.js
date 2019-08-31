import { makeExecutableSchema } from 'graphql-tools';

const resolvers = {};

const typeDefs = `
  type User {
    id: Int!,
    email: String!
  }

  type Query {
    me: User
  }

  type Mutation {
   signup: (email: String!, password: String!): String
   login: (email: String!, password: String!): String
  }
`

export default makeExecutableSchema({typeDefs, resolvers});
