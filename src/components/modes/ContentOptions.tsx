import React from 'react';
import { AtSign, Hash } from 'lucide-react';

interface ContentOptionsProps {
  punctuation: boolean;
  numbers: boolean;
  disabled?: boolean;
  isTestRunning?: boolean;
  onTogglePunctuation: () => void;
  onToggleNumbers: () => void;
}

export const ContentOptions: React.FC<ContentOptionsProps> = ({
  punctuation,
  numbers,
  disabled = false,
  isTestRunning = false,
  onTogglePunctuation,
  onToggleNumbers,
}) => {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 ${
        disabled ? 'opacity-45' : ''
      }`}
      aria-label="Text options"
    >
      <span className="text-[11px] uppercase tracking-wider font-semibold text-secondary font-sans mr-1 select-none">
        Text options
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={punctuation}
        disabled={disabled}
        onClick={onTogglePunctuation}
        title={
          disabled
            ? 'Available in Time and Words modes'
            : isTestRunning
              ? 'Toggle punctuation (applies to next test)'
              : 'Include punctuation marks'
        }
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans border transition-colors min-h-[34px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          punctuation && !disabled
            ? 'bg-accent-soft border-accent text-accent font-medium'
            : 'bg-elevated border-border text-secondary hover:text-primary'
        } ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <AtSign className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Punctuation</span>
      </button>

      <button
        type="button"
        role="switch"
        aria-checked={numbers}
        disabled={disabled}
        onClick={onToggleNumbers}
        title={
          disabled
            ? 'Available in Time and Words modes'
            : isTestRunning
              ? 'Toggle numbers (applies to next test)'
              : 'Include numeric digits'
        }
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans border transition-colors min-h-[34px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          numbers && !disabled
            ? 'bg-accent-soft border-accent text-accent font-medium'
            : 'bg-elevated border-border text-secondary hover:text-primary'
        } ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <Hash className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Numbers</span>
      </button>
    </div>
  );
};
