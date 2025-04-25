import User from "../models/User";
import AdventureSession from "../models/AdventureSession";

const resolvers = {
  Query: {
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
    // Create a new story
    createStory: async (
      _: any,
      { title, content, author }: { title: string; content: string; author: string }
    ) => {
      const newStory = new AdventureSession({ title, content, author });
      return await newStory.save();
    },
    // Register a new user
    registerUser: async (
      _: any,
      { username, email, password }: { username: string; email: string; password: string }
    ) => {
      const newUser = new User({ username, email, password });
      return await newUser.save();
    },
    // Login a user
    loginUser: async (_: any, { email, password }: { email: string; password: string }) => {
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