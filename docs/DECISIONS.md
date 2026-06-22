# Engineering Decisions

This document records important architecture and product decisions.

## ADR-001: Start with a Modular Monolith

### Decision

CourseForge starts as a modular monolith.

### Context

The MVP needs fast iteration, simple deployment, and clear feature ownership. Splitting the system into services too early would increase operational complexity without solving a real scaling problem.

### Consequences

Benefits:

- Faster development
- Easier local setup
- Simpler deployment
- Strong type sharing
- Easier refactoring during product discovery

Trade-offs:

- Requires discipline around feature boundaries
- Domain logic must not become scattered across routes/components
- Future extraction points should be kept in mind

## ADR-002: Feature-Based Frontend Structure

### Decision

The codebase will use feature-based organization instead of grouping everything by technical type.

### Context

This application has multiple product domains: courses, course builder, enrollment, progress, analytics, and permissions. Keeping each feature’s components, hooks, schemas, actions, and utilities together improves maintainability.

### Consequences

Benefits:

- Easier navigation
- Better domain ownership
- More scalable project structure
- Stronger portfolio signal

Trade-offs:

- Some shared utilities must be carefully extracted to avoid duplication

## ADR-003: Centralize Permission Logic

### Decision

Permission checks should live in a dedicated permissions/domain layer, not scattered across UI components.

### Context

The app has multiple roles and visibility rules. Authorization must be enforced on the server and reflected in the UI.

### Consequences

Benefits:

- Safer backend behavior
- Easier testing
- More consistent UX

Trade-offs:

- Requires upfront discipline and clear permission APIs
