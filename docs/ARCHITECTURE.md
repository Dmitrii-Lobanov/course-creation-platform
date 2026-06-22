# Architecture

## Overview

CourseForge is designed as a modular monolith: one deployable application, one primary database, and clear internal feature boundaries.

This is intentional. The MVP needs fast iteration, simple deployment, and strong type safety. Microservices would add operational complexity before the product requires it.

## High-Level Architecture

```txt
Browser
  ↓
Next.js App Router
  ↓
React Server Components / Client Components
  ↓
Server Actions / Route Handlers
  ↓
Validation + Permission Checks
  ↓
Domain Services
  ↓
Database Access Layer
  ↓
PostgreSQL
```

## Core Domains

### Auth

Responsible for user identity, sessions, and roles.

Roles:

- Student
- Instructor
- Admin

### Courses

Responsible for course metadata, status, ownership, visibility, and catalog behavior.

Course statuses:

- Draft
- Published
- Archived

### Course Builder

Responsible for structured course content management:

- Modules
- Lessons
- Ordering
- Draft editing
- Preview mode
- Publishing checklist

### Enrollment

Responsible for connecting students to courses.

### Progress

Responsible for lesson completion, course progress percentage, and completed course state.

### Analytics

Responsible for instructor-facing course metrics.

MVP analytics can be derived from existing tables. A dedicated analytics event pipeline can be introduced later.

### Permissions

Responsible for centralized authorization rules.

Examples:

- Only course owner or admin can edit a course
- Only course owner or admin can publish a course
- Only published courses appear in the catalog
- Only enrolled students can access course player

## Frontend Architecture

The frontend uses feature-based organization.

```txt
features/course-builder/
  components/
  hooks/
  store/
  actions/
  schemas/
  utils/
  types.ts
```

The goal is to keep related UI, validation, types, and business logic close together while keeping shared primitives in `shared/`.

## State Management Strategy

### Server State

Server state is persisted and should be fetched/mutated through server actions, route handlers, server components, or TanStack Query where client-side interactivity requires it.

Examples:

- Courses
- Modules
- Lessons
- Enrollments
- Progress
- Analytics

### Local UI State

Local UI state is temporary and belongs in React state or feature-local Zustand stores when it becomes shared across multiple components.

Examples:

- Selected lesson
- Expanded modules
- Dirty fields
- Autosave status
- Drag-and-drop state
- Preview mode

## Backend Layering

Preferred flow:

```txt
UI component
  ↓
Server action / route handler
  ↓
Zod validation schema
  ↓
Permission check
  ↓
Domain service
  ↓
Database query
```

Avoid placing domain rules directly in React components or route handlers.

## Data Consistency Rules

The application should protect data integrity at three levels:

1. Form validation for immediate user feedback
2. Domain validation for business rules
3. Database constraints for final integrity

Examples:

- A course cannot be published without at least one lesson
- A user cannot enroll in the same course twice
- A user cannot edit a course they do not own
- Lesson progress must be unique per user and lesson

## Scalability Path

The modular monolith can later evolve by extracting specific domains when needed.

Possible future extraction points:

- Media upload and video processing service
- Analytics event pipeline
- Payment service
- Notification service
- AI generation service

Until those constraints exist, keeping the platform in one application is the better engineering decision.
