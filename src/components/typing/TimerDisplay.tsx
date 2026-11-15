import React from 'react';
import { Check, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '../../utils/format';
import { initAudioContext } from '../../utils/sound';
import type { PracticeConfig } from '../../types/typing';

interface TimerDisplayProps {
  config: PracticeConfig;
  remainingSeconds: number;
  hasStarted: boolean;
  typedText: string;
  targetText: string;
  sound: boolean;
  onToggleSound: () => void;
  onFinishZen: () => void;
  currentWordIndex?: number;
  totalWordsCount?: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  config,
  remainingSeconds,
  hasStarted,
  typedText,
  targetText,
  sound,
  onToggleSound,
  onFinishZen,
  currentWordIndex,
  totalWordsCount,
}) => {
  const handleToggleSound = () => {
    initAudioContext();
    onToggleSound();
  };

  const soundToggleButton = (
    <button
      type="button"
      role="switch"
      aria-checked={sound}
      onClick={handleToggleSound}
      aria-label={sound ? 'Keyboard sound: On' : 'Keyboard sound: Off'}
      title={sound ? 'Keyboard sound: On' : 'Keyboard sound: Off'}
      className="p-1.5 -ml-1 rounded-lg text-secondary hover:text-primary hover:bg-surface/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-center min-w-[32px] min-h-[32px]"
    >
      {sound ? (
        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent" aria-hidden="true" />
      ) : (
        <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-secondary hover:text-primary" aria-hidden="true" />
      )}
    </button>
  );

  if (config.mode === 'time') {
    const isLowTime = hasStarted && remainingSeconds <= 5;
    const timeProgress =
      config.timeLimit > 0
        ? Math.max(0, Math.min(100, (remainingSeconds / config.timeLimit) * 100))
        : 100;

    return (
      <div className="w-full select-none" aria-live="polite">
        <div className="flex items-center justify-between gap-3 min-h-[40px]">
          <div className="flex items-center">
            {soundToggleButton}
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

  const typedWordsCount = typedText.trim()
    ? typedText.trimEnd().split(/\s+/).length
    : 0;

  if (config.mode === 'zen') {
    return (
      <div className="w-full select-none">
        <div className="flex items-center justify-between gap-3 min-h-[40px]">
          <div className="flex items-center gap-2.5">
            {soundToggleButton}
            <span className="text-[11px] font-sans font-medium uppercase tracking-widest text-secondary">
              Zen mode &middot; {typedWordsCount} {typedWordsCount === 1 ? 'word' : 'words'}
            </span>
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
  const totalWords = totalWordsCount ?? (targetText ? targetText.trim().split(/\s+/).length : 0);
  const completedWords = currentWordIndex !== undefined ? currentWordIndex : typedWordsCount;
  const progressPercent =
    totalWords > 0
      ? Math.min(100, Math.round((completedWords / totalWords) * 100))
      : 0;

  const modeMetaLabel =
    config.mode === 'quotes'
      ? `${config.quoteLength} quote`
      : config.mode === 'custom'
        ? 'Custom text'
        : 'Progress';

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between gap-3 min-h-[40px]">
        <div className="flex items-center gap-2.5">
          {soundToggleButton}
          <span className="text-[11px] font-sans font-medium uppercase tracking-widest text-secondary">
            {modeMetaLabel}
          </span>
        </div>

        {totalWords > 0 && (
          <span className="font-mono tabular-nums text-xl sm:text-2xl font-bold text-accent">
            {completedWords} / {totalWords}{' '}
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
          style={{ width: `${hasStarted ? progressPercent : 0}%` }}
        />
      </div>
    </div>
  );
};
