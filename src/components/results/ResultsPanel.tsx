import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { formatTime } from '../../utils/format';
import { generateReportReference } from '../../utils/report';
import { PrintNameModal } from './PrintNameModal';
import { ReportPreviewModal } from './ReportPreviewModal';
import type { TestResult } from '../../types/typing';

interface ResultsPanelProps {
  result: TestResult;
  onTryAgain: () => void;
  onNewTest: () => void;
  onChangeMode: () => void;
  onPrintModalChange?: (isOpen: boolean) => void;
}

const MODE_NAMES: Record<TestResult['mode'], string> = {
  time: 'Time',
  words: 'Words',
  quotes: 'Quotes',
  zen: 'Zen',
  custom: 'Custom',
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  onTryAgain,
  onNewTest,
  onChangeMode,
  onPrintModalChange,
}) => {
  const [modalStep, setModalStep] = useState<'closed' | 'name' | 'preview'>('closed');
  const [participantName, setParticipantName] = useState<string>('');
  const [reportRef, setReportRef] = useState<string>('');

  useEffect(() => {
    onPrintModalChange?.(modalStep !== 'closed');
  }, [modalStep, onPrintModalChange]);

  useEffect(() => {
    return () => {
      onPrintModalChange?.(false);
    };
  }, [onPrintModalChange]);

  const handleOpenPrintModal = () => {
    setModalStep('name');
  };

  const handleCloseModals = () => {
    setModalStep('closed');
  };

  const handleSubmitName = (trimmedName: string) => {
    setParticipantName(trimmedName);
    setReportRef(generateReportReference(result.completedAt));
    setModalStep('preview');
  };

  return (
    <section
      className="w-full max-w-3xl mx-auto rounded-2xl bg-surface border border-border p-6 sm:p-10 flex flex-col items-center text-center select-none"
      aria-label="Session Results"
    >
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-elevated border border-border text-xs font-sans font-medium text-correct">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Session complete</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-elevated border border-border text-xs font-sans text-secondary">
          <span className="text-primary font-medium">{MODE_NAMES[result.mode]}</span>
          <span aria-hidden="true">&middot;</span>
          <span className="text-accent">{result.modeDetail}</span>
        </span>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-2xl mb-8">
        <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-bg border border-border/60">
          <span className="text-xs uppercase tracking-widest text-secondary font-sans font-medium">
            WPM
          </span>
          <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-accent font-mono tabular-nums tracking-tight mt-1.5">
            {result.wpm}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-bg border border-border/60">
          <span className="text-xs uppercase tracking-widest text-secondary font-sans font-medium">
            Accuracy
          </span>
          <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary font-mono tabular-nums tracking-tight mt-1.5">
            {result.accuracy}%
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-bg border border-border/60">
          <span className="text-xs uppercase tracking-widest text-secondary font-sans font-medium">
            Net Speed
          </span>
          <span className="inline-flex items-baseline justify-center gap-1.5 mt-1.5 whitespace-nowrap">
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-correct font-mono tabular-nums tracking-tight">
              {result.netSpeed}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-correct/80 font-sans uppercase tracking-wider">
              WPM
            </span>
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-border/70 mb-8 font-sans">
        <div className="flex flex-col items-center">
          <span className="text-xs text-secondary">Correct chars</span>
          <span className="text-xl sm:text-2xl font-semibold text-correct font-mono tabular-nums mt-1">
            {result.correct}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-secondary">Incorrect chars</span>
          <span className="text-xl sm:text-2xl font-semibold text-error font-mono tabular-nums mt-1">
            {result.incorrect}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-secondary">Total chars</span>
          <span className="text-xl sm:text-2xl font-semibold text-primary font-mono tabular-nums mt-1">
            {result.total}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-secondary">Duration</span>
          <span className="text-xl sm:text-2xl font-semibold text-secondary font-mono tabular-nums mt-1">
            {formatTime(Math.max(1, result.durationSeconds))}
          </span>
        </div>
      </div>

      {result.quoteAuthor && (
        <p className="mb-8 text-xs sm:text-sm font-sans text-secondary italic">
          &mdash; {result.quoteAuthor}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        <button
          type="button"
          onClick={onTryAgain}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg font-medium hover:bg-accent-hover transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px]"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Try Again</span>
        </button>

        <button
          type="button"
          onClick={onNewTest}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-elevated border border-border text-primary hover:border-accent/50 hover:text-accent transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px]"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          <span>New Test</span>
        </button>

        <button
          type="button"
          onClick={onChangeMode}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-transparent text-secondary hover:text-primary hover:bg-elevated/60 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px]"
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          <span>Change Mode</span>
        </button>

        <button
          type="button"
          onClick={handleOpenPrintModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[44px]"
        >
          <Printer className="w-4 h-4" aria-hidden="true" />
          <span>Print Result</span>
        </button>
      </div>

      <p className="mt-6 text-[11px] font-mono text-secondary/75">
        Tab + Enter to start a new test
      </p>

      <PrintNameModal
        isOpen={modalStep === 'name'}
        initialName={participantName}
        onClose={handleCloseModals}
        onSubmitName={handleSubmitName}
      />

      <ReportPreviewModal
        isOpen={modalStep === 'preview'}
        result={result}
        participantName={participantName}
        reportRef={reportRef}
        onEditName={() => setModalStep('name')}
        onClose={handleCloseModals}
      />
    </section>
  );
};
