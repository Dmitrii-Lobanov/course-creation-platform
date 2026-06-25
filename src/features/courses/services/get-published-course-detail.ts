import { asc, and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { courseModules, courses, lessons } from "@/db/schema";

import { buildCourseOutline } from "./build-course-outline";

export async function getPublishedCourseDetail(courseId: string) {
  const [course] = await db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      level: courses.level,
      status: courses.status,
      updatedAt: courses.updatedAt,
    })
    .from(courses)
    .where(and(eq(courses.id, courseId), eq(courses.status, "published")))
    .limit(1);

  if (!course) {
    return null;
  }

  const modules = await db
    .select({
      id: courseModules.id,
      title: courseModules.title,
      position: courseModules.position,
    })
    .from(courseModules)
    .where(eq(courseModules.courseId, courseId))
    .orderBy(asc(courseModules.position));

  const lessonRows = await db
    .select({
      id: lessons.id,
      moduleId: lessons.moduleId,
      title: lessons.title,
      type: lessons.type,
      content: lessons.content,
      position: lessons.position,
    })
    .from(lessons)
    .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
    .where(eq(courseModules.courseId, courseId))
    .orderBy(asc(courseModules.position), asc(lessons.position));

  return {
    course,
    modules: buildCourseOutline(modules, lessonRows),
  };
}
