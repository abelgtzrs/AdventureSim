import React, { useState } from 'react';
import PromptSelector from '../prompts/promptselector';
import StoryPlayer from '../player/storyPlayer';

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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Story Builder</h1>
      <button
        onClick={addScene}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Add Scene
      </button>

      {}
      {}
    </div>
  );
};

export default StoryCreator;
