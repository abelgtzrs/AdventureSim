import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleButtonClick = () => {
    navigate('/AuthPage'); // Navigate to the AuthPage route
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to AdventureSim</h1>
      <p>Explore!, Discover!, Enjoy!</p>
      <button onClick={handleButtonClick}>Start your journey!</button>
    </div>
  );
};

export default HomePage;