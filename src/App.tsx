import React, { useState } from 'react';
import AppRouter from './router';
import './styles/global.css';
import './styles/darkmode.css';

function App() {
  // Dark mode enabled by default
  const [dark, setDark] = useState(true);

  return (
    <div className={dark ? 'dark' : ''} style={{ minHeight: '100vh', background: 'var(--secondary-color)' }}>
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
        <button onClick={() => setDark(d => !d)}>
          {dark ? '☾ Dark Mode' : '☀ Light Mode'}
        </button>
      </div>
      <AppRouter dark={dark} />
    </div>
  );
}

export default App;
