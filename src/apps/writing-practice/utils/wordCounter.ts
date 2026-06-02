/**
 * Counts the number of words in a given string.
 * A word is defined as any sequence of characters separated by whitespace.
 */
export const countWords = (text: string | null | undefined): number => {
  if (!text) return 0;
  const trimmed = text.trim();
  if (trimmed === '') return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
};
