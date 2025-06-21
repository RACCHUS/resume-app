import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { user, loading, signIn, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
      <h1>Resume App</h1>
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={signIn} style={{ padding: '10px 20px', fontSize: 18, borderRadius: 8, background: '#2d6cdf', color: '#fff', border: 'none' }}>
          Sign in with Google
        </button>
      )}
    </div>
  );
}
