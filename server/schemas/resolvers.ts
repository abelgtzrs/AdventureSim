import User from "../models/User";
import AdventureSession from "../models/AdventureSession";
import { GraphQLScalarType, Kind } from "graphql";
import { signToken } from "../utils/auth";
import { sign } from "crypto";
//import { createAdventureSession } from "../controller/AdventureSessionsController";

const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  description: "Custom scalar type for JSON data",
  parseValue(value) {
    // Called when the client sends JSON data
    return value;
  },
  serialize(value) {
    // Called when sending JSON data to the client
    return value;
  },
  parseLiteral(ast) {
    // Called when parsing JSON data in the query
    if (ast.kind === Kind.OBJECT) {
      const value: Record<string, any> = {};
      ast.fields.forEach((field) => {
        value[field.name.value] =
          field.value.kind === Kind.STRING ? field.value.value : null;
      });
      return value;
    }
    return null;
  },
});

const resolvers = {
  JSON: JSONScalar, // Add the custom JSON scalar resolver
  Query: {
    getAdventureSession: async (_: any, { id }: { id: string }) => {
      // Logic to fetch an AdventureSession by ID
    },
    example: () => {
      return { key: "value" }; // Example JSON response
    },

    // Fetch all stories
    stories: async () => {
      return await AdventureSession.find();
    },
    // Fetch a single story by ID
    story: async (_: any, { id }: { id: string }) => {
      return await AdventureSession.findById(id);
    },
    // Fetch a user by ID
    user: async (_: any, { id }: { id: string }) => {
      return await User.findById(id);
    },
  },
  Mutation: {
    updateData: (_: any, { input }: { input: any }) => {
      return input; // Echo the input JSON
    },
    // Create a new story
    createStory: async (
      _: any,
      {
        title,
        content,
        author,
      }: { title: string; content: string; author: string }
    ) => {
      console.log(`${title} ${content} ${author}`);
      const newStory = new AdventureSession({ title, content, author });
      newStory.save();
      console.log(`${newStory}`);
      return {
        id: newStory._id,
        title: newStory.title,
        content: content,
        author: author,
      };
    },

    // Register a new user
    registerUser: async (
      _: any,
      {
        username,
        email,
        password,
      }: { username: string; email: string; password: string }
    ) => {
      const newUser = new User({ username, email, password });
      await newUser.save();
      const token = signToken(username, email, newUser._id);
      return {
        id: newUser._id,
        username: username,
        email: email,
        token: token,
      };
    },
    // Login a user
    loginUser: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }
      return user; // You can return a token here if needed
    },
  },
};

export default resolvers;
