import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
// import { START_ADVENTURE } from "../graphql/mutations"; // Assuming this is defined
import PromptSelector from "../prompts/promptselector"; // Assuming this component exists
import "./styles/storyCreate.css"; // We will create/update this

// Ensure START_ADVENTURE mutation is defined correctly
const START_ADVENTURE = gql`
  mutation StartAdventure($title: String!, $category: String!) {
    startAdventure(title: $title, category: $category) {
      id
      title # You might want more fields back to confirm
      category
    }
  }
`;

const StoryCreator: React.FC = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [showError, setShowError] = useState<string | null>(null);
  const [startAdventure, { loading, error: mutationError }] =
    useMutation(START_ADVENTURE);
  const navigate = useNavigate();

  // Clear error when title or category changes
  useEffect(() => {
    if (title || category) {
      setShowError(null);
    }
  }, [title, category]);

  const handleHomeClick = () => navigate("/"); // Navigate to dashboard (logged-in home)

  // Logout is usually a global action, better placed in a persistent header/nav
  // but keeping it here as per original component structure for now.
  const handleLogoutClick = () => {
    localStorage.removeItem("id_token");
    // Consider client.resetStore() from Apollo if you have client instance
    navigate("/logIn-signUp"); // Or to public homepage
  };

  const handleStartAdventure = async () => {
    if (!title.trim()) {
      setShowError("Please enter a compelling title for your adventure.");
      return;
    }
    if (!category) {
      setShowError("Please select a genre for your story.");
      return;
    }
    setShowError(null);

    try {
      const { data } = await startAdventure({
        variables: { title: title.trim(), category },
      });
      if (data?.startAdventure?.id) {
        const newId = data.startAdventure.id;
        navigate(`/adventure/${newId}`); // Navigate to the newly created adventure
      } else {
        setShowError("Could not retrieve adventure ID after creation.");
      }
    } catch (err: any) {
      console.error("Error starting adventure:", err);
      setShowError(
        err.message || "An unexpected error occurred while starting your story."
      );
    }
  };

  return (
    <div className="chronicle-forge-page">
      {" "}
      {/* Main container for the page */}
      <header className="forge-header">
        {/* Optional: Back button to dashboard if this page isn't the primary landing after login */}
        <button
          onClick={handleHomeClick}
          className="forge-nav-button back-button"
          aria-label="Back to Dashboard"
        >
          &larr; My Adventures
        </button>
        <h1>Ignite Your Narrative</h1>
        <button
          onClick={handleLogoutClick}
          className="forge-nav-button logout-button"
        >
          Log Out
        </button>
      </header>
      <main className="forge-main-content">
        <div className="forge-form-container">
          {/* Section 1: Title */}
          <section className="forge-section title-section">
            <label htmlFor="adventureTitle" className="forge-label">
              <span className="label-number">1</span> Name Your Chronicle
            </label>
            <input
              id="adventureTitle"
              className="forge-input-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Whispers of Dunwich Mire"
              aria-describedby={
                showError && !title.trim() ? "forgeError" : undefined
              }
            />
          </section>

          {/* Section 2: Genre/Category Selection */}
          <section className="forge-section category-section">
            <h2 className="forge-label">
              <span className="label-number">2</span> Choose Your Realm (Genre)
            </h2>
            {/* Assuming PromptSelector renders a list of clickable category options */}
            {/* You'll need to style PromptSelector's output to match this theme */}
            <PromptSelector onSelect={setCategory} selectedValue={category} />
            {/* selectedValue prop added to PromptSelector for styling the active choice */}
          </section>

          {showError && (
            <p id="forgeError" className="forge-error-message" role="alert">
              {showError}
            </p>
          )}
          {mutationError && (
            <p className="forge-error-message" role="alert">
              Server error: {mutationError.message}
            </p>
          )}

          {/* Section 3: Action */}
          <section className="forge-section action-section">
            <button
              className="forge-button-primary start-adventure-button"
              onClick={handleStartAdventure}
              disabled={!title.trim() || !category || loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span> Conjuring World...
                </>
              ) : (
                "Start Adventure!"
              )}
            </button>
          </section>
        </div>
      </main>
      {/* Footer could be shared if this is part of a larger app layout component */}
      <footer className="forge-footer">
        <p>Every great story begins with a single choice.</p>
      </footer>
    </div>
  );
};

export default StoryCreator;
