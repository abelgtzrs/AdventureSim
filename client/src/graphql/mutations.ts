import { gql } from "@apollo/client";

export const START_ADVENTURE = gql`
  mutation StartAdventure($title: String!, $category: String!) {
    startAdventure(title: $title, category: $category) {
      id
      title
      category
      isActive
      entries {
        prompt
        response
      }
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
