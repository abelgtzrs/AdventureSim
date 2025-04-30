import React, { useState } from 'react';

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
      <div className="p-4">
        <p>Story over or missing starting scene.</p>
        <button onClick={onExit} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">
          Back to Editor
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Scene {currentScene.id}</h2>
      <p className="mb-6 whitespace-pre-wrap">{currentScene.description}</p>

      {currentScene.choices.length === 0 ? (
        <p className="italic text-gray-600">No choices available. The story ends here.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {currentScene.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => setCurrentSceneId(choice.nextSceneId)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={onExit}
        className="mt-6 text-sm text-gray-600 underline"
      >
        Back to Editor
      </button>
    </div>
  );
};

export default StoryPlayer;
