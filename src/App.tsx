import React from 'react';
import AppRouter from './router';
import './styles/global.css';

function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--secondary-color)' }}>
      <AppRouter />
    </div>
  );
}

export default App;
