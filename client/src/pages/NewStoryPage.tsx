import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { START_ADVENTURE } from "../graphql/mutations";
import CategorySelector from "../components/CategorySelector";
import { useNavigate } from "react-router-dom";

const NewStoryPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const [startAdventure, { loading, error }] = useMutation(START_ADVENTURE, {
    onCompleted: (data) => navigate(`/adventure/${data.startAdventure.id}`),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await startAdventure({ variables: { title, category } });
  };

  return (
    <div>
      <h1>Create New Adventure</h1>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <CategorySelector value={category} onChange={setCategory} />

        <button type="submit" disabled={loading || !category}>
          {loading ? "Starting…" : "Start Adventure"}
        </button>

        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </form>
    </div>
  );
};

export default NewStoryPage;
