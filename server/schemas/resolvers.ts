import User from "../models/User";
import AdventureSession from "../models/AdventureSession";
import { signToken } from "../utils/auth";

const resolvers = {
  Query: {
    // Fetch all adventure sessions for logged-in user
    getMyAdventureSessions: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      return await AdventureSession.find({ userId: context.user._id });
    },
    // Fetch a single adventure session
    getAdventureSession: async (
      _: any,
      { id }: { id: string },
      context: any
    ) => {
      if (!context.user) throw new Error("Not authenticated");
      return await AdventureSession.findById(id);
    },
  },
  Mutation: {
    // Register a new user
    register: async (
      _: any,
      {
        username,
        email,
        password,
      }: { username: string; email: string; password: string }
    ) => {
      const newUser = new User({ username, email, password });
      await newUser.save();
      const token = signToken(newUser);
      return { token, user: newUser };
    },

    // Login a user
    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");
      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = signToken(user);
      return { token, user };
    },

    // Start a new adventure
    startAdventure: async (
      _: any,
      { title, category }: { title: string; category: string },
      context: any
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const newAdventure = new AdventureSession({
        userId: context.user._id,
        title,
        category,
        entries: [],
        length: 0,
        isActive: true,
        createdAt: new Date(),
      });

      return await newAdventure.save();
    },

    // Continue an adventure (add an entry)
    continueAdventure: async (
      _: any,
      { sessionId, input }: { sessionId: string; input: string },
      context: any
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const adventure = await AdventureSession.findById(sessionId);
      if (!adventure) throw new Error("Adventure not found");

      if (!adventure.isActive) throw new Error("Adventure already ended");
      if (adventure.length >= 20) {
        adventure.isActive = false;
        await adventure.save();
        throw new Error("Adventure reached maximum length");
      }

      // Here you would normally call OpenAI to generate the next AI response
      const aiResponse = `Fake AI Response to: ${input}`; // Placeholder

      adventure.entries.push({
        prompt: input,
        response: aiResponse,
        timestamp: new Date(),
      });

      adventure.length += 1;

      if (adventure.length >= 20) {
        adventure.isActive = false;
      }

      return await adventure.save();
    },

    // End adventure manually
    endAdventure: async (
      _: any,
      { sessionId }: { sessionId: string },
      context: any
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const adventure = await AdventureSession.findById(sessionId);
      if (!adventure) throw new Error("Adventure not found");

      adventure.isActive = false;
      return await adventure.save();
    },
  },
};

export default resolvers;
