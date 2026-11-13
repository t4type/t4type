import React from 'react';
import { Check } from 'lucide-react';
import { formatTime } from '../../utils/format';
import type { PracticeConfig } from '../../types/typing';

interface TimerDisplayProps {
  config: PracticeConfig;
  remainingSeconds: number;
  hasStarted: boolean;
  isFocused: boolean;
  isCompleted: boolean;
  typedText: string;
  targetText: string;
  onFinishZen: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  config,
  remainingSeconds,
  hasStarted,
  isFocused,
  isCompleted,
  typedText,
  targetText,
  onFinishZen,
}) => {
  const statusLine = !hasStarted ? (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm font-sans mt-1">
      <span
        className="w-2 h-2 rounded-full bg-accent shrink-0"
        aria-hidden="true"
      />
      <span className="font-semibold text-primary">Ready when you are.</span>
      <span className="text-secondary">
        Start typing to begin your session.
      </span>
      {!isFocused && !isCompleted && (
        <span className="text-xs font-medium text-accent ml-1">
          &middot; Click or tap to focus
        </span>
      )}
    </div>
  ) : (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm font-sans mt-1">
      <span
        className="w-2 h-2 rounded-full bg-accent shrink-0"
        aria-hidden="true"
      />
      <span className="text-secondary">Session active</span>
      {!isFocused && !isCompleted && (
        <span className="text-xs font-medium text-accent ml-1">
          &middot; Click or tap to focus
        </span>
      )}
    </div>
  );

  if (config.mode === 'time') {
    const isLowTime = hasStarted && remainingSeconds <= 5;
    const timeProgress =
      config.timeLimit > 0
        ? Math.max(0, Math.min(100, (remainingSeconds / config.timeLimit) * 100))
        : 100;

    return (
      <div className="w-full select-none" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] font-sans font-medium uppercase tracking-widest text-secondary">
              Time remaining
            </span>
            {statusLine}
          </div>

          <span
            className={`font-mono tabular-nums text-3xl sm:text-4xl font-bold tracking-tight transition-colors ${
              isLowTime ? 'text-error' : 'text-accent'
            }`}
          >
            {formatTime(remainingSeconds)}
          </span>
        </div>

        {/* Full-width Accent Bar / Time Progress */}
        <div className="w-full h-1 bg-elevated rounded-full overflow-hidden mt-2.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isLowTime ? 'bg-error' : 'bg-accent'
            }`}
            style={{ width: `${hasStarted ? timeProgress : 100}%` }}
          />
        </div>
      </div>
    );
  }

  const typedWords = typedText.trim()
    ? typedText.trimEnd().split(/\s+/).length
    : 0;

  if (config.mode === 'zen') {
    return (
      <div className="w-full select-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] font-sans font-medium uppercase tracking-widest text-secondary">
              Zen mode &middot; {typedWords}{' '}
              {typedWords === 1 ? 'word' : 'words'}
            </span>
            {statusLine}
          </div>

          {hasStarted && (
            <button
              type="button"
              onClick={onFinishZen}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-[#111317] text-xs font-sans font-semibold hover:bg-accent-hover transition-colors min-h-[36px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Finish Zen session"
            >
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Finish Session</span>
            </button>
          )}
        </div>

        <div className="w-full h-1 bg-accent rounded-full mt-2.5" />
      </div>
    );
  }

  // Words, Quotes, Custom: clean word progress + accent progress bar
  const totalWords = targetText ? targetText.trim().split(/\s+/).length : 0;
  const progressPercent =
    targetText.length > 0
      ? Math.min(100, Math.round((typedText.length / targetText.length) * 100))
      : 0;

  const modeMetaLabel =
    config.mode === 'quotes'
      ? `${config.quoteLength} quote`
      : config.mode === 'custom'
        ? 'Custom text'
        : 'Progress';

  return (
    <div className="w-full select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="block text-[11px] font-sans font-medium uppercase tracking-widest text-secondary">
            {modeMetaLabel}
          </span>
          {statusLine}
        </div>

        {totalWords > 0 && (
          <span className="font-mono tabular-nums text-xl sm:text-2xl font-bold text-accent">
            {typedWords} / {totalWords}{' '}
            <span className="text-xs sm:text-sm font-sans font-medium text-secondary">
              words
            </span>
          </span>
        )}
      </div>

      <div
        className="w-full h-1 bg-elevated rounded-full overflow-hidden mt-2.5"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Typing progress"
      >
        <div
          className="h-full bg-accent rounded-full transition-all duration-150"
          style={{ width: `${hasStarted ? progressPercent : 100}%` }}
        />
      </div>
    </div>
  );
};
