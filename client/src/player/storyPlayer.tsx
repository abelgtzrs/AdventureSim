import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql, ApolloError } from "@apollo/client"; // Ensure ApolloError is imported
import "./storyplayer.css"; // This will be the "Narrative Focus" CSS

/* ---------- GraphQL Definitions (from your working code) ---------- */
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

/* ---------- Types (from your working code) ---------- */
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

/* ---------- Helpers (from your working code) ---------- */
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
  // Use optional chaining for safety, though session should be valid here
  const lastRelevantEntry = session?.entries
    ?.slice()
    .reverse()
    .find((entry) => entry.response && entry.response.trim() !== "");

  const epilogueText =
    session?.entries?.find((e) => e.prompt === "[Final Outcome]")?.response ||
    lastRelevantEntry?.response ||
    "The story has concluded.";
  return (
    <div className="narrative-epilogue-container">
      <div className="narrative-epilogue-content">
        <span className="narrative-epilogue-icon">📖</span>
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

/* ---------- Main Story Player Component: "The Narrative Focus" ---------- */
export default function StoryPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [isWaitingForAI, setIsWaitingForAI] = useState(false); // Kept from your working logic
  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>(
    []
  );
  const [displayedAchievements, setDisplayedAchievements] = useState<string[]>(
    []
  );
  const [currentChaos, setCurrentChaos] = useState<string | null>(null);
  const [isContextPanelOpen, setIsContextPanelOpen] = useState(false);

  const storyFeedRef = useRef<HTMLDivElement>(null); // Renamed from weaveAreaRef for clarity
  const previousAchievementsSetRef = useRef<Set<string>>(new Set());

  const {
    loading: queryLoading,
    error: queryError,
    data,
    refetch,
  } = useQuery<{
    getAdventureSession: Session | null;
  }>(GET_ADVENTURE_SESSION, {
    variables: { id },
    fetchPolicy: "network-only",
    onCompleted: (queryData) => {
      // This is from your working logic for initial turn
      const currentSession = queryData?.getAdventureSession;
      if (
        currentSession?.isActive &&
        currentSession.entries && // Check entries directly
        currentSession.entries.length === 0 &&
        id
      ) {
        setIsWaitingForAI(true);
        continueAdventureMutation({
          variables: { sessionId: id, input: "[BEGIN]" }, // Or whatever initial input works
        })
          .then(() => {
            refetch();
            // setIsWaitingForAI(false); // Moved to finally
          })
          .catch((err) =>
            console.error("Error automatically starting adventure:", err)
          )
          .finally(() => setIsWaitingForAI(false)); // Ensure this is always called
      }
    },
  });
  const session = data?.getAdventureSession;

  // Using loading state from useMutation directly for more granular control if needed
  const [continueAdventureMutation, { loading: continueMutationLoading }] =
    useMutation(CONTINUE_ADVENTURE, {
      // No onCompleted or onError here, handled in handleSendInput's try/catch/finally
      // This is based on your provided working logic's structure for handleSendInput
    });
  const [endAdventureMutation, { loading: endMutationLoading }] =
    useMutation(END_ADVENTURE);

  // A general processing state based on query or mutation loading
  const isProcessing =
    queryLoading ||
    isWaitingForAI ||
    continueMutationLoading ||
    endMutationLoading;

  useEffect(() => {
    if (storyFeedRef.current) {
      storyFeedRef.current.scrollTo({
        top: storyFeedRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [session?.entries?.length]);

  const pushToast = useCallback((msg: string) => {
    const newToast = { id: Date.now(), message: msg };
    setToasts((currentToasts) => [...currentToasts, newToast]);
    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((t) => t.id !== newToast.id)
      );
    }, 5000);
  }, []);

  useEffect(() => {
    if (!session || !session.entries) {
      setCurrentChaos(null);
      setDisplayedAchievements([]);
      previousAchievementsSetRef.current = new Set();
      return;
    }
    const allAchievementsInSession = new Set<string>();
    let lastChaosValueInSession: string | null = null;
    session.entries.forEach((entry) => {
      const aiText = entry.response ?? "";
      const { chaos, achievement } = parseExtrasAndCleanResponse(
        aiText,
        entry.chaosScore
      );
      if (chaos) lastChaosValueInSession = chaos;
      if (achievement) {
        allAchievementsInSession.add(achievement);
        if (!previousAchievementsSetRef.current.has(achievement)) {
          pushToast(`🏆 Achievement Unlocked: ${achievement}`); // Icon added here
        }
      }
    });
    setCurrentChaos(lastChaosValueInSession);
    setDisplayedAchievements(Array.from(allAchievementsInSession));
    previousAchievementsSetRef.current = new Set(allAchievementsInSession);
  }, [session, pushToast]);

  const handleSendInput = async () => {
    if (!input.trim() || !session?.isActive || !id || isWaitingForAI) {
      // isWaitingForAI check
      console.warn("Send input blocked by guard");
      return;
    }
    setIsWaitingForAI(true); // Set loading state
    const currentInput = input.trim();
    setInput("");
    try {
      await continueAdventureMutation({
        variables: { sessionId: id, input: currentInput },
      });
      refetch(); // Refetch after successful mutation
    } catch (err: any) {
      // Catch specific ApolloError or general error
      console.error("Error continuing adventure:", err);
      const userMessage =
        err.graphQLErrors?.[0]?.message ||
        err.networkError?.message ||
        "Error sending action.";
      pushToast(`Error: ${userMessage}`);
    } finally {
      setIsWaitingForAI(false); // Reset loading state
    }
  };

  const handleEndStory = async () => {
    if (!session?.isActive || !id || isWaitingForAI) return;
    if (window.confirm("Are you sure you want to end this adventure?")) {
      setIsWaitingForAI(true);
      try {
        await endAdventureMutation({ variables: { sessionId: id } });
        refetch();
      } catch (err: any) {
        console.error("Error ending adventure:", err);
        const userMessage =
          err.graphQLErrors?.[0]?.message ||
          err.networkError?.message ||
          "Error ending story.";
        pushToast(`Error: ${userMessage}`);
      } finally {
        setIsWaitingForAI(false);
      }
    }
  };

  if (queryLoading && !data)
    return (
      <div className="narrative-state-indicator narrative-loading">
        <div className="narrative-spinner"></div>
        <p>Loading Story...</p>
      </div>
    );
  if (queryError)
    return (
      <div className="narrative-state-indicator narrative-error">
        <p>Error: {queryError.message}</p>
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
    session.entries?.filter(
      (e) =>
        e.prompt && e.prompt !== "[BEGIN]" && e.prompt !== "[STORY_INITIATION]"
    ).length ?? 0;

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
            disabled={isWaitingForAI || endMutationLoading}
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
          {(session.entries || []).map((entry, idx) => {
            // Handle the very first entry if it was [BEGIN] or [STORY_INITIATION]
            if (
              (entry.prompt === "[BEGIN]" ||
                entry.prompt === "[STORY_INITIATION]") &&
              entry.response
            ) {
              const {
                cleanedText: cleanedAiText,
                chaos: entryChaos,
                achievement: entryAchievement,
              } = parseExtrasAndCleanResponse(
                entry.response ?? "",
                entry.chaosScore
              );
              return (
                <div
                  key={`init-${idx}`}
                  className="narrative-entry ai-entry initial-narration"
                >
                  <div className="entry-content">
                    {cleanedAiText && (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: cleanedAiText.replace(/\n/g, "<br />"),
                        }}
                      />
                    )}
                    {(entryChaos || entryAchievement) && (
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
            }

            // Regular user prompts and subsequent AI responses
            const {
              cleanedText: cleanedAiText,
              chaos: entryChaos,
              achievement: entryAchievement,
            } = parseExtrasAndCleanResponse(
              entry.response ?? "",
              entry.chaosScore
            );
            const isUserEntry =
              entry.prompt &&
              entry.prompt !== "[BEGIN]" &&
              entry.prompt !== "[STORY_INITIATION]";

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
                  {!isUserEntry && cleanedAiText && (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: cleanedAiText.replace(/\n/g, "<br />"),
                      }}
                    />
                  )}
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
          {/* Use continueMutationLoading for the thinking indicator */}
          {continueMutationLoading && (session.entries?.length ?? 0) > 0 && (
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
            className="close-panel-button narrative-button-icon"
            onClick={() => setIsContextPanelOpen(false)}
            aria-label="Close Story Details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path>
            </svg>
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
          disabled={isProcessing || !session.isActive} // Use combined isProcessing
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
          disabled={!input.trim() || isProcessing || !session.isActive}
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
            {toast.message}{" "}
            {/* Icon is already in the message from pushToast */}
          </div>
        ))}
      </div>
    </div>
  );
}
