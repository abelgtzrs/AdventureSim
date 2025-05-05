import React, { useEffect, useState } from "react";
import { storyPrompts } from "./storyPrompts";
import "./prompts.css";

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
    <div className="container">
      <h1 className="header">Choose a Story Prompt</h1>
      <ul className="list">
        {displayPrompts.map((prompt, index) => (
          <li key={index}>
            <button onClick={() => onSelect(prompt)} className="button">
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PromptSelector;
