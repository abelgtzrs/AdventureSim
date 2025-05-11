import React from "react";
import "./styles/prompts.css"; // Keep this if it has base styles, or move all to storyCreate.css

type Props = {
  onSelect: (cat: string) => void; // send canonical key
  selectedValue?: string | null; // Renamed from 'value' to 'selectedValue' for clarity, matching StoryCreator
};

// Ensure these image paths are correct relative to your /public folder
const categories = [
  { name: "Horror", img: "horror.png", value: "Horror" }, // e.g., /public/horror.png
  { name: "Medieval", img: "medieval.png", value: "Medieval" },
  { name: "Sci-Fi", img: "scifi.png", value: "ScienceFiction" }, // Adjusted name for display
  { name: "Post-Apocalyptic", img: "postapoc.png", value: "PostApocalyptic" },
];

// Using selectedValue prop as passed from StoryCreator
export default function PromptSelector({ onSelect, selectedValue }: Props) {
  return (
    // Changed class name for consistency with "Chronicle Forge"
    <div className="forge-category-grid">
      {" "}
      {/* Was: prompt-grid */}
      {categories.map(({ name, img, value: key }) => {
        const isSelected = key === selectedValue; // Compare with selectedValue
        return (
          <button
            key={key}
            // Changed class name and use isSelected
            className={`forge-category-card${isSelected ? " selected" : ""}`} // Was: prompt-card
            style={{ backgroundImage: `url(/${img})` }} // Assuming images are in /public directly
            onClick={() => onSelect(key)}
            aria-pressed={isSelected} // Good for accessibility
            type="button" // Good practice for buttons not submitting forms
          >
            {/* Changed class name */}
            <span className="forge-category-title">{name}</span>{" "}
            {/* Was: prompt-title */}
          </button>
        );
      })}
    </div>
  );
}
