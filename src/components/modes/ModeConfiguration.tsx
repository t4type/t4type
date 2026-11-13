import React from 'react';
import { Pencil } from 'lucide-react';
import type {
  PracticeConfig,
  TimeOption,
  WordsOption,
  QuoteLength,
} from '../../types/typing';

interface ModeConfigurationProps {
  config: PracticeConfig;
  hasCustomText: boolean;
  isEditingCustom: boolean;
  onSelectTime: (limit: TimeOption) => void;
  onSelectWords: (count: WordsOption) => void;
  onSelectQuoteLength: (length: QuoteLength) => void;
  onToggleCustomEditor: () => void;
}

const TIME_OPTIONS: { value: TimeOption; label: string }[] = [
  { value: 15, label: '15 seconds' },
  { value: 30, label: '30 seconds' },
  { value: 60, label: '60 seconds' },
  { value: 120, label: '120 seconds' },
];

const WORDS_OPTIONS: { value: WordsOption; label: string }[] = [
  { value: 10, label: '10 words' },
  { value: 25, label: '25 words' },
  { value: 50, label: '50 words' },
  { value: 100, label: '100 words' },
];

const QUOTE_LENGTHS: { value: QuoteLength; label: string }[] = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
];

export const ModeConfiguration: React.FC<ModeConfigurationProps> = ({
  config,
  hasCustomText,
  isEditingCustom,
  onSelectTime,
  onSelectWords,
  onSelectQuoteLength,
  onToggleCustomEditor,
}) => {
  if (config.mode === 'time') {
    return (
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        aria-label="Time duration options"
      >
        {TIME_OPTIONS.map(({ value, label }) => {
          const active = config.timeLimit === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelectTime(value)}
              aria-pressed={active}
              className={`px-4 py-1.5 rounded-full text-xs font-sans border transition-colors min-h-[34px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                active
                  ? 'bg-accent border-accent text-[#111317] font-semibold'
                  : 'bg-surface border-border text-secondary hover:text-primary hover:bg-elevated'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  if (config.mode === 'words') {
    return (
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        aria-label="Word count options"
      >
        {WORDS_OPTIONS.map(({ value, label }) => {
          const active = config.wordCount === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelectWords(value)}
              aria-pressed={active}
              className={`px-4 py-1.5 rounded-full text-xs font-sans border transition-colors min-h-[34px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                active
                  ? 'bg-accent border-accent text-[#111317] font-semibold'
                  : 'bg-surface border-border text-secondary hover:text-primary hover:bg-elevated'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  if (config.mode === 'quotes') {
    return (
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        aria-label="Quote length options"
      >
        {QUOTE_LENGTHS.map(({ value, label }) => {
          const active = config.quoteLength === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelectQuoteLength(value)}
              aria-pressed={active}
              className={`px-4 py-1.5 rounded-full text-xs font-sans border transition-colors min-h-[34px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                active
                  ? 'bg-accent border-accent text-[#111317] font-semibold'
                  : 'bg-surface border-border text-secondary hover:text-primary hover:bg-elevated'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  if (config.mode === 'zen') {
    return (
      <p className="text-xs sm:text-sm font-sans text-secondary py-1.5 select-none">
        Practice freely without a time or word limit.
      </p>
    );
  }

  if (config.mode === 'custom') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {hasCustomText && !isEditingCustom ? (
          <button
            type="button"
            onClick={onToggleCustomEditor}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-sans bg-surface border border-border text-secondary hover:text-accent hover:border-accent transition-colors min-h-[34px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edit custom text</span>
          </button>
        ) : (
          <span className="text-xs font-sans text-secondary py-1.5">
            Enter or paste your custom passage below
          </span>
        )}
      </div>
    );
  }

  return null;
};
