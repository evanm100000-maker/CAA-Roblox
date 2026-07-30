export const badWords = [
  "fuck", "shit", "bitch", "nigger", "nigga", "asshole", 
  "cunt", "dick", "pussy", "faggot", "slut", "whore", 
  "bastard", "motherfucker", "crap", "bullshit"
];

export const containsProfanity = (text) => {
  if (!text) return false;
  
  // Normalize text (lowercase, remove punctuation)
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, '');
  const words = normalizedText.split(/\s+/);
  
  for (const word of words) {
    if (badWords.includes(word)) {
      return true;
    }
  }
  return false;
};
