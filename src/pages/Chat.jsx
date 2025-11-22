import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../hooks/useChat';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import ChatSidebar from '../components/ChatSidebar';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { messages, isLoading, error, sendMessage, clearError, refreshMessages } = useChat();
  const [input, setInput] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleToggleSidebar = () => setSidebarOpen(prev => !prev);
    window.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggleSidebar', handleToggleSidebar);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageText = input;
    setInput('');
    await sendMessage(messageText);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4">
      <ChatSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onNavigate={navigate}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-800 relative ml-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-500 text-sm">{error}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={clearError}
                  className="text-gray-400 hover:text-gray-200 text-sm"
                >
                  Dismiss
                </button>
                <button 
                  onClick={refreshMessages}
                  className="flex items-center text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </button>
              </div>
            </div>
          )}
          
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <h3 className="text-xl font-semibold mb-2">
                  Hello {user?.user_metadata?.name || 'there'}!
                </h3>
                <p>How can I help you today?</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}