import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const courseLevelEnum = pgEnum("course_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const courseStatusEnum = pgEnum("course_status", [
  "draft",
  "published",
  "archived",
]);

export const lessonTypeEnum = pgEnum("lesson_type", ["text", "video"]);

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: varchar("title", { length: 120 }).notNull(),
  description: text("description").notNull(),
  level: courseLevelEnum("level").notNull(),

  status: courseStatusEnum("status").notNull().default("draft"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const courseModules = pgTable("course_modules", {
  id: uuid("id").defaultRandom().primaryKey(),

  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, {
      onDelete: "cascade",
    }),

  title: varchar("title", { length: 120 }).notNull(),
  position: integer("position").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),

  moduleId: uuid("module_id")
    .notNull()
    .references(() => courseModules.id, {
      onDelete: "cascade",
    }),

  title: varchar("title", { length: 120 }).notNull(),
  content: text("content"),
  type: lessonTypeEnum("type").notNull().default("text"),
  position: integer("position").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const enrollments = pgTable("enrollments", {
  id: uuid("id").defaultRandom().primaryKey(),

  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, {
      onDelete: "cascade",
    }),

  // Temporary until real auth exists.
  // Later this becomes userId.
  studentId: varchar("student_id", { length: 120 }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const lessonProgress = pgTable("lesson_progress", {
  id: uuid("id").defaultRandom().primaryKey(),

  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, {
      onDelete: "cascade",
    }),

  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, {
      onDelete: "cascade",
    }),

  studentId: varchar("student_id", { length: 120 }).notNull(),

  completed: boolean("completed").notNull().default(false),

  completedAt: timestamp("completed_at", {
    withTimezone: true,
  }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type CourseModule = typeof courseModules.$inferSelect;
export type NewCourseModule = typeof courseModules.$inferInsert;

export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;

export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;

export type LessonProgress = typeof lessonProgress.$inferSelect;
export type NewLessonProgress = typeof lessonProgress.$inferInsert;
