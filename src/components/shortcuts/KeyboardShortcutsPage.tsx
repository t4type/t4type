import React, { useState, useEffect, useMemo } from 'react';
import {
  Keyboard,
  Search,
  X,
  Play,
  RotateCcw,
  Sliders,
  Layers,
  Globe,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface KeyboardShortcutsPageProps {
  onGoPractice: () => void;
  onNavigate?: (path: string) => void;
}

export interface ShortcutItem {
  id: string;
  keys: string[];
  isSequential?: boolean;
  name: string;
  category: 'session' | 'editing' | 'modals' | 'browser';
  categoryLabel: string;
  action: string;
  description: string;
  context: string;
  osCompatibility: string;
}

const ALL_SHORTCUTS: ShortcutItem[] = [
  {
    id: 'restart-test',
    keys: ['Tab', 'Enter'],
    isSequential: true,
    name: 'Restart Session / New Test',
    category: 'session',
    categoryLabel: 'Typing Session Controls',
    action: 'Immediately restarts or starts a new test',
    description:
      'Press Tab to arm the restart trigger for 2 seconds, then press Enter to immediately restart the session with fresh target text.',
    context: 'During active typing test or on results screen',
    osCompatibility: 'Windows, macOS, Linux, ChromeOS',
  },
  {
    id: 'submit-word',
    keys: ['Space'],
    name: 'Advance to Next Word',
    category: 'session',
    categoryLabel: 'Typing Session Controls',
    action: 'Submits current word and moves cursor to next word',
    description:
      'Finalizes your current word input. If the word was partially typed or contained mistakes, Space registers errors for incorrect characters and advances forward.',
    context: 'Time, Words, Quotes, and Custom practice modes',
    osCompatibility: 'All platforms',
  },
  {
    id: 'backspace-previous-word',
    keys: ['Backspace'],
    name: 'Return to Previous Word',
    category: 'editing',
    categoryLabel: 'Editing & Keystroke Controls',
    action: 'Moves cursor back to edit previous word',
    description:
      'When your input field is completely empty at the start of a word, pressing Backspace returns you to the preceding word so you can fix errors.',
    context: 'Active typing practice (empty input buffer)',
    osCompatibility: 'All platforms (Backspace on Win/Linux, Delete on Mac)',
  },
  {
    id: 'intercepted-arrows',
    keys: ['Arrow Keys', 'Home', 'End'],
    name: 'Cursor Navigation Lock',
    category: 'editing',
    categoryLabel: 'Editing & Keystroke Controls',
    action: 'Intentionally intercepted to prevent caret drift',
    description:
      'Arrow keys, Home, and End are deliberately intercepted by the typing engine to prevent caret misplacement inside the input buffer during fast typing sessions.',
    context: 'Active typing practice area',
    osCompatibility: 'All platforms',
  },
  {
    id: 'close-modal-esc',
    keys: ['Esc'],
    name: 'Dismiss Modal / Dialog',
    category: 'modals',
    categoryLabel: 'Modal & Dialog Controls',
    action: 'Closes any open panel or modal dialog',
    description:
      'Instantly dismisses the Settings slide-over panel, Custom Text editor dialog, Print Name prompt, or Printable Report preview modal.',
    context: 'Any open modal or overlay',
    osCompatibility: 'All platforms',
  },
  {
    id: 'submit-modal-enter',
    keys: ['Enter'],
    name: 'Confirm Dialog / Generate',
    category: 'modals',
    categoryLabel: 'Modal & Dialog Controls',
    action: 'Submits active form or modal action',
    description:
      'Confirms entered custom practice text or generates the personalized printable report without needing to click the submit button.',
    context: 'Custom text editor and report name input modals',
    osCompatibility: 'All platforms (Enter / Return)',
  },
  {
    id: 'tab-focus-navigation',
    keys: ['Tab'],
    name: 'Focus Next Control',
    category: 'browser',
    categoryLabel: 'Browser & Accessibility Navigation',
    action: 'Moves keyboard focus to the next element',
    description:
      'Cycles focus forward through interactive controls, including navigation links, practice mode selector pills, timer durations, sound toggle, and theme switch.',
    context: 'Outside active typing input',
    osCompatibility: 'All browsers and operating systems',
  },
  {
    id: 'shift-tab-focus',
    keys: ['Shift', 'Tab'],
    name: 'Focus Previous Control',
    category: 'browser',
    categoryLabel: 'Browser & Accessibility Navigation',
    action: 'Moves keyboard focus to previous element',
    description:
      'Cycles focus backward through interactive toolbar buttons, settings toggles, and navigation elements.',
    context: 'Global page interface',
    osCompatibility: 'All browsers and operating systems',
  },
  {
    id: 'activate-focused-control',
    keys: ['Enter', 'Space'],
    name: 'Activate Focused Control',
    category: 'browser',
    categoryLabel: 'Browser & Accessibility Navigation',
    action: 'Triggers the currently focused button or link',
    description:
      'Activates whichever button or toggle currently holds keyboard focus, such as toggling typing sounds, expanding an FAQ item, or switching themes.',
    context: 'Global interactive elements',
    osCompatibility: 'All browsers and operating systems',
  },
  {
    id: 'browser-print',
    keys: ['Ctrl', 'P'],
    name: 'Open Print Dialog',
    category: 'browser',
    categoryLabel: 'Browser & Accessibility Navigation',
    action: 'Triggers browser print dialog',
    description:
      'When viewing the Printable Performance Report modal, opens the native browser print dialog to print directly on A4 paper or save as a PDF.',
    context: 'Printable report modal (Ctrl+P on Windows/Linux, Cmd+P on macOS)',
    osCompatibility: 'Ctrl + P (Win/Linux) / Cmd + P (macOS)',
  },
];

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What are keyboard shortcuts in T4Type?',
    answer:
      'Keyboard shortcuts in T4Type are specific key combinations that allow you to restart typing tests, navigate words, close settings panels, and control test sessions without using a mouse.',
  },
  {
    id: 'faq-2',
    question: 'How do I restart a typing test in T4Type?',
    answer:
      'To restart a typing test in T4Type, press Tab followed immediately by Enter. Pressing Tab arms the restart trigger for two seconds, and pressing Enter confirms the restart and loads fresh text.',
  },
  {
    id: 'faq-3',
    question: 'Can I use T4Type without a mouse?',
    answer:
      'Yes, you can use T4Type entirely without a mouse by using Tab and Shift+Tab to navigate between practice modes and controls, Enter or Space to activate buttons, and Tab then Enter to restart tests.',
  },
  {
    id: 'faq-4',
    question: 'Do keyboard shortcuts work during an active typing test?',
    answer:
      'Yes, Tab then Enter works during an active test to restart, Space submits and advances words, and Backspace returns to the previous word if your input is empty at the beginning of a word.',
  },
  {
    id: 'faq-5',
    question: 'Are T4Type keyboard shortcuts available on mobile?',
    answer:
      'T4Type keyboard shortcuts work on mobile devices and tablets whenever a physical hardware keyboard (such as a Bluetooth keyboard or iPad Magic Keyboard) is connected.',
  },
  {
    id: 'faq-6',
    question: 'Do keyboard shortcuts work on both Windows and macOS?',
    answer:
      'Yes, all T4Type keyboard shortcuts work identically on Windows, macOS, Linux, and ChromeOS. Standard modifier keys automatically map appropriately (such as Delete for Backspace and Return for Enter on Mac).',
  },
  {
    id: 'faq-7',
    question: 'Can I customize keyboard shortcuts in T4Type?',
    answer:
      'No, T4Type does not currently support custom shortcut remapping to ensure shortcuts never conflict with normal character keystrokes during rapid typing practice.',
  },
  {
    id: 'faq-8',
    question: 'Why is a keyboard shortcut not working?',
    answer:
      'If a shortcut is not working, ensure your browser window is active and focused, verify that the 2-second window has not expired after pressing Tab, and ensure another browser extension has not overridden the key.',
  },
  {
    id: 'faq-9',
    question: 'Do browser shortcuts interfere with T4Type?',
    answer:
      'T4Type is engineered with standard event safeguards so typing keystrokes are captured cleanly without triggering unwanted browser hotkeys or page scrolls.',
  },
  {
    id: 'faq-10',
    question: 'Where can I find all T4Type keyboard shortcuts?',
    answer:
      'All verified T4Type keyboard shortcuts are officially documented right here on this reference page (https://t4type.com/keyboard-shortcuts) and highlighted via the Tab+Enter badge on practice screens.',
  },
];

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://t4type.com/#website',
      url: 'https://t4type.com',
      name: 'T4Type',
      description: 'Free, minimalist, distraction-free typing practice platform.',
    },
    {
      '@type': 'Organization',
      '@id': 'https://t4type.com/#organization',
      name: 'T4Type',
      url: 'https://t4type.com',
      logo: 'https://t4type.com/favicon.svg',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://t4type.com/keyboard-shortcuts#webpage',
      url: 'https://t4type.com/keyboard-shortcuts',
      name: 'Keyboard Shortcuts – T4Type | Typing Practice Controls',
      description:
        'Explore T4Type keyboard shortcuts for controlling typing sessions, navigating practice modes, and using typing features more efficiently.',
      isPartOf: {
        '@id': 'https://t4type.com/#website',
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://t4type.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Keyboard Shortcuts',
            item: 'https://t4type.com/keyboard-shortcuts',
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://t4type.com/keyboard-shortcuts#faq',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
};

const CATEGORIES = [
  { id: 'all', label: 'All Shortcuts', icon: Layers },
  { id: 'session', label: 'Typing Session', icon: Play },
  { id: 'editing', label: 'Editing & Input', icon: Keyboard },
  { id: 'modals', label: 'Modals & Dialogs', icon: Sliders },
  { id: 'browser', label: 'Browser & Navigation', icon: Globe },
];

export const KeyboardShortcutsPage: React.FC<KeyboardShortcutsPageProps> = ({
  onGoPractice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [highlightedShortcutId, setHighlightedShortcutId] = useState<string>('restart-test');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Keyboard Shortcuts – T4Type | Typing Practice Controls';

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute('content') ?? '';
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Explore T4Type keyboard shortcuts for controlling typing sessions, navigating practice modes, and using typing features more efficiently.'
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    const hadCanonical = Boolean(canonical);
    const originalCanonical = canonical?.getAttribute('href') ?? '';
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://t4type.com/keyboard-shortcuts');

    const ogTags: { property: string; content: string }[] = [
      { property: 'og:title', content: 'Keyboard Shortcuts – T4Type | Typing Practice Controls' },
      {
        property: 'og:description',
        content:
          'Explore T4Type keyboard shortcuts for controlling typing sessions, navigating practice modes, and using typing features more efficiently.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://t4type.com/keyboard-shortcuts' },
      { property: 'og:site_name', content: 'T4Type' },
      { property: 'twitter:card', content: 'summary_large_image' },
      {
        property: 'twitter:title',
        content: 'Keyboard Shortcuts – T4Type | Typing Practice Controls',
      },
      {
        property: 'twitter:description',
        content:
          'Explore T4Type keyboard shortcuts for controlling typing sessions, navigating practice modes, and using typing features more efficiently.',
      },
    ];

    const createdElements: Element[] = [];
    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.querySelector(`meta[name="${property}"]`);
      }
      if (!tag) {
        tag = document.createElement('meta');
        if (property.startsWith('twitter:')) {
          tag.setAttribute('name', property);
        } else {
          tag.setAttribute('property', property);
        }
        document.head.appendChild(tag);
        createdElements.push(tag);
      }
      tag.setAttribute('content', content);
    });

    return () => {
      document.title = originalTitle;
      if (metaDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
      if (canonical) {
        if (hadCanonical) {
          canonical.setAttribute('href', originalCanonical);
        } else {
          canonical.remove();
        }
      }
      createdElements.forEach((el) => el.remove());
    };
  }, []);

  const filteredShortcuts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ALL_SHORTCUTS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;

      const inName = item.name.toLowerCase().includes(q);
      const inAction = item.action.toLowerCase().includes(q);
      const inDesc = item.description.toLowerCase().includes(q);
      const inContext = item.context.toLowerCase().includes(q);
      const inKeys = item.keys.some((k) => k.toLowerCase().includes(q));

      return inName || inAction || inDesc || inContext || inKeys;
    });
  }, [searchQuery, selectedCategory]);

  const activeHighlightedShortcut = useMemo(() => {
    return (
      ALL_SHORTCUTS.find((s) => s.id === highlightedShortcutId) || ALL_SHORTCUTS[0]
    );
  }, [highlightedShortcutId]);

  const activeKeySet = useMemo(() => {
    const set = new Set<string>();
    activeHighlightedShortcut.keys.forEach((k) => {
      const lower = k.toLowerCase();
      if (lower.includes('tab')) set.add('tab');
      if (lower.includes('enter') || lower.includes('return')) set.add('enter');
      if (lower.includes('space')) set.add('space');
      if (lower.includes('esc')) set.add('esc');
      if (lower.includes('backspace') || lower.includes('delete')) set.add('backspace');
      if (lower.includes('shift')) set.add('shift');
      if (lower.includes('ctrl') || lower.includes('cmd')) set.add('ctrl');
      if (lower.includes('arrow')) set.add('arrows');
    });
    return set;
  }, [activeHighlightedShortcut]);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <article className="w-full font-sans text-primary pb-16 sm:pb-24 overflow-x-hidden">
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      {/* Hero Section */}
      <header className="border-b border-border/60 pt-6 pb-10 sm:pt-10 sm:pb-14 bg-bg">
        <div className="w-[96vw] sm:w-[94vw] lg:w-[92vw] xl:w-[90vw] max-w-[1240px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              type="button"
              onClick={onGoPractice}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md py-1 pr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to Practice</span>
            </button>
            <span className="text-secondary/40" aria-hidden="true">•</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-soft text-accent text-xs font-mono font-medium border border-accent/20">
              <Keyboard className="w-3.5 h-3.5" aria-hidden="true" />
              <span>T4TYPE DOCUMENTATION</span>
            </div>
          </div>

          <h1 className="text-[clamp(1.75rem,3.5vw+0.5rem,2.75rem)] font-bold tracking-tight text-primary leading-[1.2] break-words">
            Keyboard Shortcuts
          </h1>

          <p className="mt-4 text-[15px] sm:text-base lg:text-lg text-secondary max-w-3xl leading-[1.7] sm:leading-[1.75] break-words">
            Work faster in T4Type with keyboard shortcuts. Explore the available commands for
            navigating, controlling typing sessions, and accessing practice features without
            interrupting your workflow.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-secondary absolute left-3.5 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keyboard shortcuts (e.g. Tab, restart, space)..."
                aria-label="Search keyboard shortcuts"
                className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl bg-surface border border-border text-sm font-sans text-primary placeholder:text-secondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 rounded-md text-secondary hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-secondary/80 flex items-center gap-1.5">
              <span>Find a shortcut by its name, key combination, or action.</span>
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="w-[96vw] sm:w-[94vw] lg:w-[92vw] xl:w-[90vw] max-w-[1240px] mx-auto px-2 sm:px-4 lg:px-6 pt-6 sm:pt-10 space-y-12 sm:space-y-16">
        {/* Section 2: Quick Navigation & Category Filters */}
        <section aria-label="Shortcut Categories" className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isSelected
                      ? 'bg-accent text-bg shadow-sm'
                      : 'bg-surface border border-border text-secondary hover:text-primary hover:border-accent/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 4: Interactive Keyboard Visualization (Featured at top of controls) */}
        <section aria-label="Interactive Keyboard Visualization" className="p-5 sm:p-7 rounded-2xl bg-surface border border-border shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 mb-5 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
                <h2 className="text-base sm:text-lg font-bold text-primary">Interactive Key Map</h2>
              </div>
              <p className="text-xs text-secondary mt-1">
                Visualizing active shortcut:{' '}
                <strong className="text-accent font-medium">{activeHighlightedShortcut.name}</strong>
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-elevated border border-border/60 text-xs text-secondary font-mono">
              <span>{activeHighlightedShortcut.action}</span>
            </div>
          </div>

          {/* CSS Keyboard Visualization Component */}
          <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[620px] max-w-4xl mx-auto p-3 sm:p-4 rounded-xl bg-bg border border-border space-y-1.5 select-none font-mono text-xs">
              {/* Row 1 */}
              <div className="flex gap-1.5">
                <div
                  className={`flex-1 h-9 rounded flex items-center justify-center font-semibold transition-all ${
                    activeKeySet.has('esc')
                      ? 'bg-accent text-bg font-bold scale-105 shadow-md'
                      : 'bg-surface border border-border text-secondary'
                  }`}
                >
                  Esc
                </div>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map((k) => (
                  <div key={k} className="w-9 h-9 rounded bg-surface border border-border text-secondary/60 flex items-center justify-center">
                    {k}
                  </div>
                ))}
                <div
                  className={`w-16 h-9 rounded flex items-center justify-center font-semibold transition-all ${
                    activeKeySet.has('backspace')
                      ? 'bg-accent text-bg font-bold scale-105 shadow-md'
                      : 'bg-surface border border-border text-secondary'
                  }`}
                >
                  Backspace
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex gap-1.5">
                <div
                  className={`w-14 h-9 rounded flex items-center justify-center font-semibold transition-all ${
                    activeKeySet.has('tab')
                      ? 'bg-accent text-bg font-bold scale-105 shadow-md'
                      : 'bg-surface border border-border text-secondary'
                  }`}
                >
                  Tab
                </div>
                {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'].map((k) => (
                  <div key={k} className="w-9 h-9 rounded bg-surface border border-border text-secondary/60 flex items-center justify-center">
                    {k}
                  </div>
                ))}
                <div className="flex-1 h-9 rounded bg-surface border border-border text-secondary/60 flex items-center justify-center">
                  \
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex gap-1.5">
                <div className="w-16 h-9 rounded bg-surface border border-border text-secondary/60 flex items-center justify-center">
                  Caps
                </div>
                {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\''].map((k) => (
                  <div key={k} className="w-9 h-9 rounded bg-surface border border-border text-secondary/60 flex items-center justify-center">
                    {k}
                  </div>
                ))}
                <div
                  className={`flex-1 h-9 rounded flex items-center justify-center font-semibold transition-all ${
                    activeKeySet.has('enter')
                      ? 'bg-accent text-bg font-bold scale-105 shadow-md'
                      : 'bg-surface border border-border text-secondary'
                  }`}
                >
                  Enter
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex gap-1.5">
                <div
                  className={`w-20 h-9 rounded flex items-center justify-center font-semibold transition-all ${
                    activeKeySet.has('shift')
                      ? 'bg-accent text-bg font-bold scale-105 shadow-md'
                      : 'bg-surface border border-border text-secondary'
                  }`}
                >
                  Shift
                </div>
                {['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'].map((k) => (
                  <div key={k} className="w-9 h-9 rounded bg-surface border border-border text-secondary/60 flex items-center justify-center">
                    {k}
                  </div>
                ))}
                <div
                  className={`w-20 h-9 rounded flex items-center justify-center font-semibold transition-all ${
                    activeKeySet.has('shift')
                      ? 'bg-accent text-bg font-bold scale-105 shadow-md'
                      : 'bg-surface border border-border text-secondary'
                  }`}
                >
                  Shift
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex gap-1.5">
                <div
                  className={`w-12 h-9 rounded flex items-center justify-center font-semibold transition-all ${
                    activeKeySet.has('ctrl')
                      ? 'bg-accent text-bg font-bold scale-105 shadow-md'
                      : 'bg-surface border border-border text-secondary'
                  }`}
                >
                  Ctrl
                </div>
                <div className="w-10 h-9 rounded bg-surface border border-border text-secondary/60 flex items-center justify-center">
                  Alt
                </div>
                <div
                  className={`flex-1 h-9 rounded flex items-center justify-center font-semibold transition-all ${
                    activeKeySet.has('space')
                      ? 'bg-accent text-bg font-bold scale-105 shadow-md'
                      : 'bg-surface border border-border text-secondary'
                  }`}
                >
                  Space
                </div>
                <div className="w-10 h-9 rounded bg-surface border border-border text-secondary/60 flex items-center justify-center">
                  Alt
                </div>
                <div
                  className={`w-24 h-9 rounded flex items-center justify-center font-semibold transition-all ${
                    activeKeySet.has('arrows')
                      ? 'bg-accent/40 text-accent font-bold scale-105 border border-accent/60'
                      : 'bg-surface border border-border text-secondary'
                  }`}
                >
                  Arrows (Locked)
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-secondary/70 text-center">
            Click any shortcut below to highlight its exact physical keys on the map above.
          </p>
        </section>

        {/* Section 3: Verified Keyboard Shortcuts Reference Table & Cards */}
        <section aria-labelledby="all-shortcuts-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
            <div>
              <h2 id="all-shortcuts-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
                All T4Type Keyboard Shortcuts
              </h2>
              <p className="text-xs sm:text-sm text-secondary mt-1">
                Showing {filteredShortcuts.length} of {ALL_SHORTCUTS.length} verified shortcuts.
              </p>
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-accent hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                Reset search filter
              </button>
            )}
          </div>

          {filteredShortcuts.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-2xl bg-surface border border-border text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-secondary/60 mx-auto" aria-hidden="true" />
              <p className="text-base font-semibold text-primary">
                No shortcuts found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto">
                Try searching for key names like &ldquo;Tab&rdquo;, &ldquo;Enter&rdquo;, &ldquo;Space&rdquo;, or actions like &ldquo;restart&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-bg text-xs font-semibold hover:bg-accent-hover transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="w-full overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
              <table className="w-full min-w-[640px] text-left text-xs sm:text-sm border-collapse">
                <thead className="border-b border-border bg-elevated text-primary font-mono text-xs">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold w-[28%]">Shortcut</th>
                    <th className="py-3.5 px-4 font-semibold w-[32%]">Action</th>
                    <th className="py-3.5 px-4 font-semibold">Description &amp; Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-secondary font-sans">
                  {filteredShortcuts.map((item) => {
                    const isHighlighted = highlightedShortcutId === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setHighlightedShortcutId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isHighlighted
                            ? 'bg-accent-soft/40'
                            : 'hover:bg-elevated/40'
                        }`}
                      >
                        {/* Shortcut Keycaps */}
                        <td className="py-4 px-4 align-top">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {item.keys.map((k, idx) => (
                              <React.Fragment key={idx}>
                                {idx > 0 && (
                                  <span className="text-secondary/60 text-xs font-mono font-medium">
                                    {item.isSequential ? 'then' : '+'}
                                  </span>
                                )}
                                <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-mono font-semibold rounded-md bg-elevated border border-border/80 shadow-[0_2px_0_0_var(--color-border)] text-primary">
                                  {k}
                                </kbd>
                              </React.Fragment>
                            ))}
                          </div>
                          {item.isSequential && (
                            <span className="inline-block mt-1.5 text-[10px] font-mono text-accent">
                              Sequential (within 2s)
                            </span>
                          )}
                        </td>

                        {/* Action Name & Category */}
                        <td className="py-4 px-4 align-top">
                          <p className="font-semibold text-primary text-sm">{item.name}</p>
                          <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded bg-elevated text-secondary/90">
                            {item.categoryLabel}
                          </span>
                        </td>

                        {/* Description & Context */}
                        <td className="py-4 px-4 align-top space-y-1.5">
                          <p className="leading-relaxed text-secondary">{item.description}</p>
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                            <span className="text-primary font-medium">Context:</span>
                            <span className="text-secondary/80 font-mono text-[11px]">{item.context}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Section 6: How to Use Keyboard Shortcuts */}
        <section aria-labelledby="how-to-use-heading" className="space-y-4 pt-4 border-t border-border/60">
          <h2 id="how-to-use-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            How to Use Keyboard Shortcuts in T4Type
          </h2>
          <p className="text-secondary leading-relaxed max-w-3xl">
            T4Type supports both sequential commands (like restarting a session) and instant single-key
            actions. Understanding the difference helps you navigate without interrupting your typing flow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
              <span className="text-xs font-mono font-bold text-accent bg-accent-soft w-7 h-7 rounded-lg flex items-center justify-center">
                01
              </span>
              <h3 className="text-base font-semibold text-primary">Single-Key Commands</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Keys like <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-elevated border border-border">Space</kbd> or{' '}
                <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-elevated border border-border">Esc</kbd> trigger their
                actions immediately on press. Space submits your word, and Esc closes active dialogs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
              <span className="text-xs font-mono font-bold text-accent bg-accent-soft w-7 h-7 rounded-lg flex items-center justify-center">
                02
              </span>
              <h3 className="text-base font-semibold text-primary">Sequential Combinations</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                T4Type uses a safe sequential trigger for restarts:{' '}
                <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-elevated border border-border">Tab</kbd> followed by{' '}
                <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-elevated border border-border">Enter</kbd> within 2
                seconds prevents accidental session discards.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
              <span className="text-xs font-mono font-bold text-accent bg-accent-soft w-7 h-7 rounded-lg flex items-center justify-center">
                03
              </span>
              <h3 className="text-base font-semibold text-primary">Accessibility Navigation</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Standard web accessibility controls (<kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-elevated border border-border">Tab</kbd> /{' '}
                <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-elevated border border-border">Shift+Tab</kbd>) cycle through
                interactive elements without ever requiring a mouse.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Practical Tips */}
        <section aria-labelledby="tips-heading" className="space-y-4">
          <h2 id="tips-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            Productivity Tips for Typing Practice
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-correct shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-primary">Keep Hands in Home Row Position</h3>
                <p className="text-xs text-secondary mt-1 leading-relaxed">
                  Rely on Tab + Enter to restart tests so your fingers never leave the home row, maintaining continuous physical rhythm.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-correct shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-primary">Skip and Move Forward with Space</h3>
                <p className="text-xs text-secondary mt-1 leading-relaxed">
                  If you realize you made an error mid-word, pressing Space skips to the next word immediately without penalizing unwritten characters.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-correct shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-primary">Dismiss Settings Instantly</h3>
                <p className="text-xs text-secondary mt-1 leading-relaxed">
                  Press Esc to instantly dismiss the settings panel or custom text editor and automatically refocus your typing cursor.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-correct shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-primary">Arrows are Intentionally Locked</h3>
                <p className="text-xs text-secondary mt-1 leading-relaxed">
                  Arrow keys are intentionally disabled during a typing session to guarantee your cursor never slips out of place.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Windows and macOS Compatibility */}
        <section aria-labelledby="os-compatibility-heading" className="space-y-4">
          <h2 id="os-compatibility-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            Windows and macOS Compatibility
          </h2>
          <p className="text-secondary leading-relaxed max-w-3xl text-sm sm:text-base">
            All T4Type in-app shortcuts function identically across operating systems. When using browser-level
            controls, key mappings adapt naturally to your platform:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
              <h3 className="text-sm font-semibold text-primary">Windows &amp; Linux</h3>
              <ul className="text-xs text-secondary space-y-1.5 font-mono">
                <li>• Restart: <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-border text-primary">Tab</kbd> then <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-border text-primary">Enter</kbd></li>
                <li>• Previous Word: <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-border text-primary">Backspace</kbd></li>
                <li>• Close Modal: <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-border text-primary">Esc</kbd></li>
                <li>• Print Report: <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-border text-primary">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-border text-primary">P</kbd></li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
              <h3 className="text-sm font-semibold text-primary">macOS</h3>
              <ul className="text-xs text-secondary space-y-1.5 font-mono">
                <li>• Restart: <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-border text-primary">Tab</kbd> then <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-border text-primary">Return</kbd> (↵)</li>
                <li>• Previous Word: <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-border text-primary">Delete</kbd> (⌫)</li>
                <li>• Close Modal: <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-border text-primary">Esc</kbd></li>
                <li>• Print Report: <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-border text-primary">Cmd</kbd> (⌘) + <kbd className="px-1.5 py-0.5 rounded bg-elevated border border-border text-primary">P</kbd></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 9: Frequently Asked Questions */}
        <section aria-labelledby="faq-heading" className="space-y-4 pt-4 border-t border-border/60">
          <div className="space-y-1">
            <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-secondary">
              Direct, verified answers to common questions about T4Type keyboard shortcuts.
            </p>
          </div>

          <div className="space-y-3" role="region" aria-label="Keyboard Shortcuts FAQ Accordion">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              const btnId = `faq-btn-${item.id}`;
              const panelId = `faq-panel-${item.id}`;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-surface border border-border overflow-hidden transition-colors"
                >
                  <h3>
                    <button
                      type="button"
                      id={btnId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleFaq(item.id)}
                      className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left font-medium text-sm sm:text-base text-primary hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-secondary shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-accent' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      className="px-5 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-secondary leading-relaxed border-t border-border/60"
                    >
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 10: Final Call to Action */}
        <section className="pt-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-border text-center flex flex-col items-center shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              Ready to Put Your Shortcuts to Use?
            </h2>
            <p className="mt-3 text-secondary text-sm sm:text-base max-w-xl leading-relaxed">
              Open a typing session and practice with the keyboard controls available in T4Type.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={onGoPractice}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px]"
              >
                <span>Start Typing Practice</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-elevated text-secondary hover:text-primary transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
};

export default KeyboardShortcutsPage;
