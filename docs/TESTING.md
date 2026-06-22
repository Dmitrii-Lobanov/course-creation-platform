# Testing Strategy

## Goals

Testing should prove the correctness of the most important product workflows and domain rules without slowing down MVP development.

## Unit Tests

Good candidates:

- Publishing validation
- Permission checks
- Progress calculation
- Slug generation
- Course/module/lesson ordering helpers

## Integration Tests

Good candidates:

- Create course
- Add module
- Add lesson
- Publish course
- Enroll in course
- Complete lesson

## E2E Tests

Primary E2E scenario:

```txt
Instructor creates and publishes a course
  → Student enrolls in the course
  → Student completes a lesson
  → Instructor sees progress in analytics
```

## Testing Priorities

1. Domain logic first
2. Critical workflows second
3. UI polish tests later

## Tools

Planned tools:

- Vitest
- React Testing Library
- Playwright
