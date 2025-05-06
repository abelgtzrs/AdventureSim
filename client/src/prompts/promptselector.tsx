import React from "react";
import "./styles/prompts.css";

type Props = {
  onSelect: (cat: string) => void; // send canonical key
  value?: string | null; // currently selected key
};

const categories = [
  { name: "Horror", img: "horror.png", value: "Horror" },
  { name: "Medieval", img: "medieval.png", value: "Medieval" },
  { name: "Science‑Fiction", img: "scifi.png", value: "ScienceFiction" },
  { name: "Post‑Apocalyptic", img: "postapoc.png", value: "PostApocalyptic" },
];

export default function PromptSelector({ onSelect, value }: Props) {
  return (
    <div className="prompt-grid">
      {categories.map(({ name, img, value: key }) => {
        const selected = key === value; // ← compare keys
        return (
          <button
            key={key}
            className={`prompt-card${selected ? " selected" : ""}`}
            style={{ backgroundImage: `url(/public/${img})` }} // images folder
            onClick={() => onSelect(key)} // ← send canonical key
          >
            <span className="prompt-title">{name}</span>
          </button>
        );
      })}
    </div>
  );
}
