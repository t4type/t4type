import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-bg transition-colors duration-200 py-3.5 sm:py-4 mt-auto">
      <div className="w-[96vw] sm:w-[94vw] lg:w-[92vw] xl:w-[90vw] max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-xs text-secondary font-sans">
        {/* Brand / Copyright */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary">T4Type</span>
          <span aria-hidden="true">&copy;</span>
          <span>{new Date().getFullYear()}</span>
          <span className="hidden sm:inline text-secondary" aria-hidden="true">|</span>
          <span className="hidden sm:inline">Minimalist &amp; distraction-free typing</span>
        </div>

        {/* Links: About, Privacy, Keyboard Shortcuts */}
        <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
          <a
            href="#about"
            onClick={(e) => e.preventDefault()}
            className="hover:text-primary transition-colors py-1 focus:outline-none focus-visible:text-accent"
          >
            About
          </a>
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="hover:text-primary transition-colors py-1 focus:outline-none focus-visible:text-accent"
          >
            Privacy
          </a>
          <a
            href="#shortcuts"
            onClick={(e) => e.preventDefault()}
            className="hover:text-primary transition-colors py-1 focus:outline-none focus-visible:text-accent"
          >
            Keyboard Shortcuts
          </a>
        </nav>
      </div>
    </footer>
  );
};
