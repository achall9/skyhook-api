import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    user(id: Int!): User
    users: [User]
  }

  type Mutation {
    login(email: String!, password: String!):String
  }
`;

