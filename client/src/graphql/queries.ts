// src/graphql/queries.ts
import { gql } from "@apollo/client";

export const GET_MY_ADVENTURE_SESSIONS = gql`
  query {
    getMyAdventureSessions {
      id
      title
      category
      isActive
      createdAt
    }
  }
`;

export const GET_ADVENTURE_SESSION = gql`
  query GetAdventureSession($id: ID!) {
    getAdventureSession(id: $id) {
      title
      category
      isActive
      entries {
        prompt
        response
        chaosScore
        timestamp
      }
    }
  }
`;
