import OpenAI from "openai";
import prompts from "./systemPrompts";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import type { IEntry } from "../models/AdventureSession";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 1. Continue story
export const getAIResponse = async ({
  category,
  entries,
  userInput,
  turnNumber,
}: {
  category: string;
  entries: IEntry[];
  userInput: string;
  turnNumber: number;
}) => {
  const systemPrompt = prompts[category];
  if (!systemPrompt)
    throw new Error(`No system prompt defined for category: ${category}`);

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...entries.flatMap<ChatCompletionMessageParam>((entry) => [
      { role: "user", content: entry.prompt },
      { role: "assistant", content: entry.response },
    ]),
    { role: "user", content: userInput },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    temperature: 0.9,
    messages,
  });

  const content = completion.choices[0].message?.content || "";

  const chaosMatch = content.match(/Chaos Rating:\s*(\d+)/);
  const achievementMatch = content.match(/Achievement Unlocked:\s*(.+)/);

  const chaosScore = chaosMatch ? parseInt(chaosMatch[1]) : undefined;
  const achievement = achievementMatch ? achievementMatch[1].trim() : undefined;

  return {
    response: content,
    chaosScore,
    achievement,
  };
};

// 2. Generate final epilogue
export const getEpilogue = async ({
  category,
  entries,
}: {
  category: string;
  entries: IEntry[];
}) => {
  const systemPrompt = prompts[category];
  if (!systemPrompt)
    throw new Error(`No system prompt defined for category: ${category}`);

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...entries.flatMap<ChatCompletionMessageParam>((entry) => [
      { role: "user", content: entry.prompt },
      { role: "assistant", content: entry.response },
    ]),
    {
      role: "user",
      content:
        "[The player has now taken 20 actions. Please generate a grounded and final epilogue summarizing the outcome based on their choices.]",
    },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    temperature: 0.8,
    messages,
  });

  return completion.choices[0].message?.content || "No epilogue generated.";
};
