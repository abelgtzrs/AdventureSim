import React from "react";

export const CATEGORIES = [
  "Horror",
  "Medieval",
  "Science Fiction",
  "Post-Apocalyptic",
] as const;

interface Props {
  value: string;
  onChange: (cat: string) => void;
}

const CategorySelector: React.FC<Props> = ({ value, onChange }) => (
  <div>
    <label>Choose a category</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        -- select --
      </option>
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  </div>
);

export default CategorySelector;
