import { useNavigate, Outlet } from "react-router-dom";
import { useQuery, useMutation, gql, useApolloClient } from "@apollo/client";
import "./styles/homepage.css"; // This will be our new CSS
import logo from "../assets/logo.png"; // Your logo asset
import {
  useEffect,
  useState, // Keep useState if needed for future UI interactions
} from "react";

// Ensure these GraphQL operations are correctly defined and imported
const GET_MY_ADVENTURE_SESSIONS = gql`
  query GetMyAdventureSessions {
    getMyAdventureSessions {
      id
      title
      category
      isActive
    }
  }
`;

const DELETE_ADVENTURE = gql`
  mutation DeleteAdventure($sessionId: ID!) {
    deleteAdventure(sessionId: $sessionId) {
      success
    }
  }
`;

interface AdventureSession {
  id: string;
  title: string;
  category: string;
  isActive: boolean;
}

const HomePage = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const token = localStorage.getItem("id_token");
  // mousePosition state from previous elaborate design can be removed if not used for dashboard
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { loading, error, data, refetch } = useQuery<{
    getMyAdventureSessions: AdventureSession[];
  }>(GET_MY_ADVENTURE_SESSIONS, {
    skip: !token,
    fetchPolicy: "network-only",
  });

  const [deleteAdventureMutation, { loading: deleteLoading }] = useMutation(
    DELETE_ADVENTURE,
    {
      onCompleted: () => refetch(),
      onError: (deleteError) => {
        console.error("Error deleting adventure:", deleteError);
        alert("Failed to delete adventure. Please try again.");
      },
    }
  );

  useEffect(() => {
    // Removed nexus-active body class logic, as we are redesigning the dashboard independently
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  const handleLoginSignUpClick = () => navigate("/logIn-signUp");

  const handleLogoutClick = async () => {
    localStorage.removeItem("id_token");
    try {
      await client.resetStore();
    } catch (e) {
      console.error("Error resetting Apollo store on logout:", e);
    }
    navigate("/");
  };

  const handleCreateClick = () => navigate("/create");
  const handleViewStory = (id: string) => navigate(`/adventure/${id}`);

  const handleDelete = async (id: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to banish the adventure "${title}" to the archives?`
      )
    ) {
      try {
        await deleteAdventureMutation({ variables: { sessionId: id } });
      } catch (e) {
        console.error("Delete mutation trigger failed", e);
      }
    }
  };

  // --- Logged OUT View (Assuming Luminous Nexus or other design is kept for this) ---
  if (!token) {
    // Retaining the structure for the Luminous Nexus for the logged-out page
    // Or replace with any other logged-out page design you prefer.
    // For brevity, I'll use a simplified placeholder here if you want to focus ONLY on dashboard.
    // const parallaxX = (mousePosition.x / window.innerWidth - 0.5) * -30;
    // const parallaxY = (mousePosition.y / window.innerHeight - 0.5) * -30;
    return (
      <div className="nexus-homepage">
        {" "}
        {/* Keep old class if CSS is separate or update */}
        {/* <div className="nexus-background-layer back-particles"></div>
        <div className="nexus-background-layer mid-glow" style={{ transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px) scale(1)` }}></div>
        <div className="nexus-background-layer front-stars" style={{ transform: `translate(${parallaxX}px, ${parallaxY}px) scale(1)` }}></div> */}
        <header className="nexus-header">
          <img src={logo} alt="AdventureSim Logo" className="nexus-logo" />
        </header>
        <main className="nexus-main-content">
          <div className="nexus-core"></div>
          <h1 className="nexus-title">
            <span>Unleash</span> <span>Your</span> <span>Saga</span>
          </h1>
          <p className="nexus-subtitle">
            Step into worlds of your own making. Where every choice carves a new
            reality.
          </p>
          <button onClick={handleLoginSignUpClick} className="nexus-cta-button">
            Enter the Nexus
          </button>
        </main>
        <footer className="nexus-footer">
          <p>
            &copy; {new Date().getFullYear()} AdventureSim. Venture forth
            responsibly.
          </p>
        </footer>
        <Outlet />
      </div>
    );
  }

  // --- Logged IN View: "The Genesis Deck" Dashboard ---
  const sessions = data?.getMyAdventureSessions || [];

  return (
    <>
      <div className="genesis-dashboard">
        {" "}
        {/* New main class for this design */}
        <header className="genesis-header">
          <div className="genesis-header-content">
            <img src={logo} alt="AdventureSim Logo" className="genesis-logo" />
            <h1 className="genesis-title-header">My Adventures</h1>
            <button
              onClick={handleLogoutClick}
              className="genesis-button genesis-button-outline"
            >
              Log Out
            </button>
          </div>
        </header>
        <main className="genesis-main">
          <div className="genesis-actions-bar">
            <button
              onClick={handleCreateClick}
              className="genesis-button genesis-button-primary genesis-create-button"
            >
              {/* Example Icon */}
              Launch New Chronicle
            </button>
          </div>

          {loading && (
            <div className="genesis-state-indicator genesis-loading">
              <div className="genesis-spinner"></div>
              <p>Summoning Your Adventures...</p>
            </div>
          )}
          {error && (
            <div className="genesis-state-indicator genesis-error">
              <p>
                A glitch in the matrix! Could not retrieve adventures. <br /> (
                {error.message})
              </p>
            </div>
          )}
          {!loading && !error && sessions.length === 0 && (
            <div className="genesis-state-indicator genesis-empty">
              <h2>Your Deck is Empty</h2>
              <p>No adventures yet. Time to craft your first epic!</p>
              <button
                onClick={handleCreateClick}
                className="genesis-button genesis-button-primary"
              >
                Start Your First Adventure
              </button>
            </div>
          )}

          {!loading && !error && sessions.length > 0 && (
            <div className="genesis-adventure-grid">
              {sessions.map((session) => (
                <article key={session.id} className="genesis-adventure-card">
                  <div className="card-body">
                    <h3 className="card-title">{session.title}</h3>
                    <div className="card-meta">
                      <span className="card-category-tag">
                        {session.category}
                      </span>
                      <span
                        className={`card-status-tag status-${
                          session.isActive ? "active" : "complete"
                        }`}
                      >
                        {session.isActive ? "In Progress" : "Completed"}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => handleViewStory(session.id)}
                      className="genesis-button genesis-button-icon genesis-button-secondary"
                      aria-label={`View ${session.title}`}
                    >
                      <span className="button-text-icon">View</span>
                    </button>
                    <button
                      onClick={() => handleDelete(session.id, session.title)}
                      className="genesis-button genesis-button-icon genesis-button-danger-outline"
                      disabled={deleteLoading}
                      aria-label={`Delete ${session.title}`}
                    >
                      <span className="button-text-icon">Delete</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
        <footer className="genesis-footer">
          <p>
            &copy; {new Date().getFullYear()} AdventureSim Corp. All Worlds
            Reserved.
          </p>
        </footer>
      </div>
      <Outlet />
    </>
  );
};

export default HomePage;
