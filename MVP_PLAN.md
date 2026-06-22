# CourseForge MVP Plan

## 1. Product Vision

CourseForge is a fullstack educational course creation platform where instructors can build, publish, and manage structured online courses, while students can enroll, learn, track progress, and resume lessons.

The MVP should not be treated as a simple CRUD application. The goal is to build a polished, production-style platform that demonstrates real product thinking, scalable frontend architecture, fullstack ownership, and senior-level engineering decisions.

The project should show the ability to design and implement complex workflows such as course creation, draft publishing, nested content management, student progress tracking, role-based access, and analytics.

## 2. MVP Goal

The MVP goal is to deliver a complete vertical slice of the product:

> An instructor can create and publish a structured course, and a student can enroll, consume lessons, and track progress.

The MVP should feel complete, demoable, and polished, even if it does not include advanced features such as payments, video hosting, certificates, AI generation, team accounts, or real-time collaboration.

## 3. Core User Roles

### Student

A student is a user who can browse published courses, enroll in a course, open the course player, complete lessons, and track learning progress.

Primary student goals:

- Discover available courses
- Enroll in a course
- Continue learning from the last opened lesson
- Complete lessons
- See progress through the course

### Instructor

An instructor is a user who can create, edit, preview, publish, and manage courses.

Primary instructor goals:

- Create a new course
- Add modules and lessons
- Reorder course content
- Save work as a draft
- Preview the course before publishing
- Publish or unpublish a course
- View basic student progress and analytics

### Admin

An admin is a user who can manage platform-level content and users.

For the MVP, the admin role should remain minimal. Admin functionality can initially be limited to having elevated permissions in the system, without a full admin dashboard.

## 4. MVP Feature Scope

### 4.1 Authentication and Authorization

The MVP should support user authentication and basic role-based access.

Required:

- Sign up
- Sign in
- Sign out
- User session handling
- User role: student, instructor, admin
- Protected dashboard routes
- Permission checks for course editing and publishing

Out of scope for MVP:

- Organization accounts
- Team permissions
- SSO
- Magic links unless the auth provider makes it trivial
- Advanced account settings

### 4.2 Instructor Dashboard

The instructor dashboard is the main workspace for course creators.

Required:

- List instructor’s courses
- Show course status: draft, published, archived
- Create a new course
- Open course builder
- See basic course metadata
- Navigate to analytics for a course

Useful dashboard states:

- Empty state when no courses exist
- Loading state while courses are fetched
- Error state when fetching fails
- Status badge for draft/published courses

### 4.3 Course Creation

An instructor should be able to create a course draft.

Required fields:

- Course title
- Course description
- Course level: beginner, intermediate, advanced

Optional MVP fields:

- Thumbnail URL
- Short summary
- Category

Initial behavior:

- A newly created course starts as a draft
- The instructor is redirected to the course builder after creation
- Course title should be converted into a unique slug

### 4.4 Course Builder

The course builder is the core feature of the application and should receive the most product and engineering attention.

Required:

- Edit course metadata
- Add modules
- Rename modules
- Delete modules
- Add lessons inside modules
- Rename lessons
- Edit lesson content
- Delete lessons
- Reorder modules and lessons
- Select a lesson from the course structure
- Preview the course as a student
- Save draft changes
- Publish the course after validation

Important UI areas:

- Course builder header
- Course structure sidebar
- Module and lesson tree
- Lesson editor panel
- Course settings panel
- Publishing checklist
- Preview mode

The course builder should clearly separate server state from local editor state.

Server state:

- Course data
- Modules
- Lessons
- Publishing status

Local UI state:

- Selected lesson
- Expanded/collapsed modules
- Dirty fields
- Autosave status
- Drag-and-drop state
- Preview mode

### 4.5 Draft and Publishing Workflow

Publishing should be treated as a real workflow, not just a boolean flag.

Course statuses:

- Draft
- Published
- Archived

Publishing validation should check that:

- Course has a title
- Course has a description
- Course has at least one module
- Course has at least one lesson
- Every module has a title
- Every lesson has a title
- Every lesson has content

Publishing flow:

1. Instructor clicks Publish
2. System validates course structure
3. If validation fails, show checklist with missing requirements
4. If validation passes, course status changes to published
5. Published course becomes visible in the course catalog

This workflow is important because it demonstrates product logic, domain validation, and good UX around complex states.

### 4.6 Course Catalog

Students should be able to browse published courses.

Required:

- List only published courses
- Show title, description, level, instructor, and progress/enrollment status if applicable
- Open course landing page

Useful catalog features:

- Search by course title
- Filter by level
- Empty state when no courses match

Out of scope for MVP:

- Paid courses
- Ratings and reviews
- Recommendations
- Advanced search

### 4.7 Course Landing Page

A published course should have a public-facing course page.

Required:

- Course title
- Description
- Instructor name
- Level
- Module and lesson outline
- Enroll button for students
- Continue learning button for already enrolled students

Behavior:

