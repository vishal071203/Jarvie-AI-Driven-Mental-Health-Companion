/**
 * Formats LLM-generated text with proper HTML styling
 * @param {string} text - Raw text from LLM
 * @returns {string} HTML formatted text
 */
export function formatLLMText(text) {
  if (!text) return '';
  
  // Remove [Jarvie]: prefix
  text = text.replace(/^\[Jarvie\]:\s*/i, '');
  
  return text
    // Replace bold formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Replace italic formatting
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Replace underscores with italics
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Replace newlines with line breaks
    .replace(/\n/g, '<br />');
}