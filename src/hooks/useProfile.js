import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchProfile, updatePassword } from '../services/profileService';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const data = await fetchProfile(user.id, user.email, user.user_metadata?.name || '');
      setProfile(data);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    try {
      await updatePassword(newPassword);
      return true;
    } catch (err) {
      throw err;
    }
  };

  return {
    profile,
    isLoading,
    error,
    changePassword
  };
}