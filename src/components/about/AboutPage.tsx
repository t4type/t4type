import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import {
  Keyboard,
  Zap,
  Target,
  Activity,
  Clock,
  FileText,
  Quote,
  Sparkles,
  Sliders,
  Hash,
  Volume2,
  Sun,
  Printer,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  GraduationCap,
  Briefcase,
  Code2,
  PenTool,
  Smile,
  Laptop,
} from 'lucide-react';

interface AboutPageProps {
  onGoPractice: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is T4Type?',
    answer:
      'T4Type is a free, minimalist online typing practice platform designed to help you improve your typing speed, accuracy, and keyboard fluency through focused, distraction-free practice sessions directly in your web browser.',
  },
  {
    id: 'faq-2',
    question: 'Is T4Type free to use?',
    answer:
      'Yes, T4Type is 100% free to use. There are no paid tiers, no subscription fees, no locked features, and no credit card requirements.',
  },
  {
    id: 'faq-3',
    question: 'Do I need to create an account?',
    answer:
      'No, T4Type does not require you to create an account, log in, or provide any personal details. You can open the website and begin typing immediately.',
  },
  {
    id: 'faq-4',
    question: 'How is typing speed (WPM) calculated?',
    answer:
      'Typing speed is calculated using the universal standard of five characters per word: WPM = (Correct Characters / 5) / (Elapsed Time in Minutes). This ensures consistent measurement regardless of word lengths.',
  },
  {
    id: 'faq-5',
    question: 'How is typing accuracy calculated?',
    answer:
      'Typing accuracy is calculated as the percentage of correctly entered characters out of the total characters typed: Accuracy = (Correct Characters / Total Characters Typed) × 100.',
  },
  {
    id: 'faq-6',
    question: 'What is Net Speed in typing tests?',
    answer:
      'Net Speed is an efficiency metric calculated as Net Speed = WPM × (Accuracy / 100). It penalizes inaccurate typing and rewards consistency, providing a realistic assessment of usable typing output.',
  },
  {
    id: 'faq-7',
    question: 'Can I practice without a time limit?',
    answer:
      'Yes, you can practice without a countdown by choosing Zen mode for continuous, open-ended typing, or select Word-based tests (10, 25, 50, or 100 words) which finish only when you complete the text.',
  },
  {
    id: 'faq-8',
    question: 'Can I use custom text for typing practice?',
    answer:
      'Yes, T4Type includes a Custom practice mode where you can paste or type your own paragraphs, study notes, vocabulary lists, or programming code snippets to practice targeted material.',
  },
  {
    id: 'faq-9',
    question: 'Does T4Type support mobile devices?',
    answer:
      'Yes, T4Type features a fully responsive layout that adapts seamlessly to desktop monitors, laptops, tablets, and smartphones, supporting both physical keyboards and mobile on-screen keyboards.',
  },
  {
    id: 'faq-10',
    question: 'Can I print or save my typing test results?',
    answer:
      'Yes, upon completing any test session, you can open the printable report modal to preview and print an A4-format performance summary, or save it as a PDF document through your browser print dialog.',
  },
  {
    id: 'faq-11',
    question: 'Can I change the website theme?',
    answer:
      'Yes, T4Type includes both Dark and Light themes. You can switch between them at any time using the theme toggle in the navigation bar or through the settings menu.',
  },
  {
    id: 'faq-12',
    question: 'Does T4Type store my typing history?',
    answer:
      'No, T4Type does not store past typing test histories or send keystrokes to a remote server. Test sessions are processed entirely in your browser runtime, while your preferences are saved locally on your device.',
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
      '@type': 'AboutPage',
      '@id': 'https://t4type.com/about#webpage',
      url: 'https://t4type.com/about',
      name: 'About T4Type – Free Online Typing Practice Platform',
      description:
        'Learn about T4Type, a free online typing practice platform designed to help you improve typing speed, accuracy, and net speed with distraction-free typing tests.',
      isPartOf: {
        '@id': 'https://t4type.com/#website',
      },
      about: {
        '@id': 'https://t4type.com/#organization',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://t4type.com/about#faq',
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

export const AboutPage: React.FC<AboutPageProps> = ({ onGoPractice }) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'About T4Type – Free Online Typing Practice Platform';

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute('content') ?? '';
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Learn about T4Type, a free online typing practice platform designed to help you improve typing speed, accuracy, and net speed with distraction-free typing tests.'
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    const hadCanonical = Boolean(canonical);
    const originalCanonical = canonical?.getAttribute('href') ?? '';
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://t4type.com/about');

    const ogTags: { property: string; content: string }[] = [
      { property: 'og:title', content: 'About T4Type – Free Online Typing Practice Platform' },
      {
        property: 'og:description',
        content:
          'Learn about T4Type, a free online typing practice platform designed to help you improve typing speed, accuracy, and net speed with distraction-free typing tests.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://t4type.com/about' },
      { property: 'og:site_name', content: 'T4Type' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: 'About T4Type – Free Online Typing Practice Platform' },
      {
        property: 'twitter:description',
        content:
          'Learn about T4Type, a free online typing practice platform designed to help you improve typing speed, accuracy, and net speed with distraction-free typing tests.',
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

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleScrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <article className="w-full font-sans text-primary pb-16 sm:pb-24">
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden pt-6 pb-14 sm:pt-12 sm:pb-20 border-b border-border/60">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          <div className="mb-5 flex justify-center">
            <BrandLogo
              variant="vertical"
              size="lg"
              className="h-16 sm:h-20 w-auto"
              ariaLabel="T4Type official logo"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-medium mb-6 border border-accent/20">
            <Keyboard className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Modern, Distraction-Free Typing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary max-w-3xl leading-[1.15]">
            Typing Practice, Made Simple.
          </h1>

          <p className="mt-5 text-base sm:text-lg lg:text-xl text-secondary max-w-2xl leading-relaxed">
            T4Type is a free online typing practice platform designed to help you improve your typing
            speed, accuracy, and confidence through focused, distraction-free practice.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-secondary/80 font-medium">
            Practice at your own pace. Track your performance. Improve one session at a time.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={onGoPractice}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px]"
            >
              <span>Start Practicing</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a
              href="#features"
              onClick={handleScrollToFeatures}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-secondary hover:text-primary hover:border-accent/40 font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px]"
            >
              Explore Features
            </a>
          </div>

          {/* Minimalist Typing Preview Card */}
          <div className="mt-12 w-full max-w-3xl rounded-2xl bg-surface border border-border p-4 sm:p-6 shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-4 text-xs font-mono text-secondary">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent/80 animate-pulse" />
                <span className="text-primary font-medium">time 60s</span>
                <span className="text-border">•</span>
                <span>punctuation</span>
                <span className="text-border">•</span>
                <span>sound on</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-correct font-medium">98% acc</span>
                <span className="text-accent font-semibold">68 wpm</span>
              </div>
            </div>

            <div className="font-mono text-base sm:text-xl leading-relaxed select-none tracking-wide py-2">
              <span className="text-correct">The quick brown fox </span>
              <span className="inline-block relative text-primary font-semibold">
                j
                <span className="absolute -right-0.5 top-0 bottom-0 w-0.5 bg-accent animate-caret" />
              </span>
              <span className="text-secondary/50">umps over the lazy dog. Continuous practice builds steady muscle memory.</span>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs text-secondary">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-correct" aria-hidden="true" />
                <span>Zero login required</span>
              </span>
              <span className="text-xs font-mono bg-elevated px-2 py-1 rounded text-secondary">
                Tab + Enter to restart
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHAT IS T4TYPE? */}
      <section className="py-14 sm:py-20 border-b border-border/60">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              What is T4Type?
            </h2>
            <p className="mt-3 text-secondary text-sm sm:text-base leading-relaxed">
              A modern web application created to make typing practice straightforward, accessible,
              and purposeful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base text-secondary leading-relaxed">
            <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-primary mb-3">
                  Direct In-Browser Practice
                </h3>
                <p>
                  T4Type is an online typing practice tool that runs entirely in your web browser. You
                  can begin typing immediately without installing third-party software, downloading
                  plugins, or navigating complicated onboarding flows.
                </p>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-secondary/80 border-t border-border/60 pt-3">
                Works instantly across modern desktop, tablet, and mobile browsers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-primary mb-3">
                  Comprehensive Performance Feedback
                </h3>
                <p>
                  Every session provides instantaneous, transparent measurement of your typing speed
                  in Words Per Minute (WPM), accuracy percentage, and Net Speed. This helps you track
                  meaningful improvements across different practice formats.
                </p>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-secondary/80 border-t border-border/60 pt-3">
                Calculations strictly follow standard 5-character-per-word metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY T4TYPE EXISTS */}
      <section className="py-14 sm:py-20 border-b border-border/60">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              Why T4Type Exists
            </h2>
            <p className="mt-3 text-secondary text-sm sm:text-base leading-relaxed">
              T4Type was built around simple, user-centered product principles rather than
              distracting gimmicks or advertising walls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-4">
                <Keyboard className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-2">Simplicity First</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Typing practice should be straightforward. You open the site, select your test, and
                start typing without unnecessary steps, popups, or distractions.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-4">
                <Smile className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-2">Accessible to Everyone</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                High-quality typing practice should never be gated behind paywalls or mandatory
                accounts. T4Type is free and accessible on any device with a screen and keyboard.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-4">
                <Target className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-2">Focus on Improvement</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Clear, transparent metrics—WPM, accuracy, and Net Speed—help you identify errors,
                build muscle memory, and refine your typing confidence session by session.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-2">Privacy and Control</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Practice without surveillance. Your test inputs run in client-side memory, and your
                personal preferences are stored strictly in your browser&apos;s local storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURES AND CAPABILITIES */}
      <section id="features" className="py-14 sm:py-20 border-b border-border/60 scroll-mt-6">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              Everything You Need for Better Typing Practice
            </h2>
            <p className="mt-3 text-secondary text-sm sm:text-base leading-relaxed">
              Explore the core tools and customizable options built directly into T4Type to adapt to
              your specific practice goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Time-Based Tests */}
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Clock className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Time-Based Tests</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Practice under time limits of 15, 30, 60, or 120 seconds to measure typing velocity
                and maintain composure under clock pressure.
              </p>
            </div>

            {/* 2. Word-Based Tests */}
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <FileText className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Word-Based Tests</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Set a fixed target of 10, 25, 50, or 100 words. Ideal for pacing yourself and
                improving rhythm without watching a countdown.
              </p>
            </div>

            {/* 3. Quote Typing */}
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Quote className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Quote Typing</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Type curated excerpts from literature, history, and philosophy across short, medium,
                and long lengths with genuine author attribution.
              </p>
            </div>

            {/* 4. Zen Typing Mode */}
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Zen Typing Mode</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                An open-ended, pressure-free freeform typing space with no timer or fixed word count.
                Type continuously and conclude whenever you wish.
              </p>
            </div>

            {/* 5. Custom Practice */}
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Sliders className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Custom Practice</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Paste your own study material, vocabulary lists, coding snippets, or textbook
                passages to drill exactly the content you need.
              </p>
            </div>

            {/* 6. Punctuation and Numbers */}
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Hash className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Punctuation &amp; Numbers</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Toggle special characters, punctuation marks, and numeric keys on or off to practice
                realistic, real-world document and code entry.
              </p>
            </div>

            {/* 7. WPM Measurement */}
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Zap className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">WPM Measurement</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Real-time, normalized Words Per Minute calculation adopting the standardized five
                keystrokes per word standard for honest speed results.
              </p>
            </div>

            {/* 8. Accuracy Tracking */}
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Target className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Accuracy Tracking</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Detailed character-by-character tracking that tallies correct, incorrect, and total
                characters typed for an accurate precision rate.
              </p>
            </div>

            {/* 9. Net Speed Calculation */}
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-correct/10 text-correct flex items-center justify-center mb-3.5">
                <Activity className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Net Speed Calculation</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                A supplementary metric calculated as WPM × (Accuracy / 100) that balances velocity with
                accuracy, showing your true effective typing output.
              </p>
            </div>

            {/* 10. Keyboard Sound Effects */}
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Keyboard Sound Effects</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Optional satisfying mechanical keyboard typing sound synthesized locally through the
                Web Audio API, with instant one-click toggle control.
              </p>
            </div>

            {/* 11. Dark and Light Themes */}
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Sun className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Dark &amp; Light Themes</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Thoughtfully tuned high-contrast color schemes crafted for comfortable day and night
                reading without visual glare or eye strain.
              </p>
            </div>

            {/* 12. Printable Typing Reports */}
            <div className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/40 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Printer className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Printable Reports</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Generate clean, official A4-format performance certificates complete with date, mode,
                WPM, accuracy, Net Speed, and character metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW T4TYPE WORKS */}
      <section className="py-14 sm:py-20 border-b border-border/60">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              Start Practicing in Three Simple Steps
            </h2>
            <p className="mt-3 text-secondary text-sm sm:text-base leading-relaxed">
              No registration forms or downloads. You can begin improving your typing speed within
              seconds of arriving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-surface border border-border relative flex flex-col">
              <span className="text-xs font-mono font-bold text-accent bg-accent-soft w-7 h-7 rounded-lg flex items-center justify-center mb-4">
                01
              </span>
              <h3 className="text-lg font-semibold text-primary mb-2">Choose Your Practice</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Pick a mode that fits your schedule: timed duration (15s–120s), target word count,
                classic quotes, Zen mode, or your own custom text.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-surface border border-border relative flex flex-col">
              <span className="text-xs font-mono font-bold text-accent bg-accent-soft w-7 h-7 rounded-lg flex items-center justify-center mb-4">
                02
              </span>
              <h3 className="text-lg font-semibold text-primary mb-2">Start Typing</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Begin typing the displayed text. The session initiates on your very first keystroke,
                providing real-time color-coded visual character feedback.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-surface border border-border relative flex flex-col">
              <span className="text-xs font-mono font-bold text-correct bg-correct/10 w-7 h-7 rounded-lg flex items-center justify-center mb-4">
                03
              </span>
              <h3 className="text-lg font-semibold text-primary mb-2">Review Your Results</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Inspect your WPM, accuracy, Net Speed, and character metrics immediately. Restart with
                a keystroke or generate a printable performance report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: UNDERSTANDING TYPING PERFORMANCE */}
      <section className="py-14 sm:py-20 border-b border-border/60">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              Measure More Than Just Typing Speed
            </h2>
            <p className="mt-3 text-secondary text-sm sm:text-base leading-relaxed">
              True keyboard mastery balances speed with precision. Learn how T4Type computes your
              performance metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* WPM Card */}
            <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-primary">Words Per Minute (WPM)</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent-soft text-accent">
                    Velocity
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed mb-4">
                  WPM measures raw typing speed. Standard typing conventions define one &quot;word&quot;
                  as exactly five characters, including letters, punctuation, and spaces.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-elevated border border-border/60 text-xs font-mono text-secondary">
                <span className="text-primary font-medium">Formula:</span> (Correct Chars / 5) / Time (min)
              </div>
            </div>

            {/* Accuracy Card */}
            <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-primary">Accuracy</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-elevated text-primary">
                    Precision
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed mb-4">
                  Accuracy represents the percentage of correctly entered characters compared to the
                  total characters you typed throughout the session.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-elevated border border-border/60 text-xs font-mono text-secondary">
                <span className="text-primary font-medium">Formula:</span> (Correct Chars / Total Typed) × 100
              </div>
            </div>

            {/* Net Speed Card */}
            <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-primary">Net Speed</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-correct/10 text-correct">
                    Composite
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed mb-4">
                  Net Speed is T4Type&apos;s supplementary metric combining speed and accuracy to show
                  your usable output rate while penalizing errors.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-elevated border border-border/60 text-xs font-mono text-secondary">
                <span className="text-correct font-medium">Formula:</span> WPM × (Accuracy / 100)
              </div>
            </div>
          </div>

          {/* Metric Calculation Example Visual */}
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border max-w-3xl mx-auto">
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-secondary mb-4 text-center sm:text-left">
              Practical Example Calculation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-elevated">
                <span className="block text-xs text-secondary mb-1">Typing Speed</span>
                <span className="text-xl sm:text-2xl font-bold text-accent">40 WPM</span>
              </div>
              <div className="p-4 rounded-xl bg-elevated">
                <span className="block text-xs text-secondary mb-1">Accuracy</span>
                <span className="text-xl sm:text-2xl font-bold text-primary">95%</span>
              </div>
              <div className="p-4 rounded-xl bg-elevated border border-correct/30">
                <span className="block text-xs text-secondary mb-1">Calculated Net Speed</span>
                <span className="text-xl sm:text-2xl font-bold text-correct">38 WPM</span>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-secondary text-center leading-relaxed">
              Calculation: 40 WPM × (95 / 100) = 38.0 WPM. Net Speed provides an honest assessment
              that rewards careful typing over reckless rushing.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: PRIVACY AND ACCESSIBILITY */}
      <section className="py-14 sm:py-20 border-b border-border/60">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              Practice Freely, With More Control
            </h2>
            <p className="mt-3 text-secondary text-sm sm:text-base leading-relaxed">
              Transparent, verified privacy practices and accessibility standards you can rely on.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-surface border border-border">
              <h3 className="text-base font-semibold text-primary mb-2">No Mandatory Account</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                T4Type does not require user accounts, emails, or passwords. You never have to log in
                or reveal personal identities to practice.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <h3 className="text-base font-semibold text-primary mb-2">Local Browser Storage</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Your theme preferences, sound toggles, test settings, and custom practice text are
                saved strictly on your device via standard browser LocalStorage.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <h3 className="text-base font-semibold text-primary mb-2">Client-Side Execution</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Typing tests and keystroke evaluations run entirely in your local browser memory.
                Keystrokes are never transmitted to external remote servers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <h3 className="text-base font-semibold text-primary mb-2">Keyboard Navigation</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Built with full keyboard shortcut accessibility. Navigate settings and restart tests
                quickly using Tab and Enter without reaching for a mouse.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <h3 className="text-base font-semibold text-primary mb-2">Responsive Across Screens</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Engineered with responsive layouts that automatically scale text and controls across
                smartphones, tablets, laptops, and ultra-wide desktop monitors.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <h3 className="text-base font-semibold text-primary mb-2">Contrast &amp; Legibility</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Dark and Light themes adhere to clear contrast guidelines for extended practice
                sessions without ocular fatigue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: WHO CAN USE T4TYPE? */}
      <section className="py-14 sm:py-20 border-b border-border/60">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              Made for Anyone Who Wants to Type Better
            </h2>
            <p className="mt-3 text-secondary text-sm sm:text-base leading-relaxed">
              Whether you are practicing for school, professional work, or personal enrichment,
              T4Type adapts to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-surface border border-border">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Students</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Develop foundational touch-typing speed to compose academic essays, take lecture notes,
                and complete research projects faster.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Briefcase className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Job Seekers</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Prepare for pre-employment typing assessments, civil service exams, and data entry
                evaluations with timed speed tests.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Laptop className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Working Professionals</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Increase day-to-day productivity when drafting emails, technical reports, and client
                correspondence while reducing physical strain.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Code2 className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Software Developers</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Practice syntax symbols, brackets, and numbers with custom code snippets and
                punctuation modes to boost coding throughput.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <PenTool className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Writers &amp; Authors</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Keep up with rapid creative flow in Zen mode, letting thoughts translate smoothly onto
                the screen without distraction.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3.5">
                <Smile className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-primary mb-1.5">Beginners</h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                Build keyboard familiarity and finger muscle memory at your own tempo without the
                pressure of rigid grading or timers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-14 sm:py-20 border-b border-border/60">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-secondary text-sm sm:text-base leading-relaxed">
              Find direct, clear answers to common questions about T4Type and how it works.
            </p>
          </div>

          <div className="space-y-3" role="region" aria-label="Frequently Asked Questions Accordion">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              const buttonId = `faq-btn-${item.id}`;
              const panelId = `faq-panel-${item.id}`;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-surface border border-border overflow-hidden transition-colors"
                >
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleFaq(item.id)}
                      className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left font-medium text-sm sm:text-base text-primary hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                      aria-labelledby={buttonId}
                      className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-secondary leading-relaxed border-t border-border/60"
                    >
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 10: FINAL CALL TO ACTION */}
      <section className="pt-14 sm:pt-20">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-border text-center flex flex-col items-center shadow-sm">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-primary">
              Ready to Improve Your Typing?
            </h2>
            <p className="mt-3 text-secondary text-sm sm:text-base max-w-xl leading-relaxed">
              Start a typing session, practice at your own pace, and discover where you can improve.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={onGoPractice}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px]"
              >
                <span>Start Typing Now</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};

export default AboutPage;
