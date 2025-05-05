import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_ADVENTURE_SESSION } from "../graphql/queries";
import "./storyplayer.css";

interface Entry {
  text: string;
  createdAt: string;
}

interface AdventureSession {
  title: string;
  category: string;
  isActive: boolean;
  entries: Entry[];
}

const parseExtras = (text: string) => {
  const chaosMatch = text.match(/Chaos Rating: (\d+)/);
  const achievementMatch = text.match(/Achievement Unlocked: (.+)/);
  return {
    chaos: chaosMatch ? parseInt(chaosMatch[1]) : null,
    achievement: achievementMatch ? achievementMatch[1] : null,
  };
};

const StoryPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_ADVENTURE_SESSION, {
    variables: { id },
  });

  if (loading) return <p>Loading story...</p>;
  if (error) return <p>Error loading story.</p>;

  const session: AdventureSession = data.getAdventureSession;

  return (
    <div className="story-player-container">
      <h1>{session.title}</h1>
      <p>Category: {session.category}</p>

      <div className="story-entries">
        {session.entries.map((entry, index) => {
          const { chaos, achievement } = parseExtras(entry.text);
          return (
            <div key={index} className="entry-block">
              <p className="narrative-text">{entry.text}</p>
              {chaos !== null && (
                <p className="chaos-rating">🌀 Chaos Rating: {chaos}</p>
              )}
              {achievement && (
                <p className="achievement">🏆 Achievement: {achievement}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoryPlayer;
