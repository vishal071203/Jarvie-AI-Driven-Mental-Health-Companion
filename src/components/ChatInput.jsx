import React from 'react';
import { Send, Mic } from 'lucide-react';

export default function ChatInput({ input, setInput, handleSend, isLoading }) {
  return (
    <form onSubmit={handleSend} className="relative flex items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isLoading ? 'Please wait...' : 'Type your message...'}
        disabled={isLoading}
        className="flex-1 pr-24 pl-4 py-2 bg-gray-700 text-gray-200 border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 placeholder-gray-400"
      />
      <div className="absolute right-2 flex space-x-1">
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
        >
          <Mic className="h-5 w-5" />
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}