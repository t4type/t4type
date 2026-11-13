export type CharacterState = 'untyped' | 'correct' | 'incorrect';

export type PracticeMode = 'time' | 'words' | 'quotes' | 'zen' | 'custom';

export type TimeOption = 15 | 30 | 60 | 120;
export type WordsOption = 10 | 25 | 50 | 100;
export type QuoteLength = 'short' | 'medium' | 'long';

export type FontSize = 'small' | 'medium' | 'large';
export type Difficulty = 'easy' | 'normal' | 'advanced';

export interface PracticeSettings {
  fontSize: FontSize;
  difficulty: Difficulty;
  sound: boolean;
}

export interface PracticeConfig {
  mode: PracticeMode;
  timeLimit: TimeOption;
  wordCount: WordsOption;
  quoteLength: QuoteLength;
  punctuation: boolean;
  numbers: boolean;
}

export interface QuoteItem {
  id: string;
  text: string;
  author: string;
  length: QuoteLength;
}

export interface TypingStats {
  wpm: number | null; // null before typing starts or before meaningful elapsed time
  accuracy: number | null; // null when total is 0
  correct: number;
  incorrect: number;
  total: number;
}

export interface TestResult {
  wpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  total: number;
  durationSeconds: number;
  mode: PracticeMode;
  modeDetail: string;
  quoteAuthor?: string;
  completedAt: number;
  wordCount: number;
}
