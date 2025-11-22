import { auth, db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { updatePassword as fbUpdatePassword } from 'firebase/auth';

// Update the current user's password
export async function updatePassword(newPassword) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  await fbUpdatePassword(currentUser, newPassword);
}

// Fetch profile for a given userId.
// If it does not exist, create a basic one using email/name (when provided).
export async function fetchProfile(userId, email, name) {
  if (!userId) {
    throw new Error('Missing userId for fetchProfile');
  }

  const ref = doc(db, 'profiles', userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // Create a minimal profile
    const profileData = {
      id: userId,
      email: email || '',
      name: name || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, profileData);
    return profileData;
  }

  return { id: snap.id, ...snap.data() };
}
