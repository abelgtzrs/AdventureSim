import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { START_ADVENTURE } from "../graphql/mutations";
import PromptSelector from "../prompts/promptselector";
import "./styles/storyCreate.css";

const StoryCreator: React.FC = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [startAdventure, { loading, error }] = useMutation(START_ADVENTURE);
  const navigate = useNavigate();

  const handleHomeClick = () => navigate("/");
  const handleLogoutClick = () => {
    localStorage.removeItem("id_token");
    navigate("/logIn-signUp");
  };

  const handleStartAdventure = async () => {
    if (!title || !category) return;
    try {
      const { data } = await startAdventure({
        variables: { title, category },
      });
      const newId = data.startAdventure.id;
      navigate(`/adventure/${newId}`);
    } catch (err) {
      console.error("Error starting adventure:", err);
    }
  };

  return (
    <div className="story-create-container">
      <h1>Create Your Adventure</h1>
      <button onClick={handleHomeClick}>Home</button>
      <button onClick={handleLogoutClick}>Logout</button>

      <div className="form-group">
        <label>Story Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your story's title"
        />
      </div>

      <PromptSelector onSelect={setCategory} />

      <button
        onClick={handleStartAdventure}
        disabled={!title || !category || loading}
      >
        {loading ? "Starting..." : "Start Adventure"}
      </button>

      {error && (
        <p className="error">Failed to start story. Please try again.</p>
      )}
    </div>
  );
};

export default StoryCreator;
