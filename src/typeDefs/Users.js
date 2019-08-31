import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    user_id: Int!,
    email: String!
    password: String!,
  }
`

export default typeDefs;
