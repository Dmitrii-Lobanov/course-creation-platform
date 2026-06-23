import { db } from "@/db/client";
import { courses } from "@/db/schema";

import type { CreateCourseInput } from "../schemas/course.schema";

export async function createCourseDraft(input: CreateCourseInput) {
  const [createdCourse] = await db
    .insert(courses)
    .values({
      title: input.title,
      description: input.description,
      level: input.level,
      status: "draft",
    })
    .returning({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      level: courses.level,
      status: courses.status,
      createdAt: courses.createdAt,
      updatedAt: courses.updatedAt,
    });

  if (!createdCourse) {
    throw new Error("Course could not be created.");
  }

  return createdCourse;
}
