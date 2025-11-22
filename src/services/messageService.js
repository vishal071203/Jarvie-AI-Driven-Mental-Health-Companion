// src/services/messageService.js
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./firebase";

// Save a message in: users/{userId}/conversations/{messageId}
export async function saveMessage(userId, content, sender) {
  if (!userId) throw new Error("saveMessage: userId is required");

  const messagesRef = collection(db, "users", userId, "conversations");

  const newMsg = {
    userId,
    content,
    sender, // 'user' or 'ai'
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(messagesRef, newMsg);
  return {
    id: docRef.id,
    ...newMsg,
  };
}

// Fetch messages for a user, ordered by time
export async function fetchMessages(userId) {
  if (!userId) throw new Error("fetchMessages: userId is required");

  const messagesRef = collection(db, "users", userId, "conversations");

  const q = query(messagesRef, orderBy("createdAt", "asc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