- Unauthenticated users can view published course pages
- Only authenticated students can enroll
- Instructors can preview unpublished courses they own

### 4.8 Enrollment

Students should be able to enroll in a published course.

Required:

- Enroll in course
- Prevent duplicate enrollment
- Create initial progress record
- Redirect student to course player after enrollment

Enrollment statuses:

- Active
- Completed
- Cancelled

For MVP, cancellation can be left out of the UI but supported conceptually in the model later.

### 4.9 Course Player

The course player is the student learning experience.

Required:

- Show course structure
- Show selected lesson content
- Show completed lessons
- Mark lesson as completed
- Navigate to next and previous lessons
- Show overall course progress
- Resume from last opened lesson

Useful states:

- Lesson not started
- Lesson in progress
- Lesson completed
- Course completed

### 4.10 Progress Tracking

Student progress should be tracked per lesson and per course.

Required:

- Mark lesson as completed
- Store completed lessons
- Calculate course progress percentage
- Mark enrollment as completed when all lessons are completed
- Show progress in course player
- Show progress in student dashboard or course catalog

Progress formula:

```txt
completed lessons / total lessons * 100
```

### 4.11 Basic Instructor Analytics

The MVP should include lightweight analytics for instructors.

Required:

- Total enrollments per course
- Number of active students
- Average progress percentage
- Completion count
- Recently enrolled students

Optional:

- Most completed lessons
- Least completed lessons
- Simple progress distribution

This creates a good data-dashboard story without requiring a complex analytics pipeline.

## 5. Out of Scope for MVP

The following features are valuable, but should not be part of the first MVP:

- Payments
- Subscriptions
- Certificates
- Video processing
- File uploads
- AI course generation
- Quizzes
- Reviews and ratings
- Course comments
- Real-time collaboration
- Notifications
- Admin moderation dashboard
- Multi-instructor organizations
- Advanced analytics events pipeline
- Email automation
- Mobile app

These can be added after the core product spine is complete.

## 6. MVP User Flows

### 6.1 Instructor Creates and Publishes a Course

```txt
Instructor signs in
    ↓
Opens dashboard
    ↓
Clicks “Create Course”
    ↓
Adds title, description, and level
    ↓
Course draft is created
    ↓
Instructor opens course builder
    ↓
Adds modules and lessons
    ↓
Previews course
    ↓
Clicks Publish
    ↓
System validates course
    ↓
Course becomes published
    ↓
Course appears in catalog
```

### 6.2 Student Enrolls and Learns

```txt
Student opens course catalog
    ↓
Selects a published course
    ↓
Views course landing page
    ↓
Clicks Enroll
    ↓
Enrollment is created
    ↓
Student opens course player
    ↓
Reads lesson content
    ↓
Marks lesson as completed
    ↓
Progress is updated
    ↓
Student continues to next lesson
```

### 6.3 Instructor Views Analytics

```txt
Instructor opens dashboard
    ↓
Selects published course
    ↓
Opens analytics
    ↓
Sees enrollments, active students, completion count, and average progress
```

## 7. Application Architecture Direction

The MVP should use a modular monolith architecture.

This means:

- One application
- One database
- Clear feature boundaries
- Clear domain logic boundaries
- No premature microservices

Recommended architecture:

```txt
Next.js application
    ↓
Feature modules
    ↓
Server actions / route handlers
    ↓
Domain services
    ↓
Database access layer
    ↓
PostgreSQL
```

This is the right architecture for the MVP because it supports fast iteration while still allowing clean separation of responsibilities.

## 8. Frontend Architecture Direction

The frontend should use a feature-based structure.

Recommended structure:

```txt
src/
  app/
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
  db/
```

The goal is to avoid a flat structure where all components, hooks, and utilities are mixed together.

Each major feature should own its components, hooks, schemas, actions, and types where appropriate.

Example:

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

## 9. State Management Direction

The MVP should separate server state from local UI state.

### Server State

Server state includes data persisted in the database:

- Courses
- Modules
- Lessons
- Enrollments
- Progress
- Analytics

This can be handled through server components, server actions, route handlers, and later TanStack Query where client-side fetching is useful.

### Local UI State

Local UI state includes temporary interface state:

- Selected lesson
- Expanded modules
- Unsaved changes
- Autosave status
- Preview mode
- Drag-and-drop interaction
- Modal state

This can be handled with React state first and Zustand later where shared local state becomes necessary.

## 10. Backend Architecture Direction

The backend should avoid putting all logic directly inside route handlers or server actions.

Preferred layering:

```txt
UI component
    ↓
Server action / route handler
    ↓
Validation schema
    ↓
Domain service
    ↓
Database query
```

Example domain services:

- CourseService
- CourseBuilderService
- PublishingService
- EnrollmentService
- ProgressService
- AnalyticsService
- PermissionService

This structure makes the project easier to test, explain, and evolve.

## 11. Permission Strategy

Permission logic should be centralized instead of scattered across components.

Examples:

