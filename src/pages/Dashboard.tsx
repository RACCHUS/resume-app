import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { Resume } from '../types/resume';
import { ResumePDF } from '../components/pdf/ResumePDF';
import { PDFViewer } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(user);
  const navigate = useNavigate();

  if (authLoading || profileLoading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in.</div>;

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h2>Welcome, {user.displayName}</h2>
      <button onClick={signOut}>Sign Out</button>
      <button
        onClick={() => navigate('/builder')}
        style={{
          marginLeft: 16,
          background: '#2d6cdf',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 18px',
          fontSize: 16,
        }}
      >
        Go to Resume Builder
      </button>
      <div style={{ marginTop: 24 }}>
        <h3>Your Resume Profile</h3>
        {profile ? (
          <div
            style={{
              border: '1px solid #eee',
              borderRadius: 8,
              background: '#fff',
              overflow: 'hidden',
              height: 600,
              maxWidth: 600,
            }}
          >
            <PDFViewer width="100%" height="100%">
              <ResumePDF resume={profile as Resume} />
            </PDFViewer>
          </div>
        ) : (
          <div>No profile found. Go to the Resume Builder to create your resume.</div>
        )}
      </div>
    </div>
  );
}
