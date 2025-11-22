// Simple token counting implementation
// This is a basic approximation - for production, use a proper tokenizer
export function countTokens(text) {
  if (!text) return 0;
  
  // Split on whitespace and punctuation
  const words = text.trim().split(/[\s,.!?;:'"()\[\]{}|\\/<>]+/);
  // Filter out empty strings
  const tokens = words.filter(word => word.length > 0);
  
  // Rough estimate: average English word is 4-5 characters
  // Add 30% overhead for special tokens and subword tokenization
  return Math.ceil(tokens.length * 1.3);
}