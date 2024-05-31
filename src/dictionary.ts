import dictionary from "./assets/dictionary.json";

export function getWord() {
  return dictionary.words[Math.floor(Math.random() * dictionary.words.length)];
}

export function isWord(word: string) {
  return dictionary.words.includes(word.toUpperCase());
}