- Only course owner or admin can edit a course
- Only course owner or admin can publish a course
- Only published courses are visible in catalog
- Only enrolled students can access course player
- Instructors can preview their own unpublished courses

Permission checks should happen both:

- On the server for security
- In the UI for user experience

## 12. Validation Strategy

Validation should exist at multiple levels.

### Form Validation

Used for immediate user feedback.

Examples:

- Course title is required
- Description is required
- Level is required
- Lesson title is required

### Domain Validation

Used for business rules.

Examples:

- Course cannot be published without at least one module
- Course cannot be published without at least one lesson
- Student cannot enroll twice in the same course
- User cannot edit a course they do not own

### Database Constraints

Used for data integrity.

Examples:

- Unique user email
- Unique course slug
- Unique enrollment per user and course
- Unique lesson progress per user and lesson

## 13. UX Quality Requirements

The MVP should include production-like UX states.

Required states:

- Loading
- Empty
- Error
- Unauthorized
- Not found
- Success
- Saving
- Saved
- Validation failed

This is important because it makes the project feel like a real application rather than a demo.

## 14. Performance Considerations

The MVP should include performance-aware decisions from the beginning.

Course builder:

- Avoid re-rendering the entire builder when one lesson changes
- Keep selected lesson state isolated
- Lazy-load heavy editor components if needed
- Debounce autosave
- Avoid expensive derived calculations during typing

Catalog:

- Use pagination or limits
- Optimize images
- Keep filters reflected in URL search params later

Course player:

- Avoid refetching the full course after every progress update
- Optimistically update lesson completion if safe
- Prefetch next lesson later

## 15. Testing Strategy

The MVP should include enough tests to prove engineering quality.

### Unit Tests

Good candidates:

- Publishing validation
- Permission checks
- Progress calculation
- Slug generation
- Course ordering helpers

### Integration Tests

Good candidates:

- Create course
- Add module
- Add lesson
- Publish course
- Enroll in course
- Complete lesson

### E2E Tests

Core E2E scenario:

```txt
Instructor creates and publishes a course
Student enrolls in the course
Student completes a lesson
Instructor sees progress in analytics
```

## 16. Delivery Milestones

### Milestone 1: Project Foundation

Goal:

Set up the application foundation and architecture.

Deliverables:

- Next.js project setup
- Tailwind and UI system setup
- Basic layout
- Feature folder structure
- Environment configuration
- Database connection
- Initial auth-ready structure

### Milestone 2: Course Draft Creation

Goal:

Allow instructors to create and view course drafts.

Deliverables:

- Course creation form
- Course list in dashboard
- Course status badge
- Course detail route
- Basic validation

### Milestone 3: Course Builder MVP

Goal:

Allow instructors to structure course content.

Deliverables:

- Module creation
- Lesson creation
- Lesson editor
- Course structure sidebar
- Reordering support
- Save draft behavior
- Builder empty/loading/error states

### Milestone 4: Publishing Workflow

Goal:

Allow instructors to publish valid courses.

Deliverables:

- Publishing checklist
- Domain validation
- Publish action
- Unpublish action
- Published course visibility in catalog

### Milestone 5: Student Learning Flow

Goal:

Allow students to enroll and consume course content.

Deliverables:

- Course catalog
- Course landing page
- Enrollment action
- Course player
- Lesson completion
- Progress calculation

### Milestone 6: Instructor Analytics

Goal:

Give instructors basic visibility into student progress.

Deliverables:

- Enrollment count
- Active student count
- Average progress
- Completion count
- Recent enrollments

### Milestone 7: Polish and Portfolio Readiness

Goal:

Prepare the project for portfolio presentation.

Deliverables:

- Responsive UI polish
- Loading/empty/error states
- Seed data
- Tests
- README
- Architecture document
- Demo video
- Deployment

## 17. Success Criteria for MVP

The MVP is successful when:

- An instructor can create a course
- An instructor can add modules and lessons
- An instructor can publish a valid course
- A student can find the published course
- A student can enroll in the course
- A student can complete lessons
- Progress is tracked correctly
- An instructor can see basic analytics
- The application is deployed and demoable
- The codebase has a clear architecture
- The project has a strong README and case study potential

## 18. Future Production-Ready Features

After the MVP, the platform can evolve with:

- AI-assisted course outline generation
- AI quiz generation
- File and video uploads
- Payment integration
- Certificates
- Reviews and ratings
- Comments and Q&A
- Notifications
- Real-time collaboration in the course builder
- Admin moderation workflow
- Audit logs
- Advanced analytics events pipeline
- Email reminders
- Team/organization accounts
- Public instructor profiles

## 19. First Implementation Recommendation

Before implementing the database schema, start with:

1. Create the Next.js project
2. Add the folder architecture
3. Create this MVP plan in the repository
4. Add a lightweight README
5. Then implement the database schema based on the MVP plan

The first technical milestone after this document should be:

> Course Draft Creation: an instructor can create a draft course and see it in the dashboard.

This gives the project a clean first vertical slice and prevents the implementation from becoming unfocused.
