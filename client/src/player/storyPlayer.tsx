import React, { useState } from 'react';
import './styles/storyPlayer.css';

interface Choice {
  text: string;
  nextSceneId: number | null;
}

interface Scene {
  id: number;
  description: string;
  choices: Choice[];
}

interface Props {
  scenes: Scene[];
  onExit: () => void;
}

const StoryPlayer: React.FC<Props> = ({ scenes, onExit }) => {
  const [currentSceneId, setCurrentSceneId] = useState<number | null>(
    scenes[0]?.id ?? null
  );

  const currentScene = scenes.find((scene) => scene.id === currentSceneId);

  if (!currentScene) {
    return (
      <div>
        <p>Story over or missing starting scene.</p>
        <button onClick={onExit}>Back to Editor</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Scene {currentScene.id}</h2>
      <p>{currentScene.description}</p>

      {currentScene.choices.length === 0 ? (
        <p>No choices available. The story ends here.</p>
      ) : (
        <div>
          {currentScene.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => setCurrentSceneId(choice.nextSceneId)}
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}

      <button onClick={onExit}>Back to Editor</button>
    </div>
  );
};

export default StoryPlayer;