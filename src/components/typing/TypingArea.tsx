import React, { useRef, useEffect, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { TypingCharacter } from './TypingCharacter';
import { initAudioContext } from '../../utils/sound';
import type { FontSize } from '../../types/typing';
import type { WordStatus } from '../../hooks/useTypingEngine';

interface TypingAreaProps {
  targetText: string;
  targetWords?: string[];
  typedWords?: string[];
  currentWordIndex?: number;
  currentInput?: string;
  wordStatuses?: WordStatus[];
  typedText: string;
  currentIndex: number;
  isCompleted: boolean;
  isZenMode: boolean;
  zenTypedText?: string;
  quoteAuthor?: string;
  fontSize: FontSize;
  isModalOpen: boolean;
  onWordChange?: (val: string) => void;
  onSpacePress?: () => void;
  onBackspaceAtWordStart?: () => void;
  onZenChange?: (val: string) => void;
  onTextChange?: (val: string) => void;
  onRestart: () => void;
  onFocusChange?: (focused: boolean) => void;
  headerSlot?: React.ReactNode;
  focusTrigger?: number;
}

const FONT_SIZE_CLASSES: Record<FontSize, string> = {
  small: 'text-[18px] sm:text-[21px] md:text-[23px] leading-[1.65] sm:leading-[1.7]',
  medium:
    'text-[20px] sm:text-[23px] md:text-[26px] lg:text-[28px] leading-[1.65] sm:leading-[1.7]',
  large:
    'text-[22px] sm:text-[27px] md:text-[32px] lg:text-[34px] leading-[1.6] sm:leading-[1.65]',
};

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  targetWords,
  typedWords = [],
  currentWordIndex = 0,
  currentInput = '',
  wordStatuses = [],
  typedText,
  currentIndex,
  isCompleted,
  isZenMode,
  zenTypedText = '',
  quoteAuthor,
  fontSize,
  isModalOpen,
  onWordChange,
  onSpacePress,
  onBackspaceAtWordStart,
  onZenChange,
  onTextChange,
  onRestart,
  onFocusChange,
  headerSlot,
  focusTrigger = 0,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const textViewportRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);
  const tabTimeoutRef = useRef<number | null>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [tabArmed, setTabArmed] = useState(false);

  const updateFocus = (focused: boolean) => {
    setIsFocused(focused);
    onFocusChange?.(focused);
  };

  // Focus input automatically when mounting, closing modals, or triggered externally
  useEffect(() => {
    if (!isModalOpen && !isCompleted) {
      inputRef.current?.focus();
    }
  }, [isModalOpen, isCompleted, focusTrigger]);

  // Reset scroll when targetText or typedText clears
  useEffect(() => {
    if (typedText.length === 0 && currentWordIndex === 0 && textViewportRef.current) {
      textViewportRef.current.scrollTop = 0;
    }
  }, [typedText.length, currentWordIndex, targetText]);

  // Smoothly keep active character line visible inside scrollable viewport
  useEffect(() => {
    const container = textViewportRef.current;
    const activeEl = activeCharRef.current;
    if (!container || !activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    const relativeTop = activeRect.top - containerRect.top + container.scrollTop;
    const lineHeight = activeRect.height || 36;
    const targetTop = Math.max(0, relativeTop - lineHeight);

    if (
      activeRect.bottom > containerRect.bottom - 8 ||
      activeRect.top < containerRect.top + 8
    ) {
      container.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    }
  }, [currentWordIndex, currentInput, currentIndex, targetText]);

  useEffect(() => {
    return () => {
      if (tabTimeoutRef.current !== null) {
        window.clearTimeout(tabTimeoutRef.current);
      }
    };
  }, []);

  const ensureCursorAtEnd = () => {
    if (inputRef.current) {
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  };

  const handleContainerClick = () => {
    if (isCompleted) return;
    initAudioContext();
    inputRef.current?.focus();
    ensureCursorAtEnd();
  };

  const triggerRestart = () => {
    setTabArmed(false);
    if (tabTimeoutRef.current !== null) {
      window.clearTimeout(tabTimeoutRef.current);
      tabTimeoutRef.current = null;
    }
    onRestart();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    initAudioContext();

    // Restart shortcut: Tab + Enter
    if (e.key === 'Tab') {
      e.preventDefault();
      setTabArmed(true);
      if (tabTimeoutRef.current !== null) {
        window.clearTimeout(tabTimeoutRef.current);
      }
      tabTimeoutRef.current = window.setTimeout(() => {
        setTabArmed(false);
      }, 2000);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (tabArmed) {
        triggerRestart();
      }
      return;
    }

    if (tabArmed) {
      setTabArmed(false);
    }

    // Prevent navigation keys from displacing hidden input cursor
    if (
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Home' ||
      e.key === 'End'
    ) {
      e.preventDefault();
      return;
    }

    // Word-based navigation for standard typing modes
    if (!isZenMode) {
      // Space key: immediately advance to next word
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        onSpacePress?.();
        return;
      }

      // Backspace at the beginning of empty word: return to previous word
      if (e.key === 'Backspace' && currentInput.length === 0) {
        e.preventDefault();
        onBackspaceAtWordStart?.();
        return;
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (isZenMode) {
      onZenChange?.(val);
      onTextChange?.(val);
      return;
    }

    // Check for space key typed on mobile virtual keyboards
    if (val.endsWith(' ')) {
      const trimmedVal = val.slice(0, -1);
      if (trimmedVal !== currentInput) {
        onWordChange?.(trimmedVal);
      }
      onSpacePress?.();
      return;
    }

    if (val.includes(' ')) {
      const parts = val.split(' ');
      onWordChange?.(parts[0]);
      onSpacePress?.();
      return;
    }

    if (onWordChange) {
      onWordChange(val);
    } else {
      onTextChange?.(val);
    }
  };

  const resolvedTargetWords = useMemo<string[]>(() => {
    if (targetWords && targetWords.length > 0) return targetWords;
    if (!targetText) return [];
    return targetText.split(' ');
  }, [targetWords, targetText]);

  const zenWords = useMemo<string[]>(() => {
    const text = zenTypedText || typedText;
    if (!isZenMode || !text) return [];
    return text.split(' ');
  }, [isZenMode, zenTypedText, typedText]);

  const fontSizeClass = FONT_SIZE_CLASSES[fontSize];
  const inputValue = isZenMode ? (zenTypedText || typedText) : currentInput;

  return (
    <div className="w-[95%] mx-auto flex flex-col items-center">
      {/* Borderless Full-Width Typing Workspace */}
      <div className="w-full bg-transparent px-0 py-0">
        {/* Header: Timer + Sound Toggle + Progress */}
        {headerSlot && <div className="mb-3">{headerSlot}</div>}

        {/* Interactive Typing Surface */}
        <div
          onClick={handleContainerClick}
          className="w-full relative select-none cursor-text"
          aria-label="Typing practice workspace. Click or tap to focus."
        >
          {/* Accessible Hidden Input handling desktop and virtual keyboards */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => updateFocus(true)}
            onBlur={() => updateFocus(false)}
            onClick={ensureCursorAtEnd}
            onKeyUp={ensureCursorAtEnd}
            onPaste={(e) => e.preventDefault()}
            disabled={isCompleted}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            tabIndex={0}
            inputMode="text"
            aria-label="Typing practice input"
            className="absolute inset-0 w-full h-full opacity-0 pointer-events-auto cursor-text z-10"
          />

          {/* Scrollable Text Viewport */}
          <div
            ref={textViewportRef}
            className={`w-full max-w-full max-h-[200px] sm:max-h-[240px] overflow-y-auto overflow-x-hidden no-scrollbar text-left font-mono ${fontSizeClass} tracking-wide break-words pointer-events-none transition-opacity duration-150 ${
              !isFocused && !isCompleted ? 'opacity-75' : 'opacity-100'
            }`}
            aria-hidden="true"
          >
            {isZenMode ? (
              <div className="flex flex-wrap items-baseline px-1">
                {inputValue.length === 0 ? (
                  <span className="relative inline-flex items-center text-secondary">
                    <span
                      ref={activeCharRef}
                      className="inline-block w-[2px] h-[1.15em] bg-accent rounded-full animate-caret mr-1.5"
                    />
                    <span>Write freely at your own pace...</span>
                  </span>
                ) : (
                  <>
                    {zenWords.map((word, idx) => (
                      <React.Fragment key={`zen-word-${idx}`}>
                        <span className="inline-block whitespace-nowrap text-primary">
                          {word}
                        </span>
                        {idx < zenWords.length - 1 && (
                          <span className="inline-block">&nbsp;</span>
                        )}
                      </React.Fragment>
                    ))}
                    <span
                      ref={activeCharRef}
                      className="inline-block w-[2px] h-[1.15em] bg-accent rounded-full animate-caret align-middle ml-[1px]"
                    />
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-baseline gap-y-1.5 px-1">
                {resolvedTargetWords.map((targetWord, wordIdx) => {
                  const isPastWord = wordIdx < currentWordIndex;
                  const isActiveWord = wordIdx === currentWordIndex && !isCompleted;
                  const status = wordStatuses[wordIdx];

                  const typedWord = isActiveWord
                    ? currentInput
                    : typedWords[wordIdx] || '';

                  // Mark word with red underline if it was committed but incorrect or skipped
                  const isIncorrectWord =
                    isPastWord && (status === 'incorrect' || status === 'skipped');

                  const displayLength = Math.max(targetWord.length, typedWord.length);

                  return (
                    <React.Fragment key={`word-${wordIdx}`}>
                      <span
                        className={`relative inline-block whitespace-nowrap px-0.5 rounded transition-all duration-75 ${
                          isIncorrectWord
                            ? 'border-b-2 border-error pb-0.5'
                            : ''
                        } ${
                          isActiveWord
                            ? 'bg-black/[0.04] dark:bg-white/[0.06] rounded'
                            : ''
                        }`}
                      >
                        {Array.from({ length: displayLength }).map((_, charIdx) => {
                          const isTargetChar = charIdx < targetWord.length;
                          const targetChar = isTargetChar ? targetWord[charIdx] : '';
                          const isTypedChar = charIdx < typedWord.length;
                          const typedChar = isTypedChar ? typedWord[charIdx] : undefined;
                          const isExtra = charIdx >= targetWord.length;
                          const isSkipped = isPastWord && !isTypedChar;

                          // Caret positioning
                          const isCaretHere =
                            isActiveWord &&
                            (charIdx === typedWord.length ||
                              (typedWord.length >= targetWord.length &&
                                charIdx === displayLength - 1));

                          const isAtEnd =
                            isActiveWord &&
                            typedWord.length >= targetWord.length &&
                            charIdx === displayLength - 1;

                          return (
                            <TypingCharacter
                              key={`char-${wordIdx}-${charIdx}`}
                              targetChar={targetChar}
                              typedChar={typedChar}
                              isCurrent={isCaretHere}
                              isCompleted={isCompleted}
                              isInActiveWord={isActiveWord}
                              isSkipped={isSkipped}
                              isExtra={isExtra}
                              isAtEnd={isAtEnd}
                              activeRef={isCaretHere ? activeCharRef : undefined}
                            />
                          );
                        })}

                        {/* Caret fallback when word is empty and cursor is at position 0 */}
                        {isActiveWord && displayLength === 0 && (
                          <span
                            ref={activeCharRef}
                            className="inline-block w-[2px] h-[1.15em] bg-accent rounded-full animate-caret align-middle"
                            aria-hidden="true"
                          />
                        )}
                      </span>

                      {/* Space separator between words */}
                      {wordIdx < resolvedTargetWords.length - 1 && (
                        <span className="inline-block select-none text-[#6B7280] dark:text-[#9CA3AF]">
                          &nbsp;
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quote Author Attribution */}
          {quoteAuthor && (
            <div className="mt-3 text-right text-xs sm:text-sm font-sans text-secondary italic pointer-events-none">
              &mdash; {quoteAuthor}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Restart Action & Shortcut */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-3 text-xs text-secondary font-sans">
        <button
          type="button"
          onClick={triggerRestart}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[38px] ${
            tabArmed
              ? 'bg-accent border-accent text-[#111317] font-semibold'
              : 'bg-surface border-border text-secondary hover:text-primary hover:bg-elevated'
          }`}
          aria-label="Restart session"
          title="Restart session (Tab + Enter)"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{tabArmed ? 'Press Enter to Restart' : 'Restart Session'}</span>
        </button>

        <span className="text-[11px] font-mono text-secondary select-none">
          Tab + Enter to restart
        </span>
      </div>
    </div>
  );
};
