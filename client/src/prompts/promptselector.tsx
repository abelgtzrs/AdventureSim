import React from "react";
import "./styles/prompts.css"; // Make sure this file exists

const categories = [
  { name: "Horror", image: "horror.jpg" },
  { name: "Medieval", image: "medieval.jpg" },
  { name: "Science-Fiction", image: "scifi.jpg" },
  { name: "Post-Apocalyptic", image: "postapoc.jpg" },
];

const PromptSelector: React.FC<{ onSelect: (category: string) => void }> = ({
  onSelect,
}) => {
  return (
    <div className="prompt-grid">
      {categories.map(({ name, image }) => (
        <button
          key={name}
          className="prompt-card"
          style={{
            backgroundImage: `url(/images/${image})`, // Customize path later
          }}
          onClick={() => onSelect(name)}
        >
          <span className="prompt-title">{name}</span>
        </button>
      ))}
    </div>
  );
};

export default PromptSelector;
