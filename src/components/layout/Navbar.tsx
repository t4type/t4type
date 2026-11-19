import React from 'react';
import { Sun, Moon, Settings } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import type { Theme } from '../../types/theme';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onGoPractice: () => void;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenSettings,
  onGoPractice,
  currentPath = '/',
  onNavigate,
}) => {
  return (
    <header className="w-full border-b border-border bg-bg transition-colors">
      <nav
        aria-label="Main Navigation"
        className="w-[96vw] sm:w-[94vw] lg:w-[92vw] xl:w-[90vw] max-w-[1700px] mx-auto h-14 flex items-center justify-between px-1 sm:px-0"
      >
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onGoPractice();
          }}
          className="group flex items-center rounded-lg py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0 transition-opacity hover:opacity-90"
          aria-label="T4Type Home"
        >
          <BrandLogo
            variant="horizontal"
            size="sm"
            className="h-7 sm:h-8 w-auto"
            ariaLabel="T4Type"
          />
        </a>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {currentPath !== '/' && (
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onGoPractice();
              }}
              className="text-xs sm:text-sm font-medium text-accent hover:text-accent-hover px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0"
            >
              Practice
            </a>
          )}

          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) {
                onNavigate('/about');
              }
            }}
            className={`text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0 ${
              currentPath === '/about'
                ? 'text-accent'
                : 'text-secondary hover:text-primary'
            }`}
          >
            About
          </a>

          <button
            type="button"
            onClick={onToggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full text-secondary hover:text-primary bg-surface border border-border hover:border-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-center shrink-0"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full text-secondary hover:text-primary bg-surface border border-border hover:border-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-center shrink-0"
            aria-label="Open settings"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
};
