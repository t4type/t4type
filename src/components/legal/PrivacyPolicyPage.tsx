import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Database,
  EyeOff,
  Cpu,
  Globe,
  Server,
  UserCheck,
  RefreshCw,
  FileText,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  Info,
  Cookie,
} from 'lucide-react';

interface PrivacyPolicyPageProps {
  onGoPractice: () => void;
}

interface TOCItem {
  id: string;
  title: string;
}

const TOC_ITEMS: TOCItem[] = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'information-we-handle', title: '2. Information We Handle' },
  { id: 'typing-activity', title: '3. Typing Activity & Processing' },
  { id: 'browser-storage', title: '4. Browser Storage & LocalStorage' },
  { id: 'cookies', title: '5. Cookies & Tracking Technologies' },
  { id: 'third-party-services', title: '6. Third-Party Services & Infrastructure' },
  { id: 'how-we-use-information', title: '7. How Information Is Used' },
  { id: 'data-sharing', title: '8. Data Sharing & Disclosure' },
  { id: 'data-retention', title: '9. Data Retention & Deletion' },
  { id: 'data-security', title: '10. Data Security Safeguards' },
  { id: 'childrens-privacy', title: "11. Children's Privacy" },
  { id: 'user-rights', title: '12. User Rights & Browser Controls' },
  { id: 'international-users', title: '13. International Access & Hosting' },
  { id: 'changes-to-policy', title: '14. Changes to This Privacy Policy' },
  { id: 'contact', title: '15. Contact & Privacy Inquiries' },
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
      '@id': 'https://t4type.com/privacy#webpage',
      url: 'https://t4type.com/privacy',
      name: 'Privacy Policy – T4Type',
      description:
        'Read the T4Type Privacy Policy. Learn how we handle browser storage, typing activity, local settings, and data protection with complete transparency.',
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
            name: 'Privacy Policy',
            item: 'https://t4type.com/privacy',
          },
        ],
      },
    },
  ],
};

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onGoPractice }) => {
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('introduction');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Privacy Policy – T4Type';

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute('content') ?? '';
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Read the T4Type Privacy Policy. Learn how we handle browser storage, typing activity, local settings, and data protection with complete transparency.'
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    const hadCanonical = Boolean(canonical);
    const originalCanonical = canonical?.getAttribute('href') ?? '';
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://t4type.com/privacy');

    const ogTags: { property: string; content: string }[] = [
      { property: 'og:title', content: 'Privacy Policy – T4Type' },
      {
        property: 'og:description',
        content:
          'Read the T4Type Privacy Policy. Learn how we handle browser storage, typing activity, local settings, and data protection with complete transparency.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://t4type.com/privacy' },
      { property: 'og:site_name', content: 'T4Type' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: 'Privacy Policy – T4Type' },
      {
        property: 'twitter:description',
        content:
          'Read the T4Type Privacy Policy. Learn how we handle browser storage, typing activity, local settings, and data protection with complete transparency.',
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

  // IntersectionObserver to highlight active section in TOC while scrolling
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    TOC_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    setIsMobileTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      if (typeof window !== 'undefined' && window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  };

  const currentActiveItem = TOC_ITEMS.find((item) => item.id === activeSection);

  return (
    <article className="w-full font-sans text-primary pb-16 sm:pb-24 overflow-x-hidden">
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      {/* Header / Intro Hero Section */}
      <header className="border-b border-border/60 pt-6 pb-8 sm:pt-10 sm:pb-12 bg-bg">
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
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>LEGAL DOCUMENTATION</span>
            </div>
          </div>

          <h1 className="text-[clamp(1.75rem,3.5vw+0.5rem,2.75rem)] font-bold tracking-tight text-primary leading-[1.2] break-words">
            Privacy Policy
          </h1>

          <p className="mt-4 text-[15px] sm:text-base lg:text-lg text-secondary max-w-3xl leading-[1.7] sm:leading-[1.75] break-words">
            This Privacy Policy explains how T4Type (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
            operates, how information is handled, what data is stored locally in your browser, and
            how we prioritize minimal data collection across our platform at{' '}
            <span className="font-mono text-primary font-medium break-all">https://t4type.com</span>.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-secondary">
            <span>Last Updated: November 2026</span>
            <span className="text-secondary/40" aria-hidden="true">•</span>
            <span>Version: 1.2 (Client-First Architecture)</span>
          </div>
        </div>
      </header>

      {/* Main Content Area: Responsive 2-column on Tablet & Desktop, Single-column on Mobile */}
      <div className="w-[96vw] sm:w-[94vw] lg:w-[92vw] xl:w-[90vw] max-w-[1240px] mx-auto px-2 sm:px-4 lg:px-6 pt-6 sm:pt-10">
        <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8 xl:gap-12">
          {/* Table of Contents Container */}
          <aside className="w-full md:w-52 lg:w-60 xl:w-64 shrink-0 min-w-0">
            {/* Mobile Collapsible TOC (below 768px) */}
            <div className="block md:hidden w-full rounded-2xl bg-surface border border-border p-3.5 sm:p-4 mb-4 shadow-sm">
              <button
                type="button"
                onClick={() => setIsMobileTocOpen((prev) => !prev)}
                className="w-full flex items-center justify-between text-left text-sm font-semibold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg py-1"
                aria-expanded={isMobileTocOpen}
                aria-controls="mobile-toc-list"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <FileText className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                  <span className="truncate">Table of Contents</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-elevated text-secondary font-mono font-normal shrink-0">
                    15
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-secondary shrink-0 transition-transform duration-200 ${
                    isMobileTocOpen ? 'rotate-180 text-accent' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {!isMobileTocOpen && currentActiveItem && (
                <div className="mt-2 text-xs text-secondary truncate font-mono border-t border-border/40 pt-2 flex items-center gap-1.5">
                  <span className="text-secondary/60">Current:</span>
                  <span className="text-accent truncate font-sans font-medium">{currentActiveItem.title}</span>
                </div>
              )}

              {isMobileTocOpen && (
                <nav
                  id="mobile-toc-list"
                  aria-label="Mobile Table of Contents"
                  className="mt-3 pt-3 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-secondary"
                >
                  {TOC_ITEMS.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => scrollToSection(e, item.id)}
                        className={`block py-1.5 px-2.5 rounded-lg transition-colors truncate ${
                          isActive
                            ? 'bg-accent-soft text-accent font-medium'
                            : 'hover:text-primary hover:bg-elevated'
                        }`}
                      >
                        {item.title}
                      </a>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Tablet & Desktop Sticky TOC Sidebar (768px and above) */}
            <div className="hidden md:block sticky top-20 max-h-[calc(100dvh-5.5rem)] overflow-y-auto no-scrollbar rounded-2xl bg-surface border border-border p-4 lg:p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80 text-xs font-semibold uppercase tracking-wider text-primary">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                  <span className="truncate">Contents</span>
                </div>
                <span className="text-[11px] font-mono font-normal text-secondary bg-elevated px-1.5 py-0.5 rounded shrink-0">
                  15 items
                </span>
              </div>
              <nav aria-label="Desktop and Tablet Table of Contents" className="space-y-1 text-xs">
                {TOC_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`block py-1.5 px-2.5 rounded-lg transition-colors leading-snug truncate ${
                        isActive
                          ? 'bg-accent-soft text-accent font-medium border-l-2 border-accent'
                          : 'text-secondary hover:text-primary hover:bg-elevated'
                      }`}
                      title={item.title}
                    >
                      {item.title}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-5 pt-4 border-t border-border/60 text-xs text-secondary space-y-2">
                <p className="font-medium text-primary text-[11px] uppercase tracking-wide">Highlights:</p>
                <div className="flex items-center gap-2 text-secondary">
                  <CheckCircle2 className="w-3.5 h-3.5 text-correct shrink-0" aria-hidden="true" />
                  <span className="text-[11px] leading-tight">No account required</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <CheckCircle2 className="w-3.5 h-3.5 text-correct shrink-0" aria-hidden="true" />
                  <span className="text-[11px] leading-tight">Keystrokes stay local</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <CheckCircle2 className="w-3.5 h-3.5 text-correct shrink-0" aria-hidden="true" />
                  <span className="text-[11px] leading-tight">Zero ad tracking cookies</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Policy Content (full width on mobile, balanced reading width on tablet & desktop) */}
          <div
            role="region"
            aria-label="Privacy Policy content"
            className="flex-1 min-w-0 space-y-10 sm:space-y-12 text-[15px] sm:text-base text-secondary leading-[1.7] sm:leading-[1.75]"
          >
            {/* Section 1: Introduction */}
            <section id="introduction" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <Info className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>1. Introduction</span>
              </h2>
              <p className="break-words">
                Welcome to T4Type (<span className="text-primary font-medium font-mono break-all">https://t4type.com</span>).
                T4Type is an independent, free online typing practice platform designed to help users
                measure and improve their typing speed, accuracy, and keyboard confidence in a clean,
                distraction-free environment.
              </p>
              <p className="break-words">
                We believe that modern web applications should respect user privacy by default. We have
                architected T4Type as a client-first application: the core typing engine, timer logic,
                keystroke evaluation, and metric calculations run entirely within your local browser
                runtime.
              </p>
              <p className="break-words">
                This Privacy Policy describes our practices regarding information processing, local
                browser storage, and external hosting infrastructure. By accessing or using T4Type, you
                acknowledge that you have read and understood the practices described herein.
              </p>
            </section>

            {/* Section 2: Information We Handle */}
            <section id="information-we-handle" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <UserCheck className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>2. Information We Handle</span>
              </h2>
              <p className="break-words">
                To provide transparency, we clearly categorize information into what is submitted, what
                is processed by network infrastructure, and what is explicitly not collected.
              </p>

              <div className="space-y-3.5">
                <div className="w-full min-w-0 p-4 sm:p-5 rounded-2xl bg-surface border border-border break-words shadow-sm">
                  <h3 className="text-sm sm:text-base font-semibold text-primary mb-2">
                    A. Information We Do NOT Collect
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-secondary">
                    <li>
                      <strong className="text-primary font-medium">Personal Identity:</strong> We do not require,
                      request, or store your real name, email address, physical address, phone number,
                      or account credentials.
                    </li>
                    <li>
                      <strong className="text-primary font-medium">Financial Information:</strong> T4Type is
                      completely free. We do not collect credit cards, bank accounts, or payment data.
                    </li>
                    <li>
                      <strong className="text-primary font-medium">Biometric or Audio Recordings:</strong> Although
                      T4Type provides synthesized mechanical keyboard sounds, these are generated
                      locally using the Web Audio API. We do not access your microphone or record audio.
                    </li>
                    <li>
                      <strong className="text-primary font-medium">Persistent Typing History:</strong> We do not
                      maintain a remote database of your past test scores, mistake logs, or historical
                      WPM records.
                    </li>
                  </ul>
                </div>

                <div className="w-full min-w-0 p-4 sm:p-5 rounded-2xl bg-surface border border-border break-words shadow-sm">
                  <h3 className="text-sm sm:text-base font-semibold text-primary mb-2">
                    B. Information You Directly Provide
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-secondary">
                    <li>
                      <strong className="text-primary font-medium">Custom Practice Text:</strong> If you use the
                      Custom Practice feature, the text you paste or enter is stored only in your
                      browser&apos;s LocalStorage so you can practice it again. It is never transmitted
                      to our servers.
                    </li>
                    <li>
                      <strong className="text-primary font-medium">Printable Report Name:</strong> If you choose to
                      generate a printable test certificate, you may optionally input a name to appear
                      on the printed sheet. This name is stored solely in volatile React state in your
                      current tab and is discarded when the tab is closed or refreshed.
                    </li>
                  </ul>
                </div>

                <div className="w-full min-w-0 p-4 sm:p-5 rounded-2xl bg-surface border border-border break-words shadow-sm">
                  <h3 className="text-sm sm:text-base font-semibold text-primary mb-2">
                    C. Technical Infrastructure Logs
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                    When you access any web server on the Internet, standard network requests
                    automatically transmit basic technical data. Our web hosting and CDN infrastructure
                    process standard HTTP request logs (such as your IP address, browser User-Agent,
                    operating system, referring URL, and request timestamps) strictly to deliver static
                    files over HTTPS, ensure network availability, and defend against malicious attacks
                    or automated denial-of-service attempts.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Typing Activity and Test Results */}
            <section id="typing-activity" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <Cpu className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>3. Typing Activity &amp; Keystroke Processing</span>
              </h2>
              <p className="break-words">
                A core priority of T4Type is ensuring that your typing activity remains private to you.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-primary font-medium">Local Keystroke Handling:</strong> As you type
                  characters during a session, input events are processed directly in your browser&apos;s
                  JavaScript engine. Characters are compared in real time against the target prompt
                  in local memory.
                </li>
                <li>
                  <strong className="text-primary font-medium">Local Metric Computation:</strong> Speed in Words Per
                  Minute (WPM), Accuracy percentage, Net Speed, and character error counts are computed
                  locally on your device.
                </li>
                <li>
                  <strong className="text-primary font-medium">No Remote Keystroke Streaming:</strong> We do not
                  stream, log, or transmit your individual keystrokes, typing cadence, or test results
                  to any external server, analytics endpoint, or third-party service.
                </li>
                <li>
                  <strong className="text-primary font-medium">Volatile Session Memory:</strong> Once a test
                  completes, the results are displayed on your screen. If you refresh the page or start
                  a new test, previous session results are cleared from memory.
                </li>
              </ul>
            </section>

            {/* Section 4: Browser Storage & LocalStorage */}
            <section id="browser-storage" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <Database className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>4. Browser Storage &amp; LocalStorage</span>
              </h2>
              <p className="break-words">
                T4Type utilizes the Web Storage API (<span className="font-mono text-primary font-medium text-xs sm:text-sm px-1.5 py-0.5 rounded bg-elevated border border-border/50">window.localStorage</span>)
                to preserve your preferred practice configuration between visits. LocalStorage is stored
                exclusively on your physical device and is never automatically sent with HTTP network
                requests.
              </p>

              {/* Responsive Table Wrapper */}
              <div className="w-full my-4 min-w-0">
                <div className="flex items-center justify-between text-[11px] text-secondary/70 sm:hidden px-1 mb-1.5 font-mono">
                  <span>Storage Details</span>
                  <span>Swipe horizontally &rarr;</span>
                </div>
                <div className="w-full overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
                  <table className="w-full min-w-[500px] text-left text-xs sm:text-sm border-collapse">
                    <thead className="border-b border-border bg-elevated text-primary font-mono text-xs">
                      <tr>
                        <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold w-[28%]">Storage Key</th>
                        <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold w-[32%]">Content Stored</th>
                        <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-secondary font-sans">
                      <tr className="hover:bg-elevated/40 transition-colors">
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-mono text-primary font-medium break-all">t4type-theme</td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">&quot;dark&quot; or &quot;light&quot;</td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">Remembers selected interface theme.</td>
                      </tr>
                      <tr className="hover:bg-elevated/40 transition-colors">
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-mono text-primary font-medium break-all">t4type-settings</td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">Font size, difficulty mode, sound toggle</td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">Preserves user display &amp; sound preferences.</td>
                      </tr>
                      <tr className="hover:bg-elevated/40 transition-colors">
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-mono text-primary font-medium break-all">t4type-config</td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">Mode, time limit, word count, punctuation/numbers</td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">Restores last chosen typing test configuration.</td>
                      </tr>
                      <tr className="hover:bg-elevated/40 transition-colors">
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-mono text-primary font-medium break-all">t4type-custom-text</td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">User-entered custom practice text</td>
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">Allows you to practice your custom text across visits.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="w-full min-w-0 p-4 sm:p-5 rounded-xl bg-elevated border border-border/80 text-xs sm:text-sm break-words shadow-sm">
                <p className="font-semibold text-primary mb-1">How to Clear Stored Preferences:</p>
                <p className="text-secondary leading-relaxed">
                  You have full control over LocalStorage. You can clear these preferences at any time
                  through your browser settings by navigating to Developer Tools &gt; Application &gt;
                  Local Storage, or by selecting &ldquo;Clear Browsing Data &gt; Cookies and Site
                  Data&rdquo; in your browser menu.
                </p>
              </div>
            </section>

            {/* Section 5: Cookies and Similar Technologies */}
            <section id="cookies" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <Cookie className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>5. Cookies &amp; Tracking Technologies</span>
              </h2>
              <p className="break-words">
                <strong className="text-primary font-medium">T4Type does not set or use advertising cookies, marketing cookies, or user tracking cookies.</strong>
              </p>
              <p className="break-words">
                Unlike many commercial web platforms, we do not employ tracking pixels, web beacons,
                canvas fingerprinting, or cross-site tracking scripts.
              </p>
              <p className="break-words">
                Standard hosting, Content Delivery Networks (CDNs), or security firewalls may set
                strictly necessary technical session cookies (such as security tokens) to balance
                server load or verify legitimate browser connections against bot attacks. These technical
                cookies do not track your activity across other websites.
              </p>
            </section>

            {/* Section 6: Third-Party Services and Infrastructure */}
            <section id="third-party-services" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <Server className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>6. Third-Party Services &amp; Infrastructure</span>
              </h2>
              <p className="break-words">
                We minimize our reliance on external third-party services to prevent unnecessary data
                leakage:
              </p>

              <div className="space-y-3.5">
                <div className="w-full min-w-0 p-4 sm:p-5 rounded-2xl bg-surface border border-border break-words shadow-sm">
                  <h3 className="text-sm sm:text-base font-semibold text-primary mb-1.5">
                    Hosting &amp; Content Delivery Networks (CDNs)
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                    T4Type is hosted on modern cloud infrastructure that provides secure HTTPS
                    termination and global static asset caching. These hosting systems receive standard
                    network metadata (such as IP addresses and request headers) to route incoming web
                    traffic securely and reliably.
                  </p>
                </div>

                <div className="w-full min-w-0 p-4 sm:p-5 rounded-2xl bg-surface border border-border break-words shadow-sm">
                  <h3 className="text-sm sm:text-base font-semibold text-primary mb-1.5">
                    No External Analytics or Ad Networks
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                    We do not load third-party analytics trackers (such as Google Analytics) or commercial
                    advertising networks on T4Type.
                  </p>
                </div>

                <div className="w-full min-w-0 p-4 sm:p-5 rounded-2xl bg-surface border border-border break-words shadow-sm">
                  <h3 className="text-sm sm:text-base font-semibold text-primary mb-1.5">
                    Local Web Audio &amp; System Fonts
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                    We do not make external HTTP requests to fetch Google Fonts or third-party audio
                    files. All fonts utilize your operating system&apos;s native system font stack, and
                    mechanical typing clicks are synthesized mathematically via the Web Audio API.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: How Information Is Used */}
            <section id="how-we-use-information" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>7. How Information Is Used</span>
              </h2>
              <p className="break-words">
                Information processed in your browser or through infrastructure is used strictly for
                legitimate functional purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-secondary">
                <li>To execute real-time typing tests and calculate accurate WPM and Net Speed metrics.</li>
                <li>To remember your selected theme, font size, sound, and practice settings between sessions.</li>
                <li>To preserve your custom practice text on your device so you do not have to re-enter it.</li>
                <li>To render on-demand printable performance reports at your explicit request.</li>
                <li>To deliver static application assets securely over encrypted HTTPS connections.</li>
                <li>To protect our infrastructure against distributed denial-of-service (DDoS) and bot attacks.</li>
              </ul>
              <p className="text-xs sm:text-sm text-secondary break-words">
                We do not sell, rent, monetize, or use your data for algorithmic profiling or targeted
                advertising.
              </p>
            </section>

            {/* Section 8: Data Sharing and Disclosure */}
            <section id="data-sharing" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <EyeOff className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>8. Data Sharing &amp; Disclosure</span>
              </h2>
              <p className="break-words">
                Because T4Type does not maintain a central database of user identities, profiles, or test
                results, we have no personal typing data to share, sell, or disclose.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-secondary">
                <li>
                  <strong className="text-primary font-medium">No Sale of Personal Data:</strong> We do not sell or
                  share personal information with data brokers or marketing firms.
                </li>
                <li>
                  <strong className="text-primary font-medium">Infrastructure Providers:</strong> Cloud hosting and
                  network routing providers process standard technical request traffic solely on our
                  behalf to deliver the website.
                </li>
                <li>
                  <strong className="text-primary font-medium">Legal Requirements:</strong> We may disclose
                  technical network logs only if strictly required to do so by applicable laws, court
                  orders, or lawful governmental requests.
                </li>
              </ul>
            </section>

            {/* Section 9: Data Retention and Deletion */}
            <section id="data-retention" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <RefreshCw className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>9. Data Retention &amp; Deletion</span>
              </h2>
              <p className="break-words">
                Our data retention model is governed by our client-first architecture:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-secondary">
                <li>
                  <strong className="text-primary font-medium">Volatile Session Data:</strong> Keystrokes, current
                  timer progress, test score calculations, and the optional name used for print reports
                  reside solely in volatile memory and are cleared when you navigate away or restart a
                  session.
                </li>
                <li>
                  <strong className="text-primary font-medium">Browser LocalStorage:</strong> Preference settings and
                  custom text remain in your browser until you clear your browser data or manually reset
                  them.
                </li>
                <li>
                  <strong className="text-primary font-medium">Infrastructure Logs:</strong> Temporary technical
                  access logs maintained by hosting infrastructure are retained only for standard
                  diagnostic and security cycles in accordance with hosting provider retention schedules.
                </li>
              </ul>
            </section>

            {/* Section 10: Data Security Safeguards */}
            <section id="data-security" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <Lock className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>10. Data Security Safeguards</span>
              </h2>
              <p className="break-words">
                We employ reasonable technical and organizational measures to safeguard the website:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-secondary">
                <li>
                  <strong className="text-primary font-medium">HTTPS Encryption:</strong> All communications between
                  your web browser and t4type.com are encrypted in transit using industry-standard
                  Transport Layer Security (TLS/HTTPS).
                </li>
                <li>
                  <strong className="text-primary font-medium">Data Minimization:</strong> By ensuring that test
                  data, keystrokes, and user content are not transmitted to remote servers, we eliminate
                  the risk of centralized server data breaches.
                </li>
                <li>
                  <strong className="text-primary font-medium">Modern Codebase Standards:</strong> T4Type is built
                  with modern, audited frontend libraries and static builds to reduce vulnerability
                  attack surfaces.
                </li>
              </ul>
              <p className="text-xs text-secondary/80 break-words">
                Please note that no method of transmission over the Internet or electronic storage is
                100% infallible; however, our architectural decision not to collect personal data
                inherently minimizes privacy exposure.
              </p>
            </section>

            {/* Section 11: Children's Privacy */}
            <section id="childrens-privacy" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <ShieldCheck className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>11. Children&apos;s Privacy</span>
              </h2>
              <p className="break-words">
                T4Type is an educational and productivity utility designed for typists of all ages,
                including students learning keyboard skills.
              </p>
              <p className="break-words">
                Because T4Type does not require user registration, accounts, or the collection of
                personal contact information, we do not knowingly solicit or collect personal data from
                children under 13 (or under applicable regional thresholds, such as 16 in certain
                European jurisdictions) in compliance with regulations like the Children&apos;s Online
                Privacy Protection Act (COPPA).
              </p>
            </section>

            {/* Section 12: User Rights & Browser Controls */}
            <section id="user-rights" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <Globe className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>12. User Rights &amp; Browser Controls</span>
              </h2>
              <p className="break-words">
                Depending on your location, you may have statutory rights under data protection laws
                such as the EU/UK General Data Protection Regulation (GDPR) or the California Consumer
                Privacy Act (CCPA/CPRA). These typically include rights to access, rectify, delete, or
                restrict processing of personal data.
              </p>
              <p className="break-words">
                Because T4Type does not maintain user accounts or personal databases, your data rights
                are exercised directly through your browser controls:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-secondary">
                <li>
                  <strong className="text-primary font-medium">Access &amp; Deletion:</strong> You can view, edit,
                  or delete all locally stored data at any time by clearing your browser&apos;s site data
                  or LocalStorage for <span className="font-mono text-primary font-medium">t4type.com</span>.
                </li>
                <li>
                  <strong className="text-primary font-medium">Audio Control:</strong> You can enable or disable
                  keyboard sound effects at any moment via the sound toggle icon or settings panel.
                </li>
                <li>
                  <strong className="text-primary font-medium">Custom Content Control:</strong> You can clear custom
                  typing text directly in the Custom Text editor modal.
                </li>
              </ul>
            </section>

            {/* Section 13: International Access & Hosting */}
            <section id="international-users" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <Globe className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>13. International Access &amp; Hosting</span>
              </h2>
              <p className="break-words">
                T4Type is accessible globally. Our static web hosting and Content Delivery Network
                utilize globally distributed edge servers to serve content with minimal latency. If you
                access the website from outside our hosting regions, standard technical network packets
                are routed across international networks as part of normal web transmission.
              </p>
            </section>

            {/* Section 14: Changes to This Privacy Policy */}
            <section id="changes-to-policy" className="scroll-mt-24 space-y-4 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <RefreshCw className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>14. Changes to This Privacy Policy</span>
              </h2>
              <p className="break-words">
                We may periodically update this Privacy Policy to reflect modifications in our features,
                technical architecture, or relevant legal requirements. When updates occur, we will
                revise the &ldquo;Last Updated&rdquo; date at the top of this page.
              </p>
              <p className="break-words">
                We encourage users to periodically review this page to stay informed about how we protect
                your privacy.
              </p>
            </section>

            {/* Section 15: Contact & Privacy Inquiries */}
            <section id="contact" className="scroll-mt-24 space-y-4 pt-4 border-t border-border/80 min-w-0">
              <h2 className="text-[clamp(1.2rem,2vw+0.5rem,1.5rem)] font-bold tracking-tight text-primary flex items-center gap-2.5 break-words">
                <ShieldCheck className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <span>15. Contact &amp; Privacy Inquiries</span>
              </h2>
              <p className="break-words">
                If you have questions, feedback, or concerns regarding this Privacy Policy or our data
                handling practices, you can reach out through our official platform domain:
              </p>
              <div className="w-full min-w-0 p-4 sm:p-6 rounded-2xl bg-surface border border-border space-y-3 break-words shadow-sm">
                <p className="font-semibold text-primary text-base">T4Type Platform</p>
                <p className="text-xs sm:text-sm text-secondary flex flex-wrap items-baseline gap-1.5">
                  <span className="font-medium text-primary">Website:</span>
                  <a
                    href="https://t4type.com"
                    className="text-accent hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-accent font-mono break-all"
                  >
                    https://t4type.com
                  </a>
                </p>
                <p className="text-xs sm:text-sm text-secondary flex flex-wrap items-baseline gap-1.5">
                  <span className="font-medium text-primary">Legal &amp; Privacy Inquiries:</span>
                  <a
                    href="mailto:contact@t4type.com"
                    className="text-accent hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-accent font-mono break-all"
                  >
                    contact@t4type.com
                  </a>
                </p>
              </div>
            </section>

            {/* Bottom Navigation CTA */}
            <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-border/60">
              <button
                type="button"
                onClick={onGoPractice}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent min-h-[44px]"
              >
                <span>Return to Typing Practice</span>
              </button>
              <span className="text-xs text-secondary text-center sm:text-right">
                Thank you for practicing with T4Type.
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PrivacyPolicyPage;
