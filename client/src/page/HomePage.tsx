import React from 'react';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to AdventureSim</h1>
      <p>Explore!, Discover!, Enjoy!</p>
      <button onClick={() => alert('Start your journey!')}>Get Started</button>
    </div>
  );
};

export default HomePage;