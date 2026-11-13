import React from 'react';
import { Keyboard, Sun, Moon, Settings } from 'lucide-react';
import type { Theme } from '../../types/theme';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onGoPractice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenSettings,
  onGoPractice,
}) => {
  return (
    <header className="w-full border-b border-border bg-bg transition-colors">
      <nav
        aria-label="Main Navigation"
        className="w-[96vw] sm:w-[94vw] lg:w-[92vw] xl:w-[90vw] max-w-[1700px] mx-auto h-14 flex items-center justify-between"
      >
        {/* Left: Distinctive T4Type Brand Mark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onGoPractice();
          }}
          className="group flex items-center gap-2.5 rounded-lg py-1 pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="T4Type Home"
        >
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent text-[#111317] shadow-sm group-hover:bg-accent-hover transition-colors">
            <Keyboard className="w-4 h-4 stroke-[2.2]" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-primary font-sans select-none">
            T4<span className="text-accent">Type</span>
          </span>
        </a>

        {/* Right: Circular Theme Toggle & Settings */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-full text-secondary hover:text-primary bg-surface border border-border hover:border-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-center"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full text-secondary hover:text-primary bg-surface border border-border hover:border-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-center"
            aria-label="Open settings"
            title="Settings"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
};
