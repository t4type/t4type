# T4Type

> **Practice typing. Improve every day.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38b2ac.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**T4Type** is a free, open-source typing practice platform designed to help people improve their typing speed and accuracy through a clean, modern, distraction-free experience.

- **Official Website**: [https://t4type.com](https://t4type.com)
- **Source Code**: [https://github.com/T4Type/t4type](https://github.com/T4Type/t4type)

---

## Table of Contents

- [About T4Type](#about-t4type)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Privacy & Local Storage](#privacy--local-storage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## About T4Type

Many modern typing tools are cluttered with ads, compulsory account sign-ups, intrusive trackers, or overwhelming dashboard statistics that distract from the core goal: building muscle memory and typing confidence.

T4Type was created to offer an alternative:
- **Distraction-Free Focus**: Clean typography, borderless workspace, and statistics hidden during active typing tests so you can concentrate solely on the text.
- **Zero Friction**: No login, no registration, no backend database, and zero tracking. Open the site and start typing immediately.
- **Privacy by Design**: All typing tests, timer computations, and personal preferences remain strictly inside your browser.
- **Free & Open Source**: Built by and for the community under the permissive MIT license.

---

## Features

All features listed below are currently implemented and functional in T4Type:

### 1. Five Dedicated Practice Modes
- **Time Mode**: Timed typing sprints (15, 30, 60, or 120 seconds) with an auto-extending word stream.
- **Words Mode**: Target fixed word quotas (10, 25, 50, or 100 words).
- **Quotes Mode**: Practice curated passages in Short, Medium, and Long lengths with author attribution.
- **Zen Mode**: Unbounded, freeform typing without timers or word limits, with a manual session finish button.
- **Custom Mode**: Paste or type your own practice passages with an inline editor and local persistence.

### 2. Flexible Content Toggles
- **Punctuation (`@`)**: Seamlessly adds commas, periods, quotation marks, and apostrophes to generated practice text.
- **Numbers (`#`)**: Introduces numeric digits into practice passages.
- *Note: Content toggles apply cleanly to subsequent tests without disrupting ongoing sessions.*

### 3. Responsive Typing Engine & Live Feedback
- **Character-by-Character Highlighting**: Visual distinction for untyped characters, correct keystrokes, and errors.
- **Dynamic Caret**: Real-time cursor tracking following the active typing position.
- **Active Word Highlight**: Subtle visual container highlighting the word currently being typed.
- **Keystroke Audio**: Synthesized keystroke sound effects with a distinct error tone powered by the Web Audio API (optional, can be toggled on or off).
- **Backspace & Corrections**: Full support for backspacing and correcting mistaken letters.
- **Cross-Platform Input**: Transparent unified input handling ensuring compatibility across desktop keyboards and mobile virtual keyboards.

### 4. Timer & Progress Visualization
- **Drift-Free Timer**: High-precision timestamp timing (`Date.now()`) resilient to browser background tab throttling.
- **Live Visual Progress**: Subtle countdown display for Time mode and dynamic progress bars for Words, Quotes, and Custom modes.

### 5. Results & Performance Metrics
- **Post-Test Display**: WPM, Accuracy, and character breakdowns remain hidden during typing and appear immediately upon test completion.
- **Standardized Calculations**:
  - **WPM**: Net words per minute calculated as `(correctCharacters / 5) / (durationInMinutes)`.
  - **Accuracy**: Percentage calculated as `(correctCharacters / totalCharacters) * 100`.
- **Detailed Metric Breakdown**: Summary cards showing correct characters, incorrect characters, total characters, and elapsed time.
- **Keyboard Shortcuts**: Quick restart and new test navigation using `Tab + Enter`.

### 6. Professional Printable Performance Report
- **A4 Report Generation**: Generate a formal, single-page A4 typing performance report ready for printing or saving to PDF.
- **Personalized Header**: Optional prompt for the participant's name (held strictly in temporary component memory).
- **Formal Verification Reference**: Generates a unique local report reference ID (e.g. `T4T-YYYYMMDD-XXXXXX`), timestamp, and disclaimer.
- **Dedicated Print Stylesheet**: Excludes website UI, modals, and navigation bars from printed output.

### 7. Themes & Accessibility
- **Dark & Light Modes**: High-contrast, carefully tuned palettes with instant switching and anti-FOUT inline script hydration.
- **Customizable Preferences**: Adjustable font sizing (`Small`, `Medium`, `Large`), vocabulary difficulty (`Easy`, `Normal`, `Advanced`), and sound effects.
- **Full Viewport Layout**: Optimized for `100vh`/`100dvh` to minimize unnecessary vertical scrolling on desktop resolutions (`1366x768`, `1440x900`, `1920x1080`).

---

## Screenshots

<!-- Add screenshot files to docs/screenshots/ when available -->

| Practice Interface | Active Typing Test | Performance Report |
| :---: | :---: | :---: |
| ![Practice Interface](docs/screenshots/homepage.png) | ![Active Typing Test](docs/screenshots/typing-test.png) | ![Performance Report](docs/screenshots/results.png) |

> *Note: Screenshot assets can be placed in `docs/screenshots/`.*

---

## Technology Stack

T4Type is built using a modern, lightweight frontend stack with zero server dependencies:

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/) (Strict mode enabled)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with PostCSS & Autoprefixer
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting**: [ESLint 9](https://eslint.org/) with `typescript-eslint` and React Hooks rules
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (`npm install -g pnpm`)
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/T4Type/t4type.git
   cd t4type
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the local development server**:
   ```bash
   pnpm dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173` to view the application.

---

## Project Structure

```
T4Type/
├── public/
│   └── favicon.svg               # Application favicon
├── src/
│   ├── components/
│   │   ├── layout/               # Global page frame
│   │   │   ├── Navbar.tsx        # Navigation header, logo, theme & settings triggers
│   │   │   └── Footer.tsx        # Minimal footer & project links
│   │   ├── modes/                # Mode configuration and control bar
│   │   │   ├── ContentOptions.tsx# Punctuation and numbers switches
│   │   │   ├── CustomTextEditor.tsx # Custom passage editor
│   │   │   ├── ModeConfiguration.tsx # Time / words / quote duration pills
│   │   │   ├── ModeSelector.tsx  # Practice mode selector tabs
│   │   │   └── PracticeToolbar.tsx # Combined practice controls bar
│   │   ├── results/              # Completion results & reporting
│   │   │   ├── PrintableReport.tsx # Single-page A4 print document layout
│   │   │   ├── PrintNameModal.tsx  # Modal prompt for participant report name
│   │   │   ├── ReportPreviewModal.tsx # Screen preview modal for printable report
│   │   │   └── ResultsPanel.tsx    # WPM, accuracy, and metric breakdown panel
│   │   ├── settings/
│   │   │   └── SettingsPanel.tsx # Font size, vocabulary difficulty, sound toggles
│   │   └── typing/               # Core interactive typing area
│   │       ├── TimerDisplay.tsx  # Countdown, progress bar, and status line
│   │       ├── TypingArea.tsx    # Full-width typing canvas and input surface
│   │       └── TypingCharacter.tsx # Individual character & cursor rendering
│   ├── data/
│   │   ├── quotes.ts             # Curated quote repository categorized by length
│   │   └── words.ts              # Tiered difficulty word banks & generators
│   ├── hooks/
│   │   ├── usePracticeConfig.ts  # Mode, limits, and content options state & persistence
│   │   ├── usePracticeSettings.ts# Font size, difficulty, and audio settings persistence
│   │   ├── useTheme.ts           # Dark/Light theme switching & persistence
│   │   ├── useTypingEngine.ts    # Core typing state machine, stats & completion logic
│   │   └── useTypingTimer.ts     # Timestamp-accurate countdown & stopwatch timer
│   ├── styles/
│   │   └── print.css             # Dedicated @page and @media print styling rules
│   ├── types/
│   │   ├── theme.ts              # Theme type definitions
│   │   └── typing.ts             # Core typing models, modes, and test result contracts
│   ├── utils/
│   │   ├── format.ts             # Time and duration formatting utilities
│   │   ├── report.ts             # Report reference generation and date/time formatters
│   │   └── sound.ts              # Synthesized keystroke audio via Web Audio API
│   ├── App.tsx                   # Main root view & workflow orchestrator
│   ├── index.css                 # Base Tailwind styles & CSS custom properties
│   └── main.tsx                  # React DOM entry point
├── eslint.config.js              # ESLint 9 configuration
├── index.html                    # HTML entry point with anti-FOUT theme script
├── package.json                  # Dependencies, scripts, and package metadata
├── postcss.config.js             # PostCSS plugins configuration
├── tailwind.config.js            # Tailwind theme, colors, and typography extensions
├── tsconfig.json                 # TypeScript project reference root
└── vite.config.ts                # Vite build and plugin setup
```

---

## Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173`. |
| `pnpm build` | Compiles TypeScript declarations (`tsc -b`) and produces an optimized production build in `dist/`. |
| `pnpm lint` | Runs ESLint 9 across all project files to detect and enforce code quality standards. |
| `pnpm preview` | Serves the production build locally from `dist/` to preview performance before deployment. |

---

## Privacy & Local Storage

T4Type is built from the ground up to respect user privacy:

- **No Remote Transmission**: Your keystrokes, typing speed, and practice texts are never sent across the network.
- **No User Accounts or Tracking**: There is no user registration, tracking cookies, or analytics tracking.
- **Local Browser Storage Only**: T4Type uses browser `localStorage` solely to persist non-identifiable client preferences between visits:
  - `t4type-theme`: Active theme (`dark` or `light`).
  - `t4type-settings`: Font size, difficulty, and sound preference.
  - `t4type-config`: Selected practice mode and mode-specific parameters.
  - `t4type-custom-text`: Last entered custom practice snippet.
- **Ephemeral Report Names**: The participant name entered when generating a printable report is stored strictly in temporary React component state. It is never saved to `localStorage` or transmitted externally.

---

## Roadmap

The following enhancements are planned for future releases:

- [ ] **Expanded Vocabulary Packs**: Support for additional language dictionaries and specialized code/programming keyword sets.
- [ ] **Accessibility & Audio Enhancements**: Extended keyboard navigation shortcuts and additional customizable audio feedback profiles.
- [ ] **Detailed Session Analytics (Client-Side)**: Interactive historical graphs and session trends stored locally in browser storage.
- [ ] **Custom Color Themes**: User-defined color palettes complementing the standard dark and light modes.
- [ ] **Performance Optimizations**: Further reducing render latency for high-speed typing bursts exceeding 180+ WPM.
- [ ] **Community-Driven Enhancements**: Incorporating feature requests and feedback submitted by the open-source community.

> *Note: Features on the roadmap are planned and not yet implemented.*

---

## Contributing

We welcome contributions from developers, designers, writers, and typing enthusiasts! Please review our [Contributing Guide](CONTRIBUTING.md) for local development instructions, commit conventions, and pull request guidelines.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

Built with care by the T4Type community.  
Website: [https://t4type.com](https://t4type.com)

