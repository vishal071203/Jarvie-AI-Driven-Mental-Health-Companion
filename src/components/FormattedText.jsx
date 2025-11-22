import React from 'react';
import { formatLLMText } from '../utils/textFormatting';

export default function FormattedText({ text }) {
  const formattedContent = formatLLMText(text);
  
  return (
    <div 
      className="formatted-text"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
}