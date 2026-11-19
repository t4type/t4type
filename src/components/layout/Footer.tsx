import React from 'react';
import { BrandLogo } from '../common/BrandLogo';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-bg transition-colors duration-200 py-4 mt-auto border-t border-border/40">
      <div className="w-[96vw] sm:w-[94vw] lg:w-[92vw] xl:w-[90vw] max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-secondary font-sans px-1 sm:px-0">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1 text-center sm:text-left">
          <BrandLogo
            variant="symbol-only"
            size="xs"
            className="h-3.5 sm:h-4 w-auto shrink-0 opacity-75 hover:opacity-100 transition-opacity"
            ariaLabel="T4Type logo"
          />
          <span className="font-semibold text-primary">T4Type</span>
          <span aria-hidden="true">&copy;</span>
          <span>{new Date().getFullYear()}</span>
          <span className="hidden sm:inline text-secondary" aria-hidden="true">
            |
          </span>
          <span className="hidden sm:inline">Minimalist &amp; distraction-free typing</span>
        </div>

        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 gap-y-2 text-xs"
        >
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) {
                onNavigate('/about');
              }
            }}
            className="hover:text-primary transition-colors py-1 focus:outline-none focus-visible:text-accent"
          >
            About
          </a>
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) {
                onNavigate('/privacy');
              }
            }}
            className="hover:text-primary transition-colors py-1 focus:outline-none focus-visible:text-accent"
          >
            Privacy
          </a>
          <a
            href="/keyboard-shortcuts"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) {
                onNavigate('/keyboard-shortcuts');
              }
            }}
            className="hover:text-primary transition-colors py-1 focus:outline-none focus-visible:text-accent"
          >
            Keyboard Shortcuts
          </a>
        </nav>
      </div>
    </footer>
  );
};
