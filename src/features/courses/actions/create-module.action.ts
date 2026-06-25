"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/client";
import { courseModules, courses } from "@/db/schema";

import { createModuleSchema } from "../schemas/module.schema";

export type CreateModuleActionState = {
  values?: {
    title?: string;
  };
  errors?: {
    title?: string[];
    courseId?: string[];
    form?: string[];
  };
};

export async function createModuleAction(
  _previousState: CreateModuleActionState,
  formData: FormData,
): Promise<CreateModuleActionState> {
  const values = {
    title: String(formData.get("title") ?? ""),
  };

  const parsed = createModuleSchema.safeParse({
    courseId: formData.get("courseId"),
    title: values.title,
  });

  if (!parsed.success) {
    return {
      values,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { courseId, title } = parsed.data;

  try {
    const [course] = await db
      .select({
        id: courses.id,
        status: courses.status,
      })
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.status, "draft")))
      .limit(1);

    if (!course) {
      return {
        values,
        errors: {
          form: ["Draft course was not found."],
        },
      };
    }

    const [lastModule] = await db
      .select({
        position: courseModules.position,
      })
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(desc(courseModules.position))
      .limit(1);

    const nextPosition = lastModule ? lastModule.position + 1 : 1;

    await db.insert(courseModules).values({
      courseId,
      title,
      position: nextPosition,
    });
  } catch {
    return {
      values,
      errors: {
        form: ["Something went wrong while creating the module."],
      },
    };
  }

  revalidatePath(`/dashboard/courses/${courseId}/builder`);

  return {};
}
