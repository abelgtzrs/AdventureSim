import React, {useEffect, useState} from 'react';
import { storyPrompts } from './storyPrompts';
import './prompts.css'



interface Props {
  onSelect: (prompt: string) => void;
}

const PromptSelector: React.FC<Props> = ({ onSelect }) => {
  const [displayPrompts, setDisplayPrompts] = useState<string[]>([]);

  useEffect(() => {
    
    const shuffled = [...storyPrompts].sort(() => 0.5 - Math.random());
    setDisplayPrompts(shuffled.slice(0, 3));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Choose a Story Prompt</h1>
      <ul className="space-y-3">
        {displayPrompts.map((prompt, index) => (
          <li key={index}>
            <button
              onClick={() => onSelect(prompt)}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full text-left"
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PromptSelector;
