import User from "../models/User";
import AdventureSession from "../models/AdventureSession";
import { signToken } from "../utils/auth"; // ✅ Correct named import!

function authRequired(context: any) {
  if (!context.user) {
    console.warn("[AUTH] Unauthorized access attempt");
    throw new Error("Not authenticated");
  }
  return context.user;
}

const resolvers = {
  Query: {
    getMyAdventureSessions: async (_: any, __: any, context: any) => {
      console.log("[QUERY] getMyAdventureSessions");
      const user = authRequired(context);
      return await AdventureSession.find({ userId: user._id });
    },

    getAdventureSession: async (
      _: any,
      { id }: { id: string },
      context: any
    ) => {
      console.log("[QUERY] getAdventureSession", id);
      const user = authRequired(context);
      return await AdventureSession.findById(id);
    },
  },

  Mutation: {
    register: async (
      _: any,
      {
        username,
        email,
        password,
      }: { username: string; email: string; password: string }
    ) => {
      console.log("[MUTATION] register", username, email);
      const newUser = new User({ username, email, password });
      await newUser.save();
      const token = signToken(newUser);
      return { token, user: newUser };
    },

    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      console.log("[MUTATION] login", email);
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = signToken(user);
      return { token, user };
    },

    startAdventure: async (
      _: any,
      { title, category }: { title: string; category: string },
      context: any
    ) => {
      console.log("[MUTATION] startAdventure", title, category);
      const user = authRequired(context);

      const newAdventure = await AdventureSession.create({
        userId: user._id,
        title,
        category,
        entries: [],
        length: 0,
        isActive: true,
        createdAt: new Date(),
      });

      console.log("[DB] Adventure created", newAdventure.id);
      return newAdventure;
    },

    continueAdventure: async (
      _: any,
      { sessionId, input }: { sessionId: string; input: string },
      context: any
    ) => {
      console.log("[MUTATION] continueAdventure", sessionId, input);
      const user = authRequired(context);

      const adventure = await AdventureSession.findById(sessionId);
      if (!adventure) throw new Error("Adventure not found");

      if (!adventure.isActive) throw new Error("Adventure already ended");
      if (adventure.length >= 20) {
        adventure.isActive = false;
        await adventure.save();
        throw new Error("Adventure reached maximum length");
      }

      // Simulate AI response for now
      const aiResponse = `Fake AI Response to: ${input}`;

      adventure.entries.push({
        prompt: input,
        response: aiResponse,
        timestamp: new Date(),
      });

      adventure.length += 1;

      if (adventure.length >= 20) {
        adventure.isActive = false;
      }

      await adventure.save();
      console.log(
        "[DB] Adventure updated",
        adventure.id,
        "length:",
        adventure.length
      );

      return adventure;
    },

    endAdventure: async (
      _: any,
      { sessionId }: { sessionId: string },
      context: any
    ) => {
      console.log("[MUTATION] endAdventure", sessionId);
      const user = authRequired(context);

      const adventure = await AdventureSession.findById(sessionId);
      if (!adventure) throw new Error("Adventure not found");

      adventure.isActive = false;
      await adventure.save();
      console.log("[DB] Adventure ended", adventure.id);

      return adventure;
    },
  },
};

export default resolvers;
