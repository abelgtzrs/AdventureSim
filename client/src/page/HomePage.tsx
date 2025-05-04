import { Link, useNavigate, Outlet } from 'react-router-dom';
import './styles/homepage.css';
const HomePage = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const App = () => {
    return (
      <div>
        <header>
          <h1>AdventureSim</h1>
          <nav>
            <Link to="/">Home</Link>
            {/* Removed AuthPage link from navigation */}
          </nav>
        </header>
        <main>
          {/* Renders the child routes */}
          <Outlet />
        </main>
        <footer>
          <p>&copy; 2025 AdventureSim. All rights reserved.</p>
        </footer>
      </div>
    );
  };
  
 

  return <App />;
};

export default HomePage;