import AdventureSession from "../models/AdventureSession";

// Create a new adventure session
export const createAdventureSession = async (data: {
  userId: string;
  title: string;
  class: string;
  entries: {
    prompt: string;
    response: string;
    chaosScore?: number;
  }[];
}) => {
  const newSession = new AdventureSession(data);
  return await newSession.save();
};

// Fetch all adventure sessions for a user
export const fetchAdventureSessions = async (userId: string) => {
  return await AdventureSession.find({ userId });
};