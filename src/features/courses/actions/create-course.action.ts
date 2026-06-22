"use server";

import { redirect } from "next/navigation";

import { db } from "@/db/client";
import { courses } from "@/db/schema";

import { createCourseSchema } from "../schemas/course.schema";

export type CreateCourseActionState = {
  errors?: {
    title?: string[];
    description?: string[];
    level?: string[];
    form?: string[];
  };
};

export async function createCourseAction(
  _previousState: CreateCourseActionState,
  formData: FormData,
): Promise<CreateCourseActionState> {
  const parsed = createCourseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    level: formData.get("level"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  let courseId: string;

  try {
    const [createdCourse] = await db
      .insert(courses)
      .values({
        title: parsed.data.title,
        description: parsed.data.description,
        level: parsed.data.level,
        status: "draft",
      })
      .returning({
        id: courses.id,
      });

    if (!createdCourse) {
      return {
        errors: {
          form: ["Course could not be created."],
        },
      };
    }

    courseId = createdCourse.id;
  } catch {
    return {
      errors: {
        form: ["Something went wrong while creating the course."],
      },
    };
  }

  redirect(`/dashboard/courses/${courseId}/builder`);
}