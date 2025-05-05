import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MY_ADVENTURE_SESSIONS } from "../graphql/queries";
import { DELETE_ADVENTURE } from "../graphql/mutations";
import "./styles/homepage.css";
import logo from "../assets/logo.png";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("id_token");

  const { loading, error, data, refetch } = useQuery(
    GET_MY_ADVENTURE_SESSIONS,
    {
      skip: !token, // only run if logged in
    }
  );

  const [deleteAdventure] = useMutation(DELETE_ADVENTURE);

  const handleLoginSignUpClick = () => {
    navigate("/logIn-signUp");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("id_token");
    window.location.reload(); // force rerender after logout
  };

  const handleCreateClick = () => {
    navigate("/create");
  };

  const handleViewStory = (id: string) => {
    navigate(`/adventure/${id}`);
  };

  const handleDelete = async (id: string) => {
    await deleteAdventure({ variables: { sessionId: id } });
    refetch();
  };

  if (!token) {
    // --- Logged OUT View ---
    return (
      <div className="homepage">
        <header>
          <h1>Your Story • Your Choice • You Choose</h1>
        </header>
        <main>
          <img src={logo} alt="AdventureSim Logo" className="homepage-logo" />
          <button onClick={handleLoginSignUpClick}>Go to Login/Sign Up</button>
        </main>
        <footer>
          <p>&copy; 2025 AdventureSim. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // --- Logged IN View (Dashboard) ---
  return (
    <>
      <div className="dashboard">
        <header>
          <h1>Adventure Dashboard</h1>
          <button onClick={handleLogoutClick}>Log Out</button>
        </header>

        <main>
          <button onClick={handleCreateClick}>+ Create New Adventure</button>

          {loading && <p>Loading your stories...</p>}
          {error && <p>Error loading sessions.</p>}

          <div className="adventure-list">
            {data?.getMyAdventureSessions.map((session: any) => (
              <div key={session.id} className="adventure-card">
                <h3>{session.title}</h3>
                <p>Category: {session.category}</p>
                <p>Status: {session.isActive ? "In Progress" : "Complete"}</p>
                <button onClick={() => handleViewStory(session.id)}>
                  ▶ View
                </button>
                <button onClick={() => handleDelete(session.id)}>
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        </main>

        <footer>
          <p>&copy; 2025 AdventureSim. All rights reserved.</p>
        </footer>
      </div>

      {/* This ensures nested routes like /logIn-signUp render correctly */}
      <Outlet />
    </>
  );
};

export default HomePage;
