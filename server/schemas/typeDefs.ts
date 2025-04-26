import { gql } from "apollo-server-express";

const typeDefs = gql`
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
    createdAt: String!
    isActive: Boolean!
    author: User!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }

  type Query {
    getAdventureSession(id: ID!): AdventureSession
    getMyAdventureSessions: [AdventureSession]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    startAdventure(title: String!, category: String!): AdventureSession
    continueAdventure(sessionId: ID!, input: String!): AdventureSession
    endAdventure(sessionId: ID!): AdventureSession
  }
`;

export default typeDefs;
