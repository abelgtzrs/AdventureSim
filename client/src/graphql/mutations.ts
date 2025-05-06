// src/graphql/mutations.ts
import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

export const REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

export const START_ADVENTURE = gql`
  mutation startAdventure($title: String!, $category: String!) {
    startAdventure(title: $title, category: $category) {
      id
    }
  }
`;

export const CONTINUE_ADVENTURE = gql`
  mutation ContinueAdventure($sessionId: ID!, $input: String!) {
    continueAdventure(sessionId: $sessionId, input: $input) {
      id
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

export const END_ADVENTURE = gql`
  mutation EndAdventure($sessionId: ID!) {
    endAdventure(sessionId: $sessionId) {
      id
      isActive
      entries {
        response
        timestamp
      }
    }
  }
`;

export const DELETE_ADVENTURE = gql`
  mutation deleteAdventure($sessionId: ID!) {
    deleteAdventure(sessionId: $sessionId)
  }
`;
