import AdventureSession from "../models/AdventureSession";
import { getAIResponse, getEpilogue } from "../utils/openai"; // assumed helper
import type { IEntry } from "../models/AdventureSession";

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

  const isFinalTurn = session.entries.length >= 19; // index starts at 0
  const turnNumber = session.entries.length + 1;

  // Get AI response
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

  // Add ending if this is the final move
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
