import { gql } from "@apollo/client";

export const GET_ADVENTURE_SESSION = gql`
  query GetAdventureSession($id: ID!) {
    getAdventureSession(id: $id) {
      id
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
