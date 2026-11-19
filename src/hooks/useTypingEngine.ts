import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { generatePracticeText } from '../data/words';
import { getRandomQuote } from '../data/quotes';
import { useTypingTimer } from './useTypingTimer';
import { playKeySound } from '../utils/sound';
import type {
  PracticeConfig,
  PracticeSettings,
  QuoteItem,
  TestResult,
  TypingStats,
} from '../types/typing';

export type WordStatus = 'correct' | 'incorrect' | 'skipped' | 'pending';

interface UseTypingEngineProps {
  config: PracticeConfig;
  settings: PracticeSettings;
  customText: string;
}

function getModeDetailLabel(config: PracticeConfig): string {
  switch (config.mode) {
    case 'time':
      return `${config.timeLimit}s`;
    case 'words':
      return `${config.wordCount} words`;
    case 'quotes':
      return `${config.quoteLength} quote`;
    case 'zen':
      return 'free typing';
    case 'custom':
      return 'custom text';
  }
}

function evaluateSessionMetrics(
  targetWords: string[],
  typedWords: string[],
  currentWordIndex: number,
  currentInput: string,
  isZen: boolean,
  zenText: string,
  isFinished: boolean
) {
  if (isZen) {
    const total = zenText.length;
    const words = zenText.trim() ? zenText.trim().split(/\s+/).length : 0;
    return {
      correct: total,
      incorrect: 0,
      total,
      accuracy: total > 0 ? 100 : null,
      correctWordsCount: words,
      wordStatuses: [] as WordStatus[],
    };
  }

  let totalCorrect = 0;
  let totalIncorrect = 0;
  let correctWordsCount = 0;
  const wordStatuses: WordStatus[] = [];

  const totalWords = targetWords.length;

  for (let i = 0; i < totalWords; i++) {
    const target = targetWords[i];
    const isPastWord = i < currentWordIndex;
    const isActiveWord = i === currentWordIndex;

    if (isPastWord || (isActiveWord && isFinished)) {
      const typed = (isPastWord ? typedWords[i] : currentInput) ?? '';

      if (typed.length === 0) {
        wordStatuses.push('skipped');
      } else {
        let wordCorrect = 0;
        let wordIncorrect = 0;
        const minLen = Math.min(typed.length, target.length);

        for (let c = 0; c < minLen; c++) {
          if (typed[c] === target[c]) {
            wordCorrect++;
          } else {
            wordIncorrect++;
          }
        }

        if (typed.length > target.length) {
          wordIncorrect += typed.length - target.length;
        }

        totalCorrect += wordCorrect;
        totalIncorrect += wordIncorrect;

        const isFullyCorrect = typed === target;
        if (isFullyCorrect) {
          correctWordsCount++;
          if (i < totalWords - 1) {
            totalCorrect += 1;
          }
          wordStatuses.push('correct');
        } else {
          wordStatuses.push('incorrect');
        }
      }
    } else if (isActiveWord && !isFinished) {
      const typed = currentInput;
      let wordCorrect = 0;
      let wordIncorrect = 0;
      const minLen = Math.min(typed.length, target.length);

      for (let c = 0; c < minLen; c++) {
        if (typed[c] === target[c]) {
          wordCorrect++;
        } else {
          wordIncorrect++;
        }
      }

      if (typed.length > target.length) {
        wordIncorrect += typed.length - target.length;
      }

      totalCorrect += wordCorrect;
      totalIncorrect += wordIncorrect;
      wordStatuses.push('pending');
    } else {
      wordStatuses.push('pending');
    }
  }

  const totalChars = totalCorrect + totalIncorrect;
  const accuracy = totalChars > 0 ? (totalCorrect / totalChars) * 100 : null;

  return {
    correct: totalCorrect,
    incorrect: totalIncorrect,
    total: totalChars,
    accuracy,
    correctWordsCount,
    wordStatuses,
  };
}

