import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar JSON

  type Entry {
    prompt: String!
    response: String!
    chaosScore: Int
    timestamp: String!
  }

  type AdventureSession {
    id: ID!
    title: String!
    category: String!
    isActive: Boolean!
    entries: [Entry!]!
    createdAt: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type DeleteResponse {
    success: Boolean!
  }

  type Query {
    getMyAdventureSessions: [AdventureSession!]!
    getAdventureSession(id: ID!): AdventureSession
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    startAdventure(title: String!, category: String!): AdventureSession
    continueAdventure(sessionId: ID!, input: String!): AdventureSession
    endAdventure(sessionId: ID!): AdventureSession
    deleteAdventure(sessionId: ID!): DeleteResponse
  }
`;

export default typeDefs;
