import React from 'react';
import FormattedText from './FormattedText';

export default function ChatMessage({ message }) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg py-2 px-4 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-700 text-gray-200'
        }`}
      >
        {isUser ? (
          <p>{message.text}</p>
        ) : (
          <FormattedText text={message.text} />
        )}
      </div>
    </div>
  );
}