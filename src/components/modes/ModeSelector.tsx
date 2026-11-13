import React from 'react';
import { Clock, AlignLeft, Quote, Feather, Edit3 } from 'lucide-react';
import type { PracticeMode } from '../../types/typing';

interface ModeSelectorProps {
  mode: PracticeMode;
  onSelectMode: (mode: PracticeMode) => void;
}

const MODES: {
  id: PracticeMode;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'time', label: 'Time', description: 'Timed typing sprint', icon: Clock },
  { id: 'words', label: 'Words', description: 'Fixed word count', icon: AlignLeft },
  { id: 'quotes', label: 'Quotes', description: 'Curated passages', icon: Quote },
  { id: 'zen', label: 'Zen', description: 'Unbounded free typing', icon: Feather },
  { id: 'custom', label: 'Custom', description: 'Use your own text', icon: Edit3 },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onSelectMode,
}) => {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-full"
      role="tablist"
      aria-label="Practice modes"
    >
      {MODES.map(({ id, label, description, icon: Icon }) => {
        const isActive = mode === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            title={description}
            onClick={() => onSelectMode(id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-sans transition-colors min-h-[36px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isActive
                ? 'bg-accent-soft text-accent font-medium border border-accent'
                : 'text-secondary hover:text-primary hover:bg-elevated border border-transparent'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
