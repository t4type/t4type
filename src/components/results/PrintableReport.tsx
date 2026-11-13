import React from 'react';
import { formatTime } from '../../utils/format';
import { formatReportDate, formatReportTime } from '../../utils/report';
import type { TestResult } from '../../types/typing';

interface PrintableReportProps {
  result: TestResult;
  participantName: string;
  reportRef: string;
}

const MODE_LABELS: Record<TestResult['mode'], string> = {
  time: 'Time',
  words: 'Words',
  quotes: 'Quotes',
  zen: 'Zen',
  custom: 'Custom',
};

export const PrintableReport: React.FC<PrintableReportProps> = ({
  result,
  participantName,
  reportRef,
}) => {
  const formattedDate = formatReportDate(result.completedAt);
  const formattedTime = formatReportTime(result.completedAt);
  const formattedDuration = formatTime(Math.max(1, result.durationSeconds));

  const sessionRows: { label: string; value: string }[] = [
    { label: 'Practice Mode', value: MODE_LABELS[result.mode] },
    { label: 'Mode Configuration', value: result.modeDetail },
    { label: 'Test Duration', value: formattedDuration },
    { label: 'Correct Characters', value: String(result.correct) },
    { label: 'Incorrect Characters', value: String(result.incorrect) },
    { label: 'Total Characters', value: String(result.total) },
  ];

  if (result.wordCount > 0) {
    sessionRows.push({
      label: 'Word Count',
      value: `${result.wordCount} ${result.wordCount === 1 ? 'word' : 'words'}`,
    });
  }

  if (result.quoteAuthor) {
    sessionRows.push({
      label: 'Quote Attribution',
      value: result.quoteAuthor,
    });
  }

  return (
    <article
      className="t4type-a4-report bg-[#FFFFFF] text-[#0F172A] font-sans leading-normal"
      aria-label="Printable Typing Performance Report"
    >
      {/* Restrained Blue & Yellow Top Accent Strip */}
      <div className="flex w-full h-1.5 mb-5" aria-hidden="true">
        <div className="w-3/4 bg-blue-700" />
        <div className="w-1/4 bg-amber-500" />
      </div>

      {/* HEADER */}
      <header className="flex flex-wrap items-start justify-between gap-4 pb-4 mb-6 border-b-2 border-slate-900">
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              T4<span className="text-blue-700">Type</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              t4type.com
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
            TYPING PERFORMANCE REPORT
          </h1>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-slate-300 bg-[#F8FAFC]">
          <span
            className="w-2 h-2 rounded-full bg-blue-700 shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold tracking-wider text-slate-800 uppercase">
            SESSION COMPLETED
          </span>
        </div>
      </header>

      {/* PARTICIPANT DETAILS */}
      <section className="mb-6" aria-label="Participant Details">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
          Participant Details
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 rounded border border-slate-300 bg-[#F8FAFC]">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
              Participant Name
            </p>
            <p className="text-base font-semibold text-slate-900 break-words mt-0.5">
              {participantName}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
              Report Reference
            </p>
            <p className="text-sm font-mono font-semibold text-slate-900 mt-1">
              {reportRef}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
              Test Date
            </p>
            <p className="text-sm font-medium text-slate-800 mt-0.5">
              {formattedDate}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
              Test Time
            </p>
            <p className="text-sm font-medium text-slate-800 mt-0.5">
              {formattedTime}
            </p>
          </div>
        </div>
      </section>

      {/* MAIN PERFORMANCE */}
      <section className="mb-6" aria-label="Main Performance">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
          Main Performance
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded border border-slate-300 border-t-4 border-t-blue-700 bg-white text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
              Typing Speed (WPM)
            </p>
            <p className="text-5xl font-bold font-mono tabular-nums text-blue-700 tracking-tight my-2">
              {result.wpm}
            </p>
            <p className="text-xs text-slate-500">Words per minute</p>
          </div>

          <div className="p-5 rounded border border-slate-300 border-t-4 border-t-amber-500 bg-white text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
              Accuracy
            </p>
            <p className="text-5xl font-bold font-mono tabular-nums text-slate-900 tracking-tight my-2">
              {result.accuracy}%
            </p>
            <p className="text-xs text-slate-500">Character precision</p>
          </div>
        </div>
      </section>

      {/* SESSION DETAILS */}
      <section className="mb-8" aria-label="Session Details">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
          Session Details
        </h2>
        <div className="rounded border border-slate-300 overflow-hidden">
          <table className="w-full border-collapse text-left text-sm">
            <tbody>
              {sessionRows.map((row, idx) => (
                <tr
                  key={row.label}
                  className={idx % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#F8FAFC]'}
                >
                  <th
                    scope="row"
                    className="py-2 px-4 font-medium text-slate-600 border-b border-slate-200 w-1/2"
                  >
                    {row.label}
                  </th>
                  <td className="py-2 px-4 font-mono font-semibold text-slate-900 border-b border-slate-200 text-right">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FOOTER & DISCLAIMER */}
      <footer className="pt-4 border-t border-slate-300">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-800 font-semibold">
          <span>T4Type.com | Free Typing Practice</span>
          <span className="font-mono font-normal text-slate-600">
            Reference: {reportRef}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
          This report records a typing practice session. It is not an
          independently verified typing certification.
        </p>
      </footer>
    </article>
  );
};
