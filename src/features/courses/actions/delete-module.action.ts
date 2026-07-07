"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/client";
import { courseModules, courses, lessons } from "@/db/schema";

import { deleteModuleSchema } from "../schemas/module.schema";

export type DeleteModuleActionState = {
  success?: boolean;
  errors?: {
    courseId?: string[];
    moduleId?: string[];
    form?: string[];
  };
};

export async function deleteModuleAction(
  _previousState: DeleteModuleActionState,
  formData: FormData,
): Promise<DeleteModuleActionState> {
  const parsed = deleteModuleSchema.safeParse({
    courseId: formData.get("courseId"),
    moduleId: formData.get("moduleId"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { courseId, moduleId } = parsed.data;

  try {
    const [module] = await db
      .select({
        id: courseModules.id,
      })
      .from(courseModules)
      .innerJoin(courses, eq(courseModules.courseId, courses.id))
      .where(
        and(
          eq(courseModules.id, moduleId),
          eq(courseModules.courseId, courseId),
          eq(courses.status, "draft"),
        ),
      )
      .limit(1);

    if (!module) {
      return {
        errors: {
          form: ["Draft module was not found."],
        },
      };
    }

    await db.delete(lessons).where(eq(lessons.moduleId, moduleId));
    await db.delete(courseModules).where(eq(courseModules.id, moduleId));

    revalidatePath(`/dashboard/courses/${courseId}/builder`);

    return {
      success: true,
    };
  } catch {
    return {
      errors: {
        form: ["Something went wrong while deleting the module."],
      },
    };
  }
}
