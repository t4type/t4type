import React, { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';

interface CustomTextEditorProps {
  initialText: string;
  hasExistingText: boolean;
  onStartCustomTest: (text: string) => void;
  onCancel?: () => void;
}

export const CustomTextEditor: React.FC<CustomTextEditorProps> = ({
  initialText,
  hasExistingText,
  onStartCustomTest,
  onCancel,
}) => {
  const [draft, setDraft] = useState(initialText);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(initialText);
    setError(null);
    const timer = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 20);
    return () => window.clearTimeout(timer);
  }, [initialText]);

  useEffect(() => {
    if (!hasExistingText || !onCancel) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [hasExistingText, onCancel]);

  const normalized = draft.replace(/\s+/g, ' ').trim();
  const wordCount = normalized ? normalized.split(' ').length : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalized) {
      setError('Please enter or paste some text before starting.');
      textareaRef.current?.focus();
      return;
    }
    onStartCustomTest(normalized);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl bg-surface border border-border p-5 sm:p-8 text-left space-y-4"
      aria-label="Custom practice text editor"
    >
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor="custom-text-input"
          className="text-sm font-semibold text-primary font-sans"
        >
          Custom Practice Text
        </label>
        <span className="text-xs text-secondary font-mono tabular-nums">
          {wordCount} {wordCount === 1 ? 'word' : 'words'} &middot; {normalized.length} chars
        </span>
      </div>

      <textarea
        id="custom-text-input"
        ref={textareaRef}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          if (error) setError(null);
        }}
        rows={5}
        placeholder="Paste or type your own passage here. Your text stays strictly local in your browser."
        className="w-full rounded-xl bg-bg border border-border p-4 text-sm sm:text-base font-mono text-primary placeholder:text-secondary/60 focus:outline-none focus:border-accent resize-y transition-colors"
      />

      {error && (
        <p className="text-xs text-error font-sans" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-xs text-secondary font-sans">
          Stored locally in your browser
        </span>

        <div className="flex items-center gap-2">
          {hasExistingText && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-sans text-secondary hover:text-primary hover:bg-elevated transition-colors min-h-[40px]"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Cancel</span>
            </button>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans font-medium bg-accent text-bg hover:bg-accent-hover transition-colors min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            <span>Start Test</span>
          </button>
        </div>
      </div>
    </form>
  );
};

