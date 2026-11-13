# Contributing to T4Type

Thank you for your interest in improving T4Type!

We are currently accepting contributions! Developers, designers, testers, and documentation contributors are welcome to help improve T4Type.

Whether you are fixing a small bug, refining the user experience, expanding test coverage, or polishing documentation, your contributions help make daily typing practice faster, more accessible, and more enjoyable for everyone.

---

## 1. Ways to Contribute

You can support the project in several different ways:

- **Bug Reports**: Notice an unexpected behavior, typing glitch, or styling quirk? Open an issue with reproduction steps.
- **Feature Suggestions**: Propose new practice modes, ergonomic improvements, or subtle customization options.
- **UI & UX Improvements**: Enhance responsiveness, keyboard navigation, typography, and contrast.
- **Performance & Optimization**: Streamline render cycles, reduce bundle size, or enhance input responsiveness.
- **Accessibility (a11y)**: Improve screen reader support, keyboard focus indicators, and semantic HTML.
- **Documentation**: Correct typos, improve setup instructions, and clarify project explanations.
- **Code Contributions**: Implement approved enhancements or bug fixes via Pull Requests.
- **Testing**: Test across different browsers, mobile devices, and screen sizes to identify edge cases.

---

## 2. Before Contributing

To keep development coordinated and avoid duplicate effort:

1. **Review Existing Issues**: Search [open issues](https://github.com/T4Type/t4type/issues) and active pull requests first to verify your topic has not already been addressed.
2. **Discuss Substantial Changes**: For significant UI redesigns, new dependencies, or architectural refactors, create an issue to discuss your proposal with the maintainers prior to writing code.
3. **Small Fixes**: Minor bug fixes, typo corrections, and localized styling adjustments are welcome directly via Pull Request.

---

## 3. Development Setup

T4Type is built with React 19, TypeScript, Vite, and Tailwind CSS, using **pnpm** as its package manager.

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (pnpm v9+ recommended)
- **Git**

### Local Setup Instructions

1. Fork the repository on GitHub.
2. Clone your fork locally:

```bash
git clone https://github.com/<your-username>/t4type.git
cd t4type
```

3. Install project dependencies:

```bash
pnpm install
```

4. Start the local development server:

```bash
pnpm dev
```

5. Open your browser and navigate to `http://localhost:5173`.

---

## 4. Branch Naming Convention

Use clear, descriptive branch names prefixed by the category of work:

- `feature/add-new-practice-mode`
- `fix/timer-calculation`
- `docs/update-readme`
- `style/improve-mobile-layout`
- `refactor/streamline-engine-hook`

---

## 5. Commit Message Convention

Write concise, descriptive commit messages in the imperative mood, following standard conventional prefixes:

- `feat: add new typing practice mode`
- `fix: correct timer countdown behavior`
- `docs: update installation instructions`
- `style: improve responsive layout`
- `refactor: simplify typing engine`
- `test: verify character accuracy calculation`

---

## 6. Pull Request Process

Follow these steps to submit your contributions:

1. **Fork** the repository and clone your fork locally.
2. **Branch**: Create a feature or bugfix branch off `main` (e.g. `git checkout -b feature/your-feature-name`).
3. **Develop**: Make focused, modular changes adhering to project conventions.
4. **Lint**: Run ESLint to ensure code style compliance:
   ```bash
   pnpm lint
   ```
5. **Build**: Run the production build to ensure TypeScript types and bundle transformations succeed:
   ```bash
   pnpm build
   ```
6. **Commit**: Stage and commit your changes using a descriptive commit message.
7. **Push**: Push the branch to your GitHub fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open Pull Request**: Navigate to [https://github.com/T4Type/t4type](https://github.com/T4Type/t4type) and create a Pull Request against `main`. Provide a clear summary of what changed and reference any relevant issue numbers.

---

## 7. Code Quality Expectations

To maintain a lightweight, fast, and stable application:

- **Follow Architecture**: Keep components modular, place business logic in dedicated hooks, and place shared types in `src/types/`.
- **Strict TypeScript**: Avoid `any` types. Provide explicit interfaces for component props and state models.
- **Zero Heavy Dependencies**: Avoid adding external UI libraries, animation frameworks, or state management packages. Native React and Tailwind CSS are preferred.
- **Do Not Break Core Mechanics**: Ensure typing input, accuracy metrics, timer accuracy, and themes remain reliable across desktop and mobile.
- **Clean Hygiene**: Never commit environment variables, secret keys, temporary logs, or personal editor configurations.

---

## 8. Code of Conduct

All contributors and maintainers agree to foster an open, welcoming, and respectful environment. We expect all participants to:

- Communicate with empathy and professional courtesy.
- Provide and accept constructive feedback gracefully.
- Focus on collaborative problem-solving that benefits all users.
- Respect diverse viewpoints, backgrounds, and skill levels.

---

## 9. Contribution Status

Contributions are currently welcome. We appreciate every effort that helps make T4Type better.

