# CourseForge — Course Creation Platform

CourseForge is a production-style fullstack platform for creating, publishing, and consuming educational courses.

The project is designed as a portfolio-grade application that demonstrates senior frontend and fullstack engineering skills: complex product workflows, role-based access, course builder architecture, draft/publish lifecycle, student progress tracking, analytics, validation, testing, and production-readiness.

## Product Summary

Instructors can create structured courses with modules and lessons, save drafts, validate content, preview the student experience, and publish courses. Students can browse published courses, enroll, consume lessons, complete lessons, and track progress.

The MVP focuses on a complete vertical slice:

> Instructor creates and publishes a course → Student enrolls and learns → Progress is tracked → Instructor sees basic analytics.

## Why This Project Exists

This is not intended to be a simple CRUD demo. The goal is to build a realistic product platform with architecture decisions that would make sense in a growing codebase.

The project is optimized to demonstrate:

- Fullstack product ownership
- Complex React UI architecture
- Next.js App Router application structure
- Type-safe domain modeling
- Server-side validation and permission checks
- Draft/publish workflows
- Nested course content management
- Student progress tracking
- Analytics-oriented data flows
- Testing and production-quality UX states

## Core MVP Features

### Instructor

- Create course drafts
- Edit course metadata
- Add modules and lessons
- Reorder course content
- Preview course before publishing
- Publish and unpublish courses
- View basic analytics

### Student

- Browse published courses
- View course landing pages
- Enroll in courses
- Open course player
- Mark lessons as completed
- Track course progress
- Resume learning

### Platform

- Authentication-ready architecture
- Role-based access control
- Draft, published, and archived course states
- Publishing validation checklist
- Loading, empty, error, and unauthorized states
- Testable domain logic

## Tech Stack

Planned stack:

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **UI:** Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Validation:** Zod
- **Auth:** Auth.js or Clerk
- **Server State:** Server Components, Server Actions, Route Handlers, TanStack Query where useful
- **Local UI State:** React state first, Zustand when shared local builder state becomes necessary
- **Testing:** Vitest, React Testing Library, Playwright
- **Deployment:** Vercel + Neon/Supabase/Railway Postgres

## Architecture Principles

The MVP uses a modular monolith architecture:

```txt
Next.js application
  → Feature modules
  → Server actions / route handlers
  → Domain services
  → Database access layer
  → PostgreSQL
```

Key principles:

- Keep feature logic close to the feature
- Keep permission checks centralized
- Separate server state from local UI state
- Avoid placing domain logic directly inside components
- Use validation at form, domain, and database levels
- Build the MVP as a real product spine, not a collection of screens

## Planned Project Structure

```txt
src/
  app/
  db/
  features/
    auth/
    courses/
    course-builder/
    enrollment/
    progress/
    analytics/
    permissions/
  shared/
    ui/
    lib/
    hooks/
    utils/

docs/
  ARCHITECTURE.md
  ROADMAP.md
  DECISIONS.md
  TESTING.md
```

## Documentation

- [MVP Plan](./MVP_PLAN.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Roadmap](./docs/ROADMAP.md)
- [Engineering Decisions](./docs/DECISIONS.md)
- [Testing Strategy](./docs/TESTING.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## First Implementation Milestone

The first implementation milestone is **Course Draft Creation**.

Target outcome:

```txt
Instructor creates a draft course
  → Course is validated
  → Course is saved
  → Course appears in the dashboard
  → Instructor can open the course builder placeholder
```

This milestone creates the first real vertical slice and prepares the foundation for modules, lessons, publishing, and student enrollment.

## Repository Status

This project is currently in the planning and architecture foundation stage.

Next step:

```bash
npx create-next-app@latest .
```

Recommended setup choices:

```txt
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: Yes
App Router: Yes
Turbopack: Yes
Import alias: Yes
```

## License

MIT
