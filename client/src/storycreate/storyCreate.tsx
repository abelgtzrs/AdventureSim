import React, { useState } from 'react';
import PromptSelector from '../prompts/promptselector';
import StoryPlayer from '../player/storyPlayer';
import './storyCreate.css';

interface Choice {
  text: string;
  nextSceneId: number | null;
}

interface Scene {
  id: number;
  description: string;
  choices: Choice[];
}

const StoryCreator: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentSceneId, setCurrentSceneId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const startStoryFromPrompt = (prompt: string) => {
    const introScene: Scene = {
      id: Date.now(),
      description: prompt,
      choices: [],
    };
    setScenes([introScene]);
    setCurrentSceneId(introScene.id);
    setSelectedPrompt(prompt);
  };

  if (!selectedPrompt) {
    return <PromptSelector onSelect={startStoryFromPrompt} />;
  }

  if (isPlaying) {
    return (
      <StoryPlayer scenes={scenes} onExit={() => setIsPlaying(false)} />
    );
  }

  const addScene = () => {
    const newScene = {
      id: Date.now(),
      description: '',
      choices: [],
    };
    setScenes([...scenes, newScene]);
  };

  return (
    <div>
      <h1>Story Builder</h1>
      <button onClick={addScene}>Add Scene</button>
    </div>
  );
};

export default StoryCreator;