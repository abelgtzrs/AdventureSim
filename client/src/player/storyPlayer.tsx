import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import "./storyplayer.css"; // This will be the new CSS

/* ---------- GraphQL Definitions (Ensure these are correct as before) ---------- */
const GET_ADVENTURE_SESSION = gql`
  query GetAdventureSession($id: ID!) {
    getAdventureSession(id: $id) {
      id
      title
      category
      isActive
      entries {
        prompt
        response
        chaosScore
        timestamp
      }
    }
  }
`;
const CONTINUE_ADVENTURE = gql`
  mutation ContinueAdventure($sessionId: ID!, $input: String!) {
    continueAdventure(sessionId: $sessionId, input: $input) {
      id
      isActive
      entries {
        prompt
        response
        chaosScore
        timestamp
      }
    }
  }
`;
const END_ADVENTURE = gql`
  mutation EndAdventure($sessionId: ID!) {
    endAdventure(sessionId: $sessionId) {
      id
      isActive
    }
  }
`;

/* ---------- Types (As before) ---------- */
interface Entry {
  prompt?: string;
  response?: string;
  chaosScore?: number;
  timestamp: string;
}
interface Session {
  id: string;
  title: string;
  category: string;
  isActive: boolean;
  entries: Entry[];
}

/* ---------- Helpers (parseExtrasAndCleanResponse as before) ---------- */
const parseExtrasAndCleanResponse = (
  text: string,
  entryChaosScore?: number
) => {
  let cleanedText = text || "";
  const chaosMatch = cleanedText.match(/Chaos Rating: (\d+)/);
  const chaos = entryChaosScore?.toString() ?? chaosMatch?.[1] ?? null;
  const achMatch = cleanedText.match(/Achievement Unlocked: (.+?)(?:\n|$)/);
  const achievement = achMatch?.[1]?.trim() ?? null;
  if (chaosMatch) cleanedText = cleanedText.replace(chaosMatch[0], "").trim();
  if (achMatch) cleanedText = cleanedText.replace(achMatch[0], "").trim();
  return { chaos, achievement, cleanedText };
};

/* ---------- Epilogue Panel (Styled for Narrative Focus) ---------- */
function EpilogueView({
  session,
  onBack,
}: {
  session: Session;
  onBack: () => void;
}) {
  const lastEntry = session?.entries?.find(
    (entry) => entry.prompt === "[Final Outcome]"
  );
  const epilogueText = lastEntry?.response ?? "The story has concluded.";
  return (
    <div className="narrative-epilogue-container">
      <div className="narrative-epilogue-content">
        <span className="narrative-epilogue-icon">📖</span> {/* Book icon */}
        <h2>The Final Chapter</h2>
        <p
          className="narrative-epilogue-text"
          dangerouslySetInnerHTML={{
            __html: epilogueText.replace(/\n/g, "<br />"),
          }}
        />
        <button
          className="narrative-button narrative-button-primary"
          onClick={onBack}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

/* ---------- Main Component: The Narrative Focus ---------- */
export default function StoryPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>(
    []
  );
  const [displayedAchievements, setDisplayedAchievements] = useState<string[]>(
    []
  );
  const [currentChaos, setCurrentChaos] = useState<string | null>(null);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(false); // For mobile sidebar toggle

  const storyFeedRef = useRef<HTMLDivElement>(null);
  const previousAchievementsSetRef = useRef<Set<string>>(new Set());

  const { loading, error, data, refetch } = useQuery<{
    getAdventureSession: Session | null;
  }>(GET_ADVENTURE_SESSION, {
    variables: { id },
    fetchPolicy: "network-only",
    onCompleted: (queryData) => {
      /* ... (auto-start logic as before) ... */
    },
  });
  const session = data?.getAdventureSession;

  const [continueAdventureMutation] = useMutation(CONTINUE_ADVENTURE);
  const [endAdventureMutation] = useMutation(END_ADVENTURE);

  useEffect(() => {
    /* ... (auto-scroll logic as before for storyFeedRef) ... */
  }, [session?.entries?.length]);
  const pushToast = useCallback((msg: string) => {
    /* ... (as before) ... */
  }, []);
  useEffect(() => {
    /* ... (stats and achievements update logic as before) ... */
  }, [session, pushToast]);
  const handleSendInput = async () => {
    /* ... (as before) ... */
  };
  const handleEndStory = async () => {
    /* ... (as before) ... */
  };

  if (loading && !data)
    return (
      <div className="narrative-state-indicator narrative-loading">
        <div className="narrative-spinner"></div>
        <p>Loading Story...</p>
      </div>
    );
  if (error)
    return (
      <div className="narrative-state-indicator narrative-error">
        <p>Error: {error.message}</p>
        <button
          onClick={() => navigate("/")}
          className="narrative-button narrative-button-outline"
        >
          Dashboard
        </button>
      </div>
    );
  if (!session)
    return (
      <div className="narrative-state-indicator">
        <p>Session not found.</p>
        <button
          onClick={() => navigate("/")}
          className="narrative-button narrative-button-outline"
        >
          Dashboard
        </button>
      </div>
    );

  if (!session.isActive) {
    return <EpilogueView session={session} onBack={() => navigate("/")} />;
  }

  const turnCount =
    session.entries?.filter((e) => e.prompt && e.prompt !== "[BEGIN]").length ??
    0;

  return (
    <div
      className={`narrative-focus-player ${
        isContextPanelOpen ? "context-panel-active" : ""
      }`}
    >
      <header className="narrative-header">
        <button
          onClick={() => navigate("/")}
          className="narrative-button-icon nav-back-button"
          aria-label="Back to Dashboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="24"
            height="24"
          >
            <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
          </svg>
        </button>
        <h1 className="narrative-story-title">{session.title}</h1>
        <div className="narrative-header-actions">
          <span className="narrative-turn-counter">Turn: {turnCount}/20</span>
          <button
            onClick={handleEndStory}
            className="narrative-button narrative-button-danger end-story-button"
            disabled={isWaitingForAI}
          >
            End Story
          </button>
          <button
            className="narrative-button-icon context-panel-toggle"
            onClick={() => setIsContextPanelOpen(!isContextPanelOpen)}
            aria-label="Toggle Story Details"
            aria-expanded={isContextPanelOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
            >
              <path d="M12 3C12.5523 3 13 3.44772 13 4V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V4C11 3.44772 11.4477 3 12 3ZM19 3C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20V4C18 3.44772 18.4477 3 19 3ZM5 3C5.55228 3 6 3.44772 6 4V20C6 20.5523 5.55228 21 5 21C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3Z"></path>
            </svg>
          </button>
        </div>
      </header>

      <div className="narrative-main-wrapper">
        <main
          className="narrative-story-feed"
          ref={storyFeedRef}
          aria-live="polite"
        >
          {session.entries.map((entry, idx) => {
            if (entry.prompt === "[BEGIN]" && !entry.response) return null;
            const {
              cleanedText: cleanedAiText,
              chaos: entryChaos,
              achievement: entryAchievement,
            } = parseExtrasAndCleanResponse(
              entry.response ?? "",
              entry.chaosScore
            );
            const isUserEntry = entry.prompt && entry.prompt !== "[BEGIN]";

            return (
              <div
                key={idx}
                className={`narrative-entry ${
                  isUserEntry ? "user-entry" : "ai-entry"
                }`}
              >
                {isUserEntry && (
                  <div className="entry-speaker user-speaker">You</div>
                )}
                <div className="entry-content">
                  {isUserEntry && <p>{entry.prompt}</p>}
                  {cleanedAiText && (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: cleanedAiText.replace(/\n/g, "<br />"),
                      }}
                    />
                  )}
                  {/* Meta data displayed subtly after content */}
                  {!isUserEntry && (entryChaos || entryAchievement) && (
                    <div className="entry-meta">
                      {entryChaos && (
                        <span className="meta-tag chaos-tag">
                          🌀 Chaos: {entryChaos}
                        </span>
                      )}
                      {entryAchievement && (
                        <span className="meta-tag achievement-tag">
                          🏆 {entryAchievement}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isWaitingForAI && (session.entries?.length ?? 0) > 0 && (
            <div className="narrative-entry ai-entry thinking-indicator">
              <div className="entry-content">
                <div className="narrative-spinner small"></div>
                <span>Narrator is weaving...</span>
              </div>
            </div>
          )}
        </main>

        <aside
          className={`narrative-context-panel ${
            isContextPanelOpen ? "is-open" : ""
          }`}
        >
          <button
            className="close-panel-button"
            onClick={() => setIsContextPanelOpen(false)}
            aria-label="Close Story Details"
          >
            ×
          </button>
          <div className="panel-section">
            <h4>Category</h4>
            <p className="panel-category-display">{session.category}</p>
          </div>
          <div className="panel-section">
            <h4>Current Chaos</h4>
            <div
              className={`panel-chaos-indicator chaos-${
                currentChaos
                  ? parseInt(currentChaos) > 700
                    ? "critical"
                    : parseInt(currentChaos) > 400
                    ? "high"
                    : "stable"
                  : "unknown"
              }`}
            >
              <span className="chaos-value">{currentChaos ?? "N/A"}</span>
              {/* Optional: Could be a visual bar/gauge here */}
            </div>
          </div>
          <div className="panel-section achievements-section">
            <h4>Achievements ({displayedAchievements.length})</h4>
            {displayedAchievements.length > 0 ? (
              <ul className="panel-achievements-list">
                {displayedAchievements.map((ach, i) => (
                  <li key={i}>🏆 {ach}</li>
                ))}
              </ul>
            ) : (
              <p className="panel-no-achievements">None yet.</p>
            )}
          </div>
        </aside>
      </div>

      <footer className="narrative-input-bar">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your next action..."
          disabled={isWaitingForAI || !session.isActive}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendInput();
            }
          }}
          rows={1}
        />
        <button
          onClick={handleSendInput}
          className="narrative-button narrative-send-button"
          disabled={!input.trim() || isWaitingForAI || !session.isActive}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="20"
            height="20"
          >
            <path d="M3 13.0001H16.1716L10.5858 18.5859L12 20.0001L20 12.0001L12 4.00009L10.5858 5.41431L16.1716 11.0001H3V13.0001Z"></path>
          </svg>
        </button>
      </footer>

      <div className="narrative-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="narrative-toast">
            <p>{toast.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