export function useTypingEngine({
  config,
  settings,
  customText,
}: UseTypingEngineProps) {
  const [targetText, setTargetText] = useState<string>('');
  const [activeQuote, setActiveQuote] = useState<QuoteItem | null>(null);

  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [zenTypedText, setZenTypedText] = useState<string>('');

  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const isTimeMode = config.mode === 'time';
  const isZenMode = config.mode === 'zen';

  const targetWords = useMemo<string[]>(() => {
    if (!targetText) return [];
    return targetText.split(' ');
  }, [targetText]);

  const hasStarted = isZenMode
    ? zenTypedText.length > 0
    : currentWordIndex > 0 || currentInput.length > 0;

  const targetTextRef = useRef(targetText);
  const targetWordsRef = useRef(targetWords);
  const typedWordsRef = useRef(typedWords);
  const currentWordIndexRef = useRef(currentWordIndex);
  const currentInputRef = useRef(currentInput);
  const zenTypedTextRef = useRef(zenTypedText);
  const configRef = useRef(config);
  const activeQuoteRef = useRef(activeQuote);
  const settingsRef = useRef(settings);
  const isCompletedRef = useRef(isCompleted);

  const activeRunOptionsRef = useRef({
    difficulty: settings.difficulty,
    punctuation: config.punctuation,
    numbers: config.numbers,
  });

  useEffect(() => {
    targetTextRef.current = targetText;
    targetWordsRef.current = targetWords;
  }, [targetText, targetWords]);

  useEffect(() => {
    typedWordsRef.current = typedWords;
  }, [typedWords]);

  useEffect(() => {
    currentWordIndexRef.current = currentWordIndex;
  }, [currentWordIndex]);

  useEffect(() => {
    currentInputRef.current = currentInput;
  }, [currentInput]);

  useEffect(() => {
    zenTypedTextRef.current = zenTypedText;
  }, [zenTypedText]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    activeQuoteRef.current = activeQuote;
  }, [activeQuote]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    isCompletedRef.current = isCompleted;
  }, [isCompleted]);

  const finalizeTest = useCallback(
    (
      finalTypedWords: string[],
      finalWordIndex: number,
      finalInput: string,
      finalZenText: string,
      finalElapsedSeconds: number
    ) => {
      const currentConfig = configRef.current;
      const currentTargetWords = targetWordsRef.current;
      const zenMode = currentConfig.mode === 'zen';

      const metrics = evaluateSessionMetrics(
        currentTargetWords,
        finalTypedWords,
        finalWordIndex,
        finalInput,
        zenMode,
        finalZenText,
        true
      );

      const safeDuration = Math.max(finalElapsedSeconds, 0.1);
      const rawWpm =
        metrics.correct > 0
          ? metrics.correct / 5 / (safeDuration / 60)
          : 0;
      const wpm = Math.round(rawWpm);
      const rawAccuracy = metrics.accuracy ?? 0;
      const accuracy = Math.round(rawAccuracy);
      const netSpeed = Math.round(rawWpm * (rawAccuracy / 100));

      setIsCompleted(true);
      isCompletedRef.current = true;

      setResult({
        wpm,
        accuracy,
        netSpeed,
        correct: metrics.correct,
        incorrect: metrics.incorrect,
        total: metrics.total,
        durationSeconds: Math.round(finalElapsedSeconds),
        mode: currentConfig.mode,
        modeDetail: getModeDetailLabel(currentConfig),
        quoteAuthor:
          currentConfig.mode === 'quotes'
            ? activeQuoteRef.current?.author
            : undefined,
        completedAt: Date.now(),
        wordCount: metrics.correctWordsCount,
      });
    },
    []
  );

  const handleTimeExpire = useCallback(() => {
    if (isCompletedRef.current) return;
    finalizeTest(
      typedWordsRef.current,
      currentWordIndexRef.current,
      currentInputRef.current,
      zenTypedTextRef.current,
      configRef.current.timeLimit
    );
  }, [finalizeTest]);

  const timer = useTypingTimer({
    isCountdown: isTimeMode,
    durationSeconds: config.timeLimit,
    onExpire: handleTimeExpire,
  });

  const buildTargetForConfig = useCallback(
    (
      cfg: PracticeConfig,
      diff: PracticeSettings['difficulty'],
      custom: string,
      previousQuoteId?: string
    ): { text: string; quote: QuoteItem | null } => {
      switch (cfg.mode) {
        case 'time': {
          const initialWords = Math.max(120, cfg.timeLimit * 3);
          return {
            text: generatePracticeText({
              wordCount: initialWords,
              difficulty: diff,
              punctuation: cfg.punctuation,
              numbers: cfg.numbers,
            }),
            quote: null,
          };
        }
        case 'words': {
          return {
            text: generatePracticeText({
              wordCount: cfg.wordCount,
              difficulty: diff,
              punctuation: cfg.punctuation,
              numbers: cfg.numbers,
            }),
            quote: null,
          };
        }
        case 'quotes': {
          const quote = getRandomQuote(cfg.quoteLength, previousQuoteId);
          return {
            text: quote.text,
            quote,
          };
        }
        case 'zen': {
          return { text: '', quote: null };
        }
        case 'custom': {
          const normalized = custom.replace(/\s+/g, ' ').trim();
          return {
            text: normalized,
            quote: null,
          };
        }
      }
    },
    []
  );

  const newTest = useCallback(() => {
    timer.reset(config.timeLimit);
    setCurrentWordIndex(0);
    setTypedWords([]);
    setCurrentInput('');
    setZenTypedText('');
    setIsCompleted(false);
    isCompletedRef.current = false;
    setResult(null);

    activeRunOptionsRef.current = {
      difficulty: settings.difficulty,
      punctuation: config.punctuation,
      numbers: config.numbers,
    };

    const { text, quote } = buildTargetForConfig(
      config,
      settings.difficulty,
      customText,
      activeQuote?.id
    );
    setTargetText(text);
    setActiveQuote(quote);
  }, [
    timer,
    config,
    settings.difficulty,
    customText,
    activeQuote?.id,
    buildTargetForConfig,
  ]);

  const tryAgain = useCallback(() => {
    timer.reset(config.timeLimit);
    setCurrentWordIndex(0);
    setTypedWords([]);
    setCurrentInput('');
    setZenTypedText('');
    setIsCompleted(false);
    isCompletedRef.current = false;
    setResult(null);
  }, [timer, config.timeLimit]);

  useEffect(() => {
    timer.reset(config.timeLimit);
    setCurrentWordIndex(0);
    setTypedWords([]);
    setCurrentInput('');
    setZenTypedText('');
    setIsCompleted(false);
    isCompletedRef.current = false;
    setResult(null);

    activeRunOptionsRef.current = {
      difficulty: settings.difficulty,
      punctuation: config.punctuation,
      numbers: config.numbers,
    };

    const { text, quote } = buildTargetForConfig(
      config,
      settings.difficulty,
      customText
    );
    setTargetText(text);
    setActiveQuote(quote);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.mode,
    config.timeLimit,
    config.wordCount,
    config.quoteLength,
    customText,
  ]);

  useEffect(() => {
    if (!hasStarted && !isCompleted && (config.mode === 'time' || config.mode === 'words')) {
      activeRunOptionsRef.current = {
        difficulty: settings.difficulty,
        punctuation: config.punctuation,
        numbers: config.numbers,
      };
      const { text } = buildTargetForConfig(
        config,
        settings.difficulty,
        customText
      );
      setTargetText(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.punctuation, config.numbers, settings.difficulty]);

  useEffect(() => {
    if (
      isTimeMode &&
      !isCompleted &&
      targetWords.length > 0 &&
      currentWordIndex > targetWords.length - 25
    ) {
      const extraWords = generatePracticeText({
        wordCount: 60,
        difficulty: activeRunOptionsRef.current.difficulty,
        punctuation: activeRunOptionsRef.current.punctuation,
        numbers: activeRunOptionsRef.current.numbers,
      });
      setTargetText((prev) => `${prev} ${extraWords}`);
    }
  }, [isTimeMode, isCompleted, currentWordIndex, targetWords.length]);

  const currentMetrics = useMemo(() => {
    return evaluateSessionMetrics(
      targetWords,
      typedWords,
      currentWordIndex,
      currentInput,
      isZenMode,
      zenTypedText,
      isCompleted
    );
  }, [
    targetWords,
    typedWords,
    currentWordIndex,
    currentInput,
    isZenMode,
    zenTypedText,
    isCompleted,
  ]);

  const stats = useMemo<TypingStats>(() => {
    let liveWpm: number | null = null;
    if (hasStarted) {
      if (result) {
        liveWpm = result.wpm;
      } else if (timer.elapsedSeconds >= 0.5) {
        liveWpm =
          currentMetrics.correct > 0
            ? Math.round(
                currentMetrics.correct / 5 / (timer.elapsedSeconds / 60)
              )
            : 0;
      } else {
        liveWpm = 0;
      }
    }

    return {
      wpm: liveWpm,
      accuracy: currentMetrics.accuracy,
      correct: currentMetrics.correct,
      incorrect: currentMetrics.incorrect,
      total: currentMetrics.total,
    };
  }, [
    hasStarted,
    result,
    timer.elapsedSeconds,
    currentMetrics,
  ]);

  const handleWordChange = useCallback(
    (val: string) => {
      if (isCompleted || isZenMode) return;

      if (!hasStarted && val.length > 0) {
        timer.start();
      }

      const currentTargetWord = targetWords[currentWordIndex] || '';

      if (settings.sound) {
        if (val.length > currentInput.length) {
          const lastCharIdx = val.length - 1;
          const isError =
            lastCharIdx >= currentTargetWord.length ||
            val[lastCharIdx] !== currentTargetWord[lastCharIdx];
          playKeySound(isError);
        } else {
          playKeySound(false);
        }
      }

      setCurrentInput(val);

      if (
        !isTimeMode &&
        currentWordIndex === targetWords.length - 1 &&
        val === currentTargetWord
      ) {
        const finalElapsed = timer.stop();
        finalizeTest(
          typedWords,
          currentWordIndex,
          val,
          zenTypedText,
          finalElapsed
        );
      }
    },
    [
      isCompleted,
      isZenMode,
      hasStarted,
      timer,
      targetWords,
      currentWordIndex,
      settings.sound,
      currentInput.length,
      isTimeMode,
      finalizeTest,
      typedWords,
      zenTypedText,
    ]
  );

  const handleSpacePress = useCallback(() => {
    if (isCompleted || isZenMode) return;

    if (!hasStarted) {
      timer.start();
    }

    if (settings.sound) {
      playKeySound(false);
    }

    const nextTypedWords = [...typedWords];
    nextTypedWords[currentWordIndex] = currentInput;

    const isLastWord = currentWordIndex >= targetWords.length - 1;

    if (isLastWord) {
      if (!isTimeMode) {
        const finalElapsed = timer.stop();
        finalizeTest(
          nextTypedWords,
          currentWordIndex,
          currentInput,
          zenTypedText,
          finalElapsed
        );
        return;
      }
    }

    setTypedWords(nextTypedWords);
    setCurrentWordIndex((prev) => prev + 1);
    setCurrentInput('');
  }, [
    isCompleted,
    isZenMode,
    hasStarted,
    timer,
    settings.sound,
    typedWords,
    currentWordIndex,
    currentInput,
    targetWords.length,
    isTimeMode,
    finalizeTest,
    zenTypedText,
  ]);

  const handleBackspaceAtWordStart = useCallback(() => {
    if (isCompleted || isZenMode || currentWordIndex === 0) return;

    if (settings.sound) {
      playKeySound(false);
    }

    const prevIndex = currentWordIndex - 1;
    const restoredText = typedWords[prevIndex] ?? '';

    const nextTypedWords = [...typedWords];
    nextTypedWords.splice(prevIndex, 1);

    setTypedWords(nextTypedWords);
    setCurrentWordIndex(prevIndex);
    setCurrentInput(restoredText);
  }, [
    isCompleted,
    isZenMode,
    currentWordIndex,
    settings.sound,
    typedWords,
  ]);

  const handleZenChange = useCallback(
    (val: string) => {
      if (isCompleted || !isZenMode) return;

      if (!hasStarted && val.length > 0) {
        timer.start();
      }

      if (settings.sound && val.length > zenTypedText.length) {
        playKeySound(false);
      }

      setZenTypedText(val);
    },
    [isCompleted, isZenMode, hasStarted, timer, settings.sound, zenTypedText.length]
  );

  const handleTextChange = useCallback(
    (val: string) => {
      if (isZenMode) {
        handleZenChange(val);
      } else {
        handleWordChange(val);
      }
    },
    [isZenMode, handleZenChange, handleWordChange]
  );

  const finishZenTest = useCallback(() => {
    if (!isZenMode || isCompleted || zenTypedText.length === 0) return;
    const finalElapsed = timer.stop();
    finalizeTest([], 0, '', zenTypedText, finalElapsed);
  }, [isZenMode, isCompleted, zenTypedText, timer, finalizeTest]);

  const syntheticTypedText = useMemo(() => {
    if (isZenMode) return zenTypedText;
    const pastWords = typedWords.slice(0, currentWordIndex);
    if (currentInput) {
      pastWords.push(currentInput);
    }
    return pastWords.join(' ');
  }, [isZenMode, zenTypedText, typedWords, currentWordIndex, currentInput]);

  return {
    targetText,
    targetWords,
    activeQuote,
    currentWordIndex,
    typedWords,
    currentInput,
    zenTypedText,
    wordStatuses: currentMetrics.wordStatuses,
    typedText: syntheticTypedText,
    currentIndex: syntheticTypedText.length,
    stats,
    isCompleted,
    hasStarted,
    result,
    remainingSeconds: timer.remainingSeconds,
    elapsedSeconds: timer.elapsedSeconds,
    isTimerRunning: timer.isRunning,
    handleWordChange,
    handleSpacePress,
    handleBackspaceAtWordStart,
    handleZenChange,
    handleTextChange,
    finishZenTest,
    newTest,
    tryAgain,
  };
}
