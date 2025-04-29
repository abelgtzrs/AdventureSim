import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar JSON

  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Entry {
    prompt: String!
    response: String!
    timestamp: String!
  }

  type AdventureSession {
    id: ID!
    title: String!
    category: String!
    entries: [Entry!]!
    length: Int!
    isActive: Boolean!
    createdAt: String!
    author: User!
  }

  type Query {
    getAdventureSession(id: ID!): AdventureSession
    getMyAdventureSessions: [AdventureSession]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    startAdventure(title: String!, category: String!): AdventureSession
    continueAdventure(sessionId: ID!, input: String!): AdventureSession
    endAdventure(sessionId: ID!): AdventureSession
  }
`;

export default typeDefs;
