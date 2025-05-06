import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { CONTINUE_ADVENTURE, END_ADVENTURE } from "../graphql/mutations";
import { GET_ADVENTURE_SESSION } from "../graphql/queries";
import "./storyplayer.css";

interface Entry {
  prompt?: string; // the user’s message (backend optional)
  response?: string; // the AI reply (if backend uses 'response')
  text?: string; // ‑ or ‑ legacy field name
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

/* ──────────────────── Helper: Chaos & Achievement ───────────── */

const parseExtras = (txt: string) => {
  const chaos = txt.match(/Chaos Rating: (\d+)/)?.[1] ?? null;
  const ach = txt.match(/Achievement Unlocked: (.+)/)?.[1] ?? null;
  return { chaos, achievement: ach };
};

/* ───────────────────────── Component ───────────────────────── */

export default function StoryPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  /* local input state */
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false); // shows loading

  /* ── Query the session ── */
  const { loading, error, data, refetch } = useQuery(GET_ADVENTURE_SESSION, {
    variables: { id },
    fetchPolicy: "network-only",
  });
  const session: Session | undefined = data?.getAdventureSession;

  /* ── Mutations ── */
  const [continueAdventure] = useMutation(CONTINUE_ADVENTURE);
  const [endAdventure] = useMutation(END_ADVENTURE);

  /* ── Scroll to newest entry whenever list changes ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.entries.length]);

  /* ── Kick‑off first scene if entries empty ── */
  useEffect(() => {
    if (
      !loading &&
      !error &&
      session &&
      session.isActive &&
      session.entries.length === 0
    ) {
      setWaiting(true);
      continueAdventure({ variables: { sessionId: id!, input: "" } }).finally(
        () => {
          setWaiting(false);
          refetch();
        }
      );
    }
  }, [loading, error, session, id, refetch, continueAdventure]);

  /* ── Handlers ─────────────────────────────────────────── */
  const handleSend = async () => {
    if (!input.trim() || !session?.isActive) return;

    const userText = input.trim();
    setInput("");
    setWaiting(true);

    /* fire mutation – backend stores both user prompt & AI reply */
    await continueAdventure({
      variables: { sessionId: id!, input: userText },
    });

    setWaiting(false);
    refetch(); // pulls updated entries list from server
  };

  const handleEnd = async () => {
    if (!session?.isActive) return;
    setWaiting(true);
    await endAdventure({ variables: { sessionId: id! } });
    setWaiting(false);
    refetch();
  };

  /* ── Render ───────────────────────────────────────────── */
  if (loading) return <p className="loader">Loading story…</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!session) return <p>Session not found.</p>;

  const turns = Math.min(session.entries.length, 20);

  return (
    <div className="story-player">
      <header>
        <button onClick={() => navigate("/")}>← Back</button>
        <h2>{session.title}</h2>
        <span className="turn-indicator">Turn {turns} / 20</span>
        {session.isActive && (
          <button className="end-btn" onClick={handleEnd}>
            End Story
          </button>
        )}
      </header>

      <section className="entry-list">
        {session.entries.map((e: Entry, idx: number) => {
          const userLine = e.prompt; // user message
          const aiText = e.response ?? e.text ?? "";
          const { chaos, achievement } = parseExtras(aiText);

          return (
            <div key={idx} className="entry-block">
              {userLine && (
                <p className="user-msg">
                  <strong>You:</strong> {userLine}
                </p>
              )}

              {aiText && <p className="ai-msg">{aiText}</p>}

              {chaos && <p className="chaos">🌀 Chaos: {chaos}</p>}
              {achievement && <p className="ach">🏆 {achievement}</p>}
            </div>
          );
        })}

        {waiting && <p className="loader">…generating…</p>}

        <div ref={bottomRef} />
      </section>

      {session.isActive ? (
        <footer>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your action…"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={waiting}
          />
          <button onClick={handleSend} disabled={!input.trim() || waiting}>
            Send
          </button>
        </footer>
      ) : (
        <footer>
          <strong>Story finished.</strong>
        </footer>
      )}
    </div>
  );
}
