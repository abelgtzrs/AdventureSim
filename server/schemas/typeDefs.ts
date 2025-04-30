const typeDefs = `
  type AdventureSession {
    id: ID!
    title: String!
    content: JSON!
    author: String!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }
   type Query {
    getAdventureSession(id: ID!): AdventureSession
    example: String
    stories: [AdventureSession] # Add the missing "stories" field
    story(id: ID!): AdventureSession # Add the "story" field if needed
    user(id: ID!): User
  }
  type Mutation {
    updateData(input: JSON!): JSON # Add the missing "updateData" mutation
    createStory(title: String!, content: String!, author: String!): AdventureSession # Add this mutation
    createAdventureSession(title: String!, description: String!, content: JSON!): AdventureSession
    registerUser(username: String!, email: String!, password: String!): User
    loginUser(email: String!, password: String!): User
  }
  scalar JSON
`;

export default typeDefs;
