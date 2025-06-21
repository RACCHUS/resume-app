import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Resume } from '../types/resume';

const defaultResume: Resume = {
  header: { name: '', contactInfo: [] },
  summary: '',
  work: [],
  education: [],
  certifications: [],
  skills: [],
  customSections: [],
  sectionOrder: ['header', 'summary', 'work', 'education', 'certifications', 'skills'],
  sectionVisibility: {
    header: true,
    summary: true,
    work: true,
    education: true,
    certifications: true,
    skills: true,
  },
};

export function useUserProfile(user: User | null) {
  const [profile, setProfile] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    setLoading(true);
    const fetchProfile = async () => {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data() as Resume);
      } else {
        // If no profile, initialize with default
        setProfile(defaultResume);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const saveProfile = async (data: Resume) => {
    if (!user) return;
    setLoading(true);
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, data);
    setProfile(data);
    setLoading(false);
  };

  return { profile, loading, saveProfile };
}
