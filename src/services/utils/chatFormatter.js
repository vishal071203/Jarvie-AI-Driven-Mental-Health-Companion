import { countTokens } from './tokenizer';

export function formatChatHistory(chatHistory = [], maxTokens) {
  if (!chatHistory || !Array.isArray(chatHistory) || chatHistory.length === 0) {
    return { trimmedHistory: '', remainingTokens: maxTokens };
  }

  try {
    const messages = [...chatHistory].reverse();
    const formattedMessages = [];
    let totalTokens = 0;

    for (const msg of messages) {
      if (!msg || !msg.content || !msg.sender) {
        continue; // Skip invalid messages
      }
      
      const formattedMsg = `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content}`;
      const msgTokens = countTokens(formattedMsg);

      if (totalTokens + msgTokens <= maxTokens) {
        formattedMessages.unshift(formattedMsg);
        totalTokens += msgTokens;
      } else {
        break;
      }
    }

    return {
      trimmedHistory: formattedMessages.join('\n'),
      remainingTokens: maxTokens - totalTokens
    };
  } catch (error) {
    console.error('Error formatting chat history:', error);
    return { trimmedHistory: '', remainingTokens: maxTokens };
  }
}