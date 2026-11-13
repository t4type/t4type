import React from 'react';
import { ContentOptions } from './ContentOptions';
import { ModeSelector } from './ModeSelector';
import { ModeConfiguration } from './ModeConfiguration';
import type {
  PracticeConfig,
  PracticeMode,
  TimeOption,
  WordsOption,
  QuoteLength,
} from '../../types/typing';

interface PracticeToolbarProps {
  config: PracticeConfig;
  isTestRunning: boolean;
  hasCustomText: boolean;
  isEditingCustom: boolean;
  onTogglePunctuation: () => void;
  onToggleNumbers: () => void;
  onSelectMode: (mode: PracticeMode) => void;
  onSelectTime: (limit: TimeOption) => void;
  onSelectWords: (count: WordsOption) => void;
  onSelectQuoteLength: (length: QuoteLength) => void;
  onToggleCustomEditor: () => void;
}

export const PracticeToolbar: React.FC<PracticeToolbarProps> = ({
  config,
  isTestRunning,
  hasCustomText,
  isEditingCustom,
  onTogglePunctuation,
  onToggleNumbers,
  onSelectMode,
  onSelectTime,
  onSelectWords,
  onSelectQuoteLength,
  onToggleCustomEditor,
}) => {
  const isContentOptionsApplicable = config.mode === 'time' || config.mode === 'words';

  return (
    <section
      className="w-full max-w-4xl mx-auto mb-3 sm:mb-4 flex flex-col items-center gap-2.5"
      aria-label="Practice Configuration"
    >
      {/* Unified Control Bar: Modes (left) + Text Options (right) */}
      <div className="w-full rounded-2xl bg-surface border border-border px-3 py-2 sm:px-5 sm:py-2 flex flex-col lg:flex-row items-center justify-between gap-2.5">
        <ModeSelector mode={config.mode} onSelectMode={onSelectMode} />

        <ContentOptions
          punctuation={config.punctuation}
          numbers={config.numbers}
          disabled={!isContentOptionsApplicable}
          isTestRunning={isTestRunning}
          onTogglePunctuation={onTogglePunctuation}
          onToggleNumbers={onToggleNumbers}
        />
      </div>

      {/* Mode Sub-Options Pills */}
      <div className="w-full flex items-center justify-center">
        <ModeConfiguration
          config={config}
          hasCustomText={hasCustomText}
          isEditingCustom={isEditingCustom}
          onSelectTime={onSelectTime}
          onSelectWords={onSelectWords}
          onSelectQuoteLength={onSelectQuoteLength}
          onToggleCustomEditor={onToggleCustomEditor}
        />
      </div>
    </section>
  );
};
