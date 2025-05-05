import { useNavigate, Outlet } from 'react-router-dom';
import './styles/homepage.css';

const HomePage = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleLoginSignUpClick = () => {
    navigate('/logIn-signUp'); // Navigate to the login-signup page
  };

  const App = () => {
    return (
      <div>
        <header>
          <h1>AdventureSim</h1>
        </header>
        <main>
          {/* Button to navigate to the login-signup page */}
          <button onClick={handleLoginSignUpClick}>Go to Login/Sign Up</button>
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