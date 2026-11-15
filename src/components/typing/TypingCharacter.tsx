import React from 'react';
import type { CharacterState } from '../../types/typing';

interface TypingCharacterProps {
  targetChar: string;
  typedChar?: string;
  isCurrent: boolean;
  isCompleted: boolean;
  isInActiveWord?: boolean;
  isSkipped?: boolean;
  isExtra?: boolean;
  isAtEnd?: boolean;
  activeRef?: React.RefObject<HTMLSpanElement | null>;
}

export const TypingCharacter: React.FC<TypingCharacterProps> = React.memo(
  ({
    targetChar,
    typedChar,
    isCurrent,
    isCompleted,
    isInActiveWord = false,
    isSkipped = false,
    isExtra = false,
    isAtEnd = false,
    activeRef,
  }) => {
    let state: CharacterState = 'untyped';
    if (isExtra) {
      state = 'incorrect';
    } else if (typedChar !== undefined) {
      state = typedChar === targetChar ? 'correct' : 'incorrect';
    }

    const isSpace = targetChar === ' ';

    // Determine visual styling based on character state
    let colorClass = isInActiveWord
      ? 'text-[#111827] dark:text-[#F8FAFC]'
      : 'text-[#6B7280] dark:text-[#9CA3AF]';
    let displayContent = isSpace ? '\u00A0' : targetChar;

    if (isExtra && typedChar) {
      displayContent = typedChar;
      colorClass = 'text-error opacity-80 underline decoration-current bg-error-bg rounded-[2px]';
    } else if (state === 'correct') {
      colorClass = 'text-correct font-normal';
    } else if (state === 'incorrect') {
      colorClass = 'text-error underline decoration-current bg-error-bg rounded-[2px]';
      if (isSpace && typedChar) {
        displayContent = typedChar;
      }
    } else if (isSkipped) {
      colorClass = 'text-[#6B7280] dark:text-[#9CA3AF] opacity-50';
    }

    return (
      <span
        ref={isCurrent ? activeRef : undefined}
        className="relative inline-block select-none transition-colors duration-75"
      >
        {/* Dynamic Caret tracking current typing position */}
        {isCurrent && !isCompleted && (
          <span
            className={`absolute ${
              isAtEnd ? '-right-[1px]' : '-left-[1px]'
            } top-[10%] bottom-[10%] w-[2px] bg-accent rounded-full animate-caret pointer-events-none z-10`}
            aria-hidden="true"
          />
        )}
        <span className={colorClass}>{displayContent}</span>
      </span>
    );
  }
);

TypingCharacter.displayName = 'TypingCharacter';
