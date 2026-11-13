import React, { useRef, useEffect, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { TypingCharacter } from './TypingCharacter';
import type { FontSize } from '../../types/typing';

interface WordToken {
  word: string;
  startIndex: number;
}

interface TypingAreaProps {
  targetText: string;
  typedText: string;
  currentIndex: number;
  isCompleted: boolean;
  isZenMode: boolean;
  quoteAuthor?: string;
  fontSize: FontSize;
  isModalOpen: boolean;
  onTextChange: (val: string) => void;
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
  typedText,
  currentIndex,
  isCompleted,
  isZenMode,
  quoteAuthor,
  fontSize,
  isModalOpen,
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
    if (typedText.length === 0 && textViewportRef.current) {
      textViewportRef.current.scrollTop = 0;
    }
  }, [typedText.length, targetText]);

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
  }, [currentIndex, targetText, typedText]);

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

    if (
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Home' ||
      e.key === 'End'
    ) {
      e.preventDefault();
    }
  };

  const wordTokens = useMemo<WordToken[]>(() => {
    if (!targetText) return [];
    const rawWords = targetText.split(' ');
    const tokens: WordToken[] = [];
    let currentIdx = 0;

    for (let i = 0; i < rawWords.length; i++) {
      tokens.push({
        word: rawWords[i],
        startIndex: currentIdx,
      });
      currentIdx += rawWords[i].length + 1;
    }
    return tokens;
  }, [targetText]);

  const zenWords = useMemo<string[]>(() => {
    if (!isZenMode || !typedText) return [];
    return typedText.split(' ');
  }, [isZenMode, typedText]);

  const fontSizeClass = FONT_SIZE_CLASSES[fontSize];

  return (
    <div className="w-[95%] mx-auto flex flex-col items-center">
      {/* Borderless Full-Width Typing Workspace */}
      <div className="w-full bg-transparent px-0 py-0">
        {/* Header: Timer + Status + Accent Progress Bar */}
        {headerSlot && <div className="mb-3">{headerSlot}</div>}

        {/* Interactive Typing Surface */}
        <div
          onClick={handleContainerClick}
          className="w-full relative select-none cursor-text"
          aria-label="Typing practice workspace. Click or tap to focus."
        >
          {/* Unified Desktop & Mobile Accessible Input */}
          <input
            ref={inputRef}
            type="text"
            value={typedText}
            onChange={(e) => onTextChange(e.target.value)}
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
                {typedText.length === 0 ? (
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
              <div className="flex flex-wrap px-1">
                {wordTokens.map((token, wordIdx) => {
                  const isLastWord = wordIdx === wordTokens.length - 1;
                  const spaceGlobalIndex = token.startIndex + token.word.length;
                  const isActiveWord =
                    !isCompleted &&
                    currentIndex >= token.startIndex &&
                    currentIndex < spaceGlobalIndex;

                  return (
                    <React.Fragment key={`word-${token.startIndex}`}>
                      <span
                        className={`inline-block whitespace-nowrap rounded px-1 -mx-1 transition-colors duration-100 ${
                          isActiveWord
                            ? 'bg-black/[0.06] dark:bg-white/[0.08]'
                            : ''
                        }`}
                      >
                        {token.word.split('').map((char, charOffset) => {
                          const globalIdx = token.startIndex + charOffset;
                          return (
                            <TypingCharacter
                              key={`char-${globalIdx}`}
                              targetChar={char}
                              typedChar={typedText[globalIdx]}
                              isCurrent={globalIdx === currentIndex}
                              isCompleted={isCompleted}
                              isInActiveWord={isActiveWord}
                              activeRef={activeCharRef}
                            />
                          );
                        })}
                      </span>

                      {!isLastWord && (
                        <span className="inline-block">
                          <TypingCharacter
                            key={`space-${spaceGlobalIndex}`}
                            targetChar=" "
                            typedChar={typedText[spaceGlobalIndex]}
                            isCurrent={spaceGlobalIndex === currentIndex}
                            isCompleted={isCompleted}
                            activeRef={activeCharRef}
                          />
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
