# Development Guide

## Prerequisites

- Node.js LTS
- npm, pnpm, or yarn
- PostgreSQL database
- Git

## Initial Setup

After cloning the repository:

```bash
npm install
cp .env.example .env.local
```

Then configure environment variables.

## Initialize Next.js App

If the repository only contains planning files, initialize the app in the repository root:

```bash
npx create-next-app@latest .
```

Recommended choices:

```txt
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: Yes
App Router: Yes
Turbopack: Yes
Import alias: Yes
```

## Development Scripts

Planned scripts:

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:e2e
```

## Branch Naming

Recommended branch names:

```txt
feature/course-draft-creation
feature/course-builder-shell
feature/publishing-workflow
fix/progress-calculation
chore/project-foundation
```

## Commit Style

Recommended commit style:

```txt
chore: add repository foundation docs
feat: add course draft creation
feat: add course builder shell
fix: prevent duplicate enrollment
refactor: move permissions into domain layer
```
