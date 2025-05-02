import {
  createAdventureSession,
  fetchAdventureSessions,
  getAdventureSessionById,
  continueAdventure,
  endAdventure,
  deleteAdventureSession,
} from "../controller/AdventureSessionsController";

import User from "../models/User";
import { signToken } from "../utils/auth";

// Helper for checking auth
const authRequired = (context: any) => {
  if (!context.user) throw new Error("Not authenticated");
  return context.user;
};

const resolvers = {
  Query: {
    getMyAdventureSessions: async (_: any, __: any, context: any) => {
      const user = authRequired(context);
      return await fetchAdventureSessions(user._id);
    },

    getAdventureSession: async (
      _: any,
      { id }: { id: string },
      context: any
    ) => {
      const user = authRequired(context);
      return await getAdventureSessionById(id, user._id);
    },
  },

  Mutation: {
    register: async (_: any, { username, email, password }: any) => {
      const newUser = new User({ username, email, password });
      await newUser.save();
      const token = signToken({
        email: newUser.email,
        username: newUser.username,
        _id: newUser._id,
      });
      return { token, user: newUser };
    },

    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");
      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw new Error("Invalid credentials");
      const token = signToken({
        email: user.email,
        username: user.username,
        _id: user._id,
      });
      return { token, user };
    },

    startAdventure: async (_: any, { title, category }: any, context: any) => {
      const user = authRequired(context);
      return await createAdventureSession({
        userId: user._id,
        title,
        category,
      });
    },

    continueAdventure: async (
      _: any,
      { sessionId, input }: any,
      context: any
    ) => {
      const user = authRequired(context);
      return await continueAdventure({
        sessionId,
        userId: user._id,
        userInput: input,
      });
    },

    endAdventure: async (_: any, { sessionId }: any, context: any) => {
      const user = authRequired(context);
      return await endAdventure(sessionId, user._id);
    },

    deleteAdventure: async (_: any, { sessionId }: any, context: any) => {
      const user = authRequired(context);
      return await deleteAdventureSession(sessionId, user._id);
    },
  },
};

export default resolvers;
