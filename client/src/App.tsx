import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <header style={{ padding: '10px', backgroundColor: '#f4f4f4', textAlign: 'center' }}>
        <h1>AdventureSim</h1>
        <nav>
          <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
          {/* Removed AuthPage link from navigation */}
        </nav>
      </header>
      <main style={{ padding: '20px' }}>
        {/* Renders the child routes */}
        <Outlet />
      </main>
      <footer style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f4f4f4' }}>
        <p>&copy; 2025 AdventureSim. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;