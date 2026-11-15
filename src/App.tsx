import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { usePracticeSettings } from './hooks/usePracticeSettings';
import { usePracticeConfig } from './hooks/usePracticeConfig';
import { useTypingEngine } from './hooks/useTypingEngine';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PracticeToolbar } from './components/modes/PracticeToolbar';
import { CustomTextEditor } from './components/modes/CustomTextEditor';
import { TimerDisplay } from './components/typing/TimerDisplay';
import { TypingArea } from './components/typing/TypingArea';
import { ResultsPanel } from './components/results/ResultsPanel';
import { SettingsPanel } from './components/settings/SettingsPanel';
import type {
  PracticeMode,
  TimeOption,
  WordsOption,
  QuoteLength,
} from './types/typing';

const CUSTOM_TEXT_STORAGE_KEY = 't4type-custom-text';

function loadStoredCustomText(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(CUSTOM_TEXT_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

interface PendingSwitch {
  label: string;
  apply: () => void;
}

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { settings, setFontSize, setDifficulty, toggleSound } = usePracticeSettings();
  const {
    config,
    setMode,
    setTimeLimit,
    setWordCount,
    setQuoteLength,
    togglePunctuation,
    toggleNumbers,
  } = usePracticeConfig();

  const [customText, setCustomText] = useState<string>(loadStoredCustomText);
  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(
    () => config.mode === 'custom' && !loadStoredCustomText().trim()
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isTypingFocused, setIsTypingFocused] = useState<boolean>(true);
  const [pendingSwitch, setPendingSwitch] = useState<PendingSwitch | null>(null);
  const [focusTrigger, setFocusTrigger] = useState<number>(0);

  const engine = useTypingEngine({
    config,
    settings,
    customText,
  });

  // Persist custom text locally in browser
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_TEXT_STORAGE_KEY, customText);
    } catch {
      // Ignore storage errors
    }
  }, [customText]);

  // Clear any pending switch if test finishes or resets
  useEffect(() => {
    if (!engine.hasStarted || engine.isCompleted) {
      setPendingSwitch(null);
    }
  }, [engine.hasStarted, engine.isCompleted]);

  // Tab + Enter shortcut support on Results screen
  const resultTabArmedRef = useRef(false);
  const resultTabTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!engine.isCompleted || isSettingsOpen || isPrintModalOpen) {
      resultTabArmedRef.current = false;
      return;
    }

    const handleResultShortcut = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        resultTabArmedRef.current = true;
        if (resultTabTimerRef.current !== null) {
          window.clearTimeout(resultTabTimerRef.current);
        }
        resultTabTimerRef.current = window.setTimeout(() => {
          resultTabArmedRef.current = false;
        }, 2000);
      } else if (e.key === 'Enter' && resultTabArmedRef.current) {
        e.preventDefault();
        resultTabArmedRef.current = false;
        engine.newTest();
      }
    };

    window.addEventListener('keydown', handleResultShortcut);
    return () => {
      window.removeEventListener('keydown', handleResultShortcut);
      if (resultTabTimerRef.current !== null) {
        window.clearTimeout(resultTabTimerRef.current);
      }
    };
  }, [engine, isSettingsOpen, isPrintModalOpen]);

  // Helper: protect active running sessions from accidental mode/config switches
  const guardActiveSession = (label: string, action: () => void) => {
    if (engine.hasStarted && !engine.isCompleted) {
      setPendingSwitch({ label, apply: action });
    } else {
      setPendingSwitch(null);
      action();
    }
  };

  const handleSelectMode = (mode: PracticeMode) => {
    if (mode === config.mode) return;
    const modeLabel = mode.charAt(0).toUpperCase() + mode.slice(1) + ' mode';
    guardActiveSession(modeLabel, () => {
      setMode(mode);
      if (mode === 'custom' && !customText.trim()) {
        setIsEditingCustom(true);
      } else {
        setIsEditingCustom(false);
      }
      setFocusTrigger((c) => c + 1);
    });
  };

  const handleSelectTime = (limit: TimeOption) => {
    if (limit === config.timeLimit) return;
    guardActiveSession(`${limit} seconds`, () => {
      setTimeLimit(limit);
      setFocusTrigger((c) => c + 1);
    });
  };

  const handleSelectWords = (count: WordsOption) => {
    if (count === config.wordCount) return;
    guardActiveSession(`${count} words`, () => {
      setWordCount(count);
      setFocusTrigger((c) => c + 1);
    });
  };

  const handleSelectQuoteLength = (length: QuoteLength) => {
    if (length === config.quoteLength) return;
    const label = `${length.charAt(0).toUpperCase() + length.slice(1)} quote`;
    guardActiveSession(label, () => {
      setQuoteLength(length);
      setFocusTrigger((c) => c + 1);
    });
  };

  const handleStartCustomTest = (text: string) => {
    setCustomText(text);
    setMode('custom');
    setIsEditingCustom(false);
    setFocusTrigger((c) => c + 1);
  };

  const handleToggleCustomEditor = () => {
    guardActiveSession('Custom text editor', () => {
      setIsEditingCustom((prev) => !prev);
    });
  };

  const handleGoPractice = () => {
    setPendingSwitch(null);
    if (engine.isCompleted) {
      engine.newTest();
    }
    setFocusTrigger((c) => c + 1);
  };

  const handleNewTest = () => {
    if (config.mode === 'custom') {
      engine.tryAgain();
      setIsEditingCustom(true);
    } else {
      engine.newTest();
      setFocusTrigger((c) => c + 1);
    }
  };

  const handleConfirmSwitch = () => {
    if (pendingSwitch) {
      const { apply } = pendingSwitch;
      setPendingSwitch(null);
      apply();
    }
  };

  const handleCancelSwitch = () => {
    setPendingSwitch(null);
    setFocusTrigger((c) => c + 1);
  };

  const isCustomModeActive = config.mode === 'custom';
  const showCustomEditor = isCustomModeActive && (isEditingCustom || !customText.trim());
  const isTypingActive = engine.hasStarted && !engine.isCompleted;

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-bg text-primary transition-colors duration-200 selection:bg-accent selection:text-bg overflow-x-hidden">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoPractice={handleGoPractice}
      />

      <main className="flex-1 min-h-0 flex flex-col items-center justify-center w-[96vw] sm:w-[94vw] lg:w-[92vw] xl:w-[90vw] max-w-[1700px] mx-auto py-3 sm:py-4">
        {engine.isCompleted && engine.result ? (
          <ResultsPanel
            result={engine.result}
            onTryAgain={() => {
              engine.tryAgain();
              setFocusTrigger((c) => c + 1);
            }}
            onNewTest={handleNewTest}
            onChangeMode={() => {
              engine.newTest();
              setFocusTrigger((c) => c + 1);
            }}
            onPrintModalChange={setIsPrintModalOpen}
          />
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Segmented Mode Selector, Text Options, and Context Configuration */}
            <PracticeToolbar
              config={config}
              isTestRunning={isTypingActive}
              hasCustomText={Boolean(customText.trim())}
              isEditingCustom={showCustomEditor}
              onTogglePunctuation={togglePunctuation}
              onToggleNumbers={toggleNumbers}
              onSelectMode={handleSelectMode}
              onSelectTime={handleSelectTime}
              onSelectWords={handleSelectWords}
              onSelectQuoteLength={handleSelectQuoteLength}
              onToggleCustomEditor={handleToggleCustomEditor}
            />

            {/* Active Session Protection Prompt */}
            {pendingSwitch && (
              <div
                className="w-full max-w-3xl mx-auto mb-5 px-4 py-3 rounded-xl bg-surface border border-accent/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-sans"
                role="alert"
              >
                <div className="flex items-center gap-2 text-primary">
                  <AlertCircle className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                  <span>
                    Session active. Switch to{' '}
                    <strong className="font-medium text-accent">{pendingSwitch.label}</strong>{' '}
                    and discard progress?
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCancelSwitch}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-primary hover:bg-elevated transition-colors min-h-[34px]"
                  >
                    Keep typing
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSwitch}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent text-bg hover:bg-accent-hover transition-colors min-h-[34px]"
                  >
                    Discard &amp; switch
                  </button>
                </div>
              </div>
            )}

            {/* Typing Workspace OR Inline Custom Editor */}
            {showCustomEditor ? (
              <div className="w-full max-w-3xl mx-auto">
                <CustomTextEditor
                  initialText={customText}
                  hasExistingText={Boolean(customText.trim())}
                  onStartCustomTest={handleStartCustomTest}
                  onCancel={
                    customText.trim() ? () => setIsEditingCustom(false) : undefined
                  }
                />
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                {/* Unified Typing Card: Timer Header + Accent Bar + Typing Surface */}
                <TypingArea
                  targetText={engine.targetText}
                  targetWords={engine.targetWords}
                  typedWords={engine.typedWords}
                  currentWordIndex={engine.currentWordIndex}
                  currentInput={engine.currentInput}
                  wordStatuses={engine.wordStatuses}
                  typedText={engine.typedText}
                  currentIndex={engine.currentIndex}
                  isCompleted={engine.isCompleted}
                  isZenMode={config.mode === 'zen'}
                  zenTypedText={engine.zenTypedText}
                  quoteAuthor={
                    config.mode === 'quotes' ? engine.activeQuote?.author : undefined
                  }
                  fontSize={settings.fontSize}
                  isModalOpen={isSettingsOpen}
                  onWordChange={engine.handleWordChange}
                  onSpacePress={engine.handleSpacePress}
                  onBackspaceAtWordStart={engine.handleBackspaceAtWordStart}
                  onZenChange={engine.handleZenChange}
                  onTextChange={engine.handleTextChange}
                  onRestart={engine.newTest}
                  onFocusChange={setIsTypingFocused}
                  focusTrigger={focusTrigger}
                  headerSlot={
                    <TimerDisplay
                      config={config}
                      remainingSeconds={engine.remainingSeconds}
                      hasStarted={engine.hasStarted}
                      typedText={engine.typedText}
                      targetText={engine.targetText}
                      sound={settings.sound}
                      onToggleSound={toggleSound}
                      onFinishZen={engine.finishZenTest}
                      currentWordIndex={engine.currentWordIndex}
                      totalWordsCount={engine.targetWords.length}
                    />
                  }
                />
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Settings Dialog */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        settings={settings}
        onChangeFontSize={setFontSize}
        onChangeDifficulty={setDifficulty}
        onToggleSound={toggleSound}
      />
    </div>
  );
};

export default App;
