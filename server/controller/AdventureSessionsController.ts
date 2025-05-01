import AdventureSession from "../models/AdventureSession";
import type { IEntry } from "../models/AdventureSession";
import { getAIResponse, getEpilogue } from "../utils/openai";

// 1. Create a new adventure session
export const createAdventureSession = async (data: {
  userId: string;
  title: string;
  category: string;
  entries?: IEntry[];
  isActive?: boolean;
}) => {
  const newSession = new AdventureSession({
    userId: data.userId,
    title: data.title,
    category: data.category,
    entries: data.entries || [],
    isActive: data.isActive ?? true,
    createdAt: new Date(),
  });

  return await newSession.save();
};

// 2. Fetch all sessions for a user
export const fetchAdventureSessions = async (userId: string) => {
  return await AdventureSession.find({ userId }).sort({ createdAt: -1 });
};

// 3. Fetch a single session
export const getAdventureSessionById = async (
  sessionId: string,
  userId: string
) => {
  const session = await AdventureSession.findById(sessionId);
  if (!session) throw new Error("Adventure session not found.");
  if (session.userId.toString() !== userId)
    throw new Error("Unauthorized access.");
  return session;
};

// 4. Continue an adventure (add a new prompt & AI response)
export const continueAdventure = async ({
  sessionId,
  userId,
  userInput,
}: {
  sessionId: string;
  userId: string;
  userInput: string;
}) => {
  const session = await AdventureSession.findById(sessionId);
  if (!session) throw new Error("Adventure session not found.");
  if (!session.isActive) throw new Error("This adventure is already complete.");
  if (session.userId.toString() !== userId)
    throw new Error("Unauthorized access.");

  const isFinalTurn = session.entries.length >= 19;
  const turnNumber = session.entries.length + 1;

  const { response, chaosScore, achievement } = await getAIResponse({
    category: session.category,
    entries: session.entries,
    userInput,
    turnNumber,
  });

  const newEntry: IEntry = {
    prompt: userInput,
    response,
    chaosScore,
    timestamp: new Date(),
  };

  session.entries.push(newEntry);
  session.isActive = !isFinalTurn;

  if (isFinalTurn) {
    const ending = await getEpilogue({
      category: session.category,
      entries: [...session.entries],
    });

    session.entries.push({
      prompt: "[Final Outcome]",
      response: ending,
      timestamp: new Date(),
    });
  }

  await session.save();
  return session;
};

// 5. Manually end a session
export const endAdventure = async (sessionId: string, userId: string) => {
  const session = await AdventureSession.findById(sessionId);
  if (!session) throw new Error("Adventure session not found.");
  if (session.userId.toString() !== userId)
    throw new Error("Unauthorized access.");

  session.isActive = false;
  await session.save();
  return session;
};

// 6. Delete a session
export const deleteAdventureSession = async (
  sessionId: string,
  userId: string
) => {
  const session = await AdventureSession.findById(sessionId);
  if (!session) throw new Error("Adventure session not found.");
  if (session.userId.toString() !== userId)
    throw new Error("Unauthorized access.");

  await session.deleteOne();
  return { success: true };
};
