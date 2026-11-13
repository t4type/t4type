import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, Pencil } from 'lucide-react';
import { PrintableReport } from './PrintableReport';
import type { TestResult } from '../../types/typing';

interface ReportPreviewModalProps {
  isOpen: boolean;
  result: TestResult;
  participantName: string;
  reportRef: string;
  onEditName: () => void;
  onClose: () => void;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  result,
  participantName,
  reportRef,
  onEditName,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let rafId = 0;
    let printTimer: number | null = null;

    rafId = window.requestAnimationFrame(() => {
      printTimer = window.setTimeout(() => {
        window.print();
      }, 60);
    });

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
      window.cancelAnimationFrame(rafId);
      if (printTimer !== null) {
        window.clearTimeout(printTimer);
      }
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <>
      {/* Screen-only Modal Portal (hidden during @media print) */}
      {createPortal(
        <div className="t4type-screen-only">
          {/* Full-viewport translucent backdrop (z-index 1000) */}
          <div
            className="fixed inset-0 z-[1000] bg-[rgba(0,0,0,0.65)]"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Centered opaque preview modal layer (z-index 1001) */}
          <div
            className="fixed inset-0 z-[1001] flex items-center justify-center p-3 sm:p-6 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-preview-title"
          >
            <div
              className="pointer-events-auto w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#FFFFFF] dark:bg-[#202020] border border-[#E5E5E5] dark:border-[#383838] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Solid Opaque Modal Header */}
              <div className="px-4 sm:px-6 py-3.5 bg-[#FFFFFF] dark:bg-[#202020] border-b border-[#E5E5E5] dark:border-[#383838] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2
                    id="report-preview-title"
                    className="text-sm sm:text-base font-semibold text-[#222222] dark:text-[#E5E5E5] font-sans"
                  >
                    Typing Performance Report
                  </h2>
                  <p className="text-xs text-[#777777] dark:text-[#858585] font-sans">
                    Formatted for single-page A4 portrait printing
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onEditName}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F7F7F5] dark:bg-[#2A2A2A] border border-[#D5D5D5] dark:border-[#444444] text-xs sm:text-sm font-medium text-[#222222] dark:text-[#E5E5E5] hover:bg-[#ECECE8] dark:hover:bg-[#333333] transition-colors min-h-[38px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Edit Name</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerPrint}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 text-xs sm:text-sm font-medium transition-colors min-h-[38px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Print / Save PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-lg text-[#777777] dark:text-[#858585] hover:text-[#222222] dark:hover:text-[#E5E5E5] hover:bg-[#F0F0ED] dark:hover:bg-[#2A2A2A] transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label="Close report preview"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Scrollable Opaque Sheet Container */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F7F7F5] dark:bg-[#181818]">
                <div className="w-full max-w-[720px] mx-auto bg-[#FFFFFF] rounded-lg shadow-lg p-6 sm:p-10 border border-[#E5E5E5] dark:border-[#383838]">
                  <PrintableReport
                    result={result}
                    participantName={participantName}
                    reportRef={reportRef}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Dedicated Print Root Portal (visible ONLY inside @media print) */}
      {createPortal(
        <div id="t4type-print-root">
          <PrintableReport
            result={result}
            participantName={participantName}
            reportRef={reportRef}
          />
        </div>,
        document.body
      )}
    </>
  );
};
