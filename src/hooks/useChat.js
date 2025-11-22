// src/hooks/useChat.js
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { saveMessage, fetchMessages } from "../services/messageService";
import { generateResponse } from "../services/api/gemini";

export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const chatHistory = await fetchMessages(user.id);

      if (Array.isArray(chatHistory)) {
        setMessages(
          chatHistory.map((msg) => ({
            id: msg.id,
            text: msg.content,
            sender: msg.sender,
          }))
        );
      }

      setError(null);
    } catch (err) {
      console.error("Error loading messages:", err);
      setError("Failed to load chat history. Please try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!user || !text.trim() || isLoading) return;
    const userName = user.user_metadata?.name || "friend";

if (/^\s*(hi|hello|hey)\s*$/i.test(text)) {
  // save user message
  const userMessage = await saveMessage(user.id, text, "user");

  setMessages((prev) => [
    ...prev,
    {
      id: userMessage.id,
      text: userMessage.content,
      sender: "user",
    },
  ]);

  const greeting = `Hello ${userName}!!`;

  const savedAiMessage = await saveMessage(user.id, greeting, "ai");

  setMessages((prev) => [
    ...prev,
    {
      id: savedAiMessage.id,
      text: savedAiMessage.content,
      sender: "ai",
    },
  ]);

  return;
}


    setIsLoading(true);
    setError(null);

    try {
      const userMessage = await saveMessage(user.id, text, "user");

      setMessages((prev) => [
        ...prev,
        {
          id: userMessage.id,
          text: userMessage.content,
          sender: "user",
        },
      ]);

      const chatHistory = [
        ...messages.map((msg) => ({
          content: msg.text,
          sender: msg.sender,
        })),
        { content: text, sender: "user" },
      ];

      const aiResponse = await generateResponse(
        text,
        chatHistory,
        user.user_metadata?.name || ""
      );

      const savedAiMessage = await saveMessage(user.id, aiResponse, "ai");

      setMessages((prev) => [
        ...prev,
        {
          id: savedAiMessage.id,
          text: savedAiMessage.content,
          sender: "ai",
        },
      ]);
    } catch (err) {
      console.error("Error in chat:", err);
      setError(
        err.message ||
          "Failed to generate response. Please try again or check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError: () => setError(null),
    refreshMessages: loadMessages,
  };
}
