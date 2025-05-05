import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate(); // Hook to programmatically navigate

  const currentScene = scenes.find((scene) => scene.id === currentSceneId);

  const handleHomeClick = () => {
    navigate('/'); // Navigate back to the home page
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('id_token'); // Clear the token from local storage
    navigate('/logIn-signUp'); // Navigate to the login page
  };

  if (!currentScene) {
    return (
      <div>
        <p>Story over or missing starting scene.</p>
        <button onClick={onExit}>Back to Editor</button>
        <button onClick={handleHomeClick}>Home</button>
        <button onClick={handleLogoutClick}>Logout</button>
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
      <button onClick={handleHomeClick}>Home</button>
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default StoryPlayer;