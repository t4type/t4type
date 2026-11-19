import { useState, useEffect, useCallback } from 'react';
import type {
  PracticeConfig,
  PracticeMode,
  TimeOption,
  WordsOption,
  QuoteLength,
} from '../types/typing';

const CONFIG_STORAGE_KEY = 't4type-config';

const DEFAULT_CONFIG: PracticeConfig = {
  mode: 'time',
  timeLimit: 30,
  wordCount: 25,
  quoteLength: 'medium',
  punctuation: false,
  numbers: false,
};

function loadStoredConfig(): PracticeConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as Partial<PracticeConfig>;

    const validModes: PracticeMode[] = ['time', 'words', 'quotes', 'zen', 'custom'];
    const validTimes: TimeOption[] = [15, 30, 60, 120];
    const validWords: WordsOption[] = [10, 25, 50, 100];
    const validQuotes: QuoteLength[] = ['short', 'medium', 'long'];

    return {
      mode: parsed.mode && validModes.includes(parsed.mode) ? parsed.mode : DEFAULT_CONFIG.mode,
      timeLimit:
        parsed.timeLimit && validTimes.includes(parsed.timeLimit)
          ? parsed.timeLimit
          : DEFAULT_CONFIG.timeLimit,
      wordCount:
        parsed.wordCount && validWords.includes(parsed.wordCount)
          ? parsed.wordCount
          : DEFAULT_CONFIG.wordCount,
      quoteLength:
        parsed.quoteLength && validQuotes.includes(parsed.quoteLength)
          ? parsed.quoteLength
          : DEFAULT_CONFIG.quoteLength,
      punctuation:
        typeof parsed.punctuation === 'boolean'
          ? parsed.punctuation
          : DEFAULT_CONFIG.punctuation,
      numbers:
        typeof parsed.numbers === 'boolean' ? parsed.numbers : DEFAULT_CONFIG.numbers,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function usePracticeConfig() {
  const [config, setConfig] = useState<PracticeConfig>(loadStoredConfig);

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch {
      void 0;
    }
  }, [config]);

  const setMode = useCallback((mode: PracticeMode) => {
    setConfig((prev) => ({ ...prev, mode }));
  }, []);

  const setTimeLimit = useCallback((timeLimit: TimeOption) => {
    setConfig((prev) => ({ ...prev, timeLimit }));
  }, []);

  const setWordCount = useCallback((wordCount: WordsOption) => {
    setConfig((prev) => ({ ...prev, wordCount }));
  }, []);

  const setQuoteLength = useCallback((quoteLength: QuoteLength) => {
    setConfig((prev) => ({ ...prev, quoteLength }));
  }, []);

  const togglePunctuation = useCallback(() => {
    setConfig((prev) => ({ ...prev, punctuation: !prev.punctuation }));
  }, []);

  const toggleNumbers = useCallback(() => {
    setConfig((prev) => ({ ...prev, numbers: !prev.numbers }));
  }, []);

  return {
    config,
    setMode,
    setTimeLimit,
    setWordCount,
    setQuoteLength,
    togglePunctuation,
    toggleNumbers,
  };
}

