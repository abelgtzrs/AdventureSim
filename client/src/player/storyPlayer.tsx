import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { CONTINUE_ADVENTURE, END_ADVENTURE } from "../graphql/mutations";
import { GET_ADVENTURE_SESSION } from "../graphql/queries";
import "./storyplayer.css";
/* ---------- Types ---------- */
interface Entry {
  prompt?: string;
  response?: string;
  text?: string;
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

/* ---------- Helpers ---------- */
const parseExtras = (txt: string) => {
  const chaos = txt.match(/Chaos Rating: (\d+)/)?.[1] ?? null;
  const ach = txt.match(/Achievement Unlocked: (.+)/)?.[1] ?? null;
  return { chaos, achievement: ach };
};

/* ---------- Epilogue panel ---------- */
function EpilogueView({
  session,
  onBack,
}: {
  session: Session;
  onBack: () => void;
}) {
  const ep = session.entries[session.entries.length - 1];
  const text = ep.response ?? ep.text ?? "";

  return (
    <div className="epilogue-view">
      <h2>~ Epilogue ~</h2>
      <p className="epilogue-text">{text}</p>
      <button className="back-btn" onClick={onBack}>
        Back to Dashboard
      </button>
    </div>
  );
}

/* ---------- Main component ---------- */
export default function StoryPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* local UI state */
  const [input, setInput] = useState("");
  const [waiting, setWait] = useState(false);
  const [toasts, setToast] = useState<string[]>([]);
  const seen = useRef<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  /* queries & mutations */
  const { loading, error, data, refetch } = useQuery(GET_ADVENTURE_SESSION, {
    variables: { id },
    fetchPolicy: "network-only",
  });
  const session: Session | undefined = data?.getAdventureSession;
  const [continueAdventure] = useMutation(CONTINUE_ADVENTURE);
  const [endAdventure] = useMutation(END_ADVENTURE);

  /* auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.entries.length]);

  /* fire opening scene if none */
  useEffect(() => {
    if (
      !loading &&
      session &&
      session.isActive &&
      session.entries.length === 0
    ) {
      setWait(true);
      continueAdventure({ variables: { sessionId: id!, input: "" } }).finally(
        () => {
          setWait(false);
          refetch();
        }
      );
    }
  }, [loading, session, id, continueAdventure, refetch]);

  /* toast helper */
  const pushToast = (msg: string) => {
    setToast((t) => [...t, msg]);
    setTimeout(() => setToast((t) => t.slice(1)), 4000);
  };

  /* handlers */
  const handleSend = async () => {
    if (!input.trim() || !session?.isActive) return;
    const text = input.trim();
    setInput("");
    setWait(true);
    await continueAdventure({ variables: { sessionId: id!, input: text } });
    setWait(false);
    refetch();
  };

  const handleEnd = async () => {
    if (!session?.isActive) return;
    setWait(true);
    await endAdventure({ variables: { sessionId: id! } });
    setWait(false);
    refetch();
  };

  /* ------------- RENDER ------------- */
  if (loading) return <p className="loader">Loading story…</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!session) return <p>Session not found.</p>;

  /* If finished, show Epilogue view */
  if (!session.isActive) {
    return <EpilogueView session={session} onBack={() => navigate("/")} />;
  }

  /* -------- active game UI -------- */
  const turns = Math.min(session.entries.length, 20);

  return (
    <div className="story-player">
      <header>
        <button onClick={() => navigate("/")}>← Back</button>
        <h2>{session.title}</h2>
        <span className="turn-indicator">Turn {turns} / 20</span>
        <button className="end-btn" onClick={handleEnd}>
          End Story
        </button>
      </header>

      <section className="entry-list">
        {session.entries.map((e: Entry, idx: number) => {
          const me = e.prompt;
          const ai = e.response ?? e.text ?? "";
          const { chaos, achievement } = parseExtras(ai);

          /* show toast once */
          if (achievement && !seen.current.has(achievement)) {
            seen.current.add(achievement);
            pushToast(`Achievement Unlocked: ${achievement}`);
          }

          return (
            <div key={idx} className="entry-block">
              {me && (
                <p className="user-msg">
                  <strong>You:</strong> {me}
                </p>
              )}
              {ai && <p className="ai-msg">{ai}</p>}
              {chaos && <p className="chaos">🌀 Chaos: {chaos}</p>}
            </div>
          );
        })}

        {waiting && <p className="loader">…thinking…</p>}
        <div ref={bottomRef} />
      </section>

      <footer>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your action…"
          disabled={waiting}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={!input.trim() || waiting}>
          Send
        </button>
      </footer>

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t, i) => (
          <div key={i} className="toast">
            🏆 {t}
          </div>
        ))}
      </div>
    </div>
  );
}
