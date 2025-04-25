const { gql } = require('apollo-server-express');
const typeDefs = gql`
  type AdventureSession {
    id: ID!
    title: String!
    description: String!
    content: JSON!
    author: User!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }
  type Query {
    getStories: [AdventureSession]
    getAdventureSession(id: ID!): AdventureSession
  }
  type Mutation {
    createAdventureSession(title: String!, description: String!, content: JSON!): AdventureSession
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
  }
`;
module.exports = typeDefs;
