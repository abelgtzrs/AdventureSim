import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ADVENTURE_SESSION } from "../graphql/queries";
import { CONTINUE_ADVENTURE } from "../graphql/mutations";
import { useState } from "react";

const AdventureSessionPage = () => {
  const { id } = useParams<{ id: string }>();
  const [input, setInput] = useState("");
  const { loading, error, data, refetch } = useQuery(GET_ADVENTURE_SESSION, {
    variables: { id },
  });

  const [continueAdventure, { loading: mutating }] = useMutation(
    CONTINUE_ADVENTURE,
    {
      onCompleted: () => {
        setInput("");
        refetch();
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await continueAdventure({
      variables: { sessionId: id, input },
    });
  };

  if (loading) return <p>Loading adventure...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { title, category, isActive, entries } = data.getAdventureSession;

  return (
    <div>
      <h1>{title}</h1>
      <h2>{category}</h2>
      <p>Status: {isActive ? "Ongoing" : "Completed"}</p>

      <ul>
        {entries.map((entry: any, index: number) => (
          <li key={index}>
            <strong>You:</strong> {entry.prompt}
            <br />
            <strong>AI:</strong> {entry.response}
            {entry.chaosScore && <p>🌀 Chaos Score: {entry.chaosScore}/1000</p>}
            <hr />
          </li>
        ))}
      </ul>

      {isActive && (
        <form onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What do you do next?"
            required
          />
          <button type="submit" disabled={mutating}>
            Continue Adventure
          </button>
        </form>
      )}

      {!isActive && (
        <div>
          <h3>📜 Final Epilogue:</h3>
          <p>{entries[entries.length - 1].response}</p>
        </div>
      )}
    </div>
  );
};

export default AdventureSessionPage;
