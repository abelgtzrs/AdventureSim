import React from "react";
import "./styles/prompts.css";

type Props = {
  onSelect: (cat: string) => void;
  value?: string | null; // currently‑selected category
};

const categories = [
  { name: "Horror", img: "horror.png" },
  { name: "Medieval", img: "medieval.png" },
  { name: "Science‑Fiction", img: "scifi.png" },
  { name: "Post‑Apocalyptic", img: "postapoc.png" },
];

export default function PromptSelector({ onSelect, value }: Props) {
  return (
    <div className="prompt-grid">
      {categories.map(({ name, img }) => {
        const selected = name === value;
        return (
          <button
            key={name}
            className={`prompt-card${selected ? " selected" : ""}`}
            style={{ backgroundImage: `url(/public/${img})` }}
            onClick={() => onSelect(name)}
          >
            <span className="prompt-title">{name}</span>
          </button>
        );
      })}
    </div>
  );
}
