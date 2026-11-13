import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, AlertCircle } from 'lucide-react';

interface PrintNameModalProps {
  isOpen: boolean;
  initialName?: string;
  onClose: () => void;
  onSubmitName: (trimmedName: string) => void;
}

const MAX_NAME_LENGTH = 60;

export const PrintNameModal: React.FC<PrintNameModalProps> = ({
  isOpen,
  initialName = '',
  onClose,
  onSubmitName,
}) => {
  const [nameInput, setNameInput] = useState(initialName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setNameInput(initialName);
    setErrorMessage(null);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 10);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, initialName, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = nameInput.trim();

    if (!trimmed) {
      setErrorMessage('Please enter your name before generating the report.');
      inputRef.current?.focus();
      return;
    }

    if (trimmed.length > MAX_NAME_LENGTH) {
      setErrorMessage(`Name must be ${MAX_NAME_LENGTH} characters or fewer.`);
      inputRef.current?.focus();
      return;
    }

    setErrorMessage(null);
    onSubmitName(trimmed);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setNameInput(nextVal);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  return createPortal(
    <div className="t4type-screen-only">
      {/* Full-viewport translucent backdrop (z-index 1000) */}
      <div
        className="fixed inset-0 z-[1000] bg-[rgba(0,0,0,0.65)]"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Centered opaque modal layer (z-index 1001) */}
      <div
        className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-name-modal-title"
        aria-describedby="print-name-modal-subtitle"
      >
        <div
          className="pointer-events-auto w-full max-w-md rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] text-[#222222] dark:text-[#E5E5E5] border border-[#E5E5E5] dark:border-[#383838] shadow-2xl p-6 space-y-5 text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E5E5] dark:border-[#383838]">
            <div>
              <h2
                id="print-name-modal-title"
                className="text-base sm:text-lg font-semibold text-[#222222] dark:text-[#E5E5E5] font-sans"
              >
                Generate Your Typing Report
              </h2>
              <p
                id="print-name-modal-subtitle"
                className="text-xs sm:text-sm text-[#777777] dark:text-[#858585] font-sans mt-1"
              >
                Enter your name to personalize your typing performance report.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 -mr-1 -mt-1 rounded-lg text-[#777777] dark:text-[#858585] hover:text-[#222222] dark:hover:text-[#E5E5E5] hover:bg-[#F0F0ED] dark:hover:bg-[#2A2A2A] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <label
                  htmlFor="report-participant-name"
                  className="font-medium text-[#222222] dark:text-[#E5E5E5]"
                >
                  Full name
                </label>
                <span className="text-[#777777] dark:text-[#858585] font-mono tabular-nums">
                  {nameInput.length} / {MAX_NAME_LENGTH}
                </span>
              </div>

              <input
                ref={inputRef}
                id="report-participant-name"
                type="text"
                value={nameInput}
                onChange={handleChange}
                maxLength={MAX_NAME_LENGTH}
                placeholder="e.g. Alex Morgan"
                autoComplete="off"
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={
                  errorMessage ? 'report-name-error' : undefined
                }
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F7F7F5] dark:bg-[#181818] border text-sm font-sans text-[#222222] dark:text-[#E5E5E5] placeholder:text-[#777777] dark:placeholder:text-[#858585] focus:outline-none focus:ring-2 transition-colors min-h-[44px] ${
                  errorMessage
                    ? 'border-[#DC2626] dark:border-[#F87171] focus:ring-red-500'
                    : 'border-[#D5D5D5] dark:border-[#444444] focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-500'
                }`}
              />

              {errorMessage && (
                <p
                  id="report-name-error"
                  role="alert"
                  className="flex items-center gap-1.5 text-xs text-[#DC2626] dark:text-[#F87171] font-sans pt-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg bg-[#F0F0ED] dark:bg-[#2A2A2A] border border-[#D5D5D5] dark:border-[#444444] text-[#222222] dark:text-[#E5E5E5] hover:bg-[#E5E5E5] dark:hover:bg-[#333333] transition-colors text-sm font-medium font-sans min-h-[42px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 transition-colors text-sm font-medium font-sans min-h-[42px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span>Generate Report</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
