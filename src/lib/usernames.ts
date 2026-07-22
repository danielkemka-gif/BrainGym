const adjectives = [
  "brave", "calm", "eager", "fair", "glad", "happy", "keen", "kind",
  "merry", "nice", "proud", "quick", "sharp", "smart", "swift", "warm",
  "bold", "cool", "deep", "fast", "good", "light", "new", "pure",
  "rare", "safe", "true", "vast", "wise", "young",
];

const nouns = [
  "fox", "owl", "bear", "wolf", "hawk", "lion", "deer", "lynx",
  "star", "moon", "sun", "wave", "tree", "leaf", "rain", "wind",
  "fire", "bolt", "crest", "drift", "glow", "peak", "ridge", "vale",
  "hawk", "tern", "swift", "crow", "dove", "wren",
];

export function generateUsername(name: string): string {
  const clean = name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8);
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 900 + 100);
  return `${clean}${adj}${num}`;
}

export function generateUsernameSuggestions(name: string): string[] {
  const suggestions: string[] = [];
  const clean = name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8);

  for (let i = 0; i < 5; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 900 + 100);

    if (i === 0) suggestions.push(`${clean}${adj}${num}`);
    else if (i === 1) suggestions.push(`${clean}${noun}${num}`);
    else if (i === 2) suggestions.push(`${adj}${clean}${num}`);
    else if (i === 3) suggestions.push(`${clean}${adj}${noun}`);
    else suggestions.push(`${noun}${clean}${num}`);
  }

  return [...new Set(suggestions)];
}
