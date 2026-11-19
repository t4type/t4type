import React, { useEffect } from 'react';
import { X, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { initAudioContext } from '../../utils/sound';
import type { Theme } from '../../types/theme';
import type { Difficulty, FontSize, PracticeSettings } from '../../types/typing';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  settings: PracticeSettings;
  onChangeFontSize: (size: FontSize) => void;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  onToggleSound: () => void;
}

const FONT_SIZES: { id: FontSize; label: string }[] = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
];

const DIFFICULTIES: { id: Difficulty; label: string; hint: string }[] = [
  { id: 'easy', label: 'Easy', hint: 'Short, everyday words' },
  { id: 'normal', label: 'Normal', hint: 'Balanced standard vocabulary' },
  { id: 'advanced', label: 'Advanced', hint: 'Longer, complex vocabulary' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  settings,
  onChangeFontSize,
  onChangeDifficulty,
  onToggleSound,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-surface border border-border p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <h2 id="settings-title" className="text-base font-semibold text-primary font-sans">
            Preferences
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-elevated transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-medium text-secondary font-sans">
            Font size
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-bg border border-border/70">
            {FONT_SIZES.map(({ id, label }) => {
              const active = settings.fontSize === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangeFontSize(id)}
                  aria-pressed={active}
                  className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-sans transition-colors min-h-[38px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    active
                      ? 'bg-elevated text-accent font-medium border border-border/80'
                      : 'text-secondary hover:text-primary border border-transparent'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-secondary font-sans">
              Difficulty
            </span>
            <span className="text-xs text-secondary/80 font-sans">
              {DIFFICULTIES.find((d) => d.id === settings.difficulty)?.hint}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-bg border border-border/70">
            {DIFFICULTIES.map(({ id, label, hint }) => {
              const active = settings.difficulty === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangeDifficulty(id)}
                  aria-pressed={active}
                  title={hint}
                  className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-sans transition-colors min-h-[38px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    active
                      ? 'bg-elevated text-accent font-medium border border-border/80'
                      : 'text-secondary hover:text-primary border border-transparent'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <span className="block text-xs font-medium text-secondary font-sans">
              Keystroke sound
            </span>
            <button
              type="button"
              onClick={() => {
                initAudioContext();
                onToggleSound();
              }}
              aria-pressed={settings.sound}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-sans border transition-colors min-h-[42px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                settings.sound
                  ? 'bg-accent-soft border-accent/50 text-accent font-medium'
                  : 'bg-bg border-border text-secondary hover:text-primary'
              }`}
            >
              {settings.sound ? (
                <>
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  <span>On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" aria-hidden="true" />
                  <span>Off</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-medium text-secondary font-sans">
              Appearance
            </span>
            <button
              type="button"
              onClick={onToggleTheme}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-sans bg-bg border border-border text-primary hover:border-accent/50 transition-colors min-h-[42px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs text-secondary font-sans">
          <span>Saved locally in browser</span>
          <span className="font-mono text-[11px]">Esc to close</span>
        </div>
      </div>
    </div>
  );
};
