"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/client";
import { courseModules, courses } from "@/db/schema";

import { updateModuleSchema } from "../schemas/module.schema";

export type UpdateModuleActionState = {
  values?: {
    title?: string;
  };
  success?: boolean;
  errors?: {
    courseId?: string[];
    moduleId?: string[];
    title?: string[];
    form?: string[];
  };
};

export async function updateModuleAction(
  _previousState: UpdateModuleActionState,
  formData: FormData,
): Promise<UpdateModuleActionState> {
  const values = {
    title: String(formData.get("title") ?? ""),
  };

  const parsed = updateModuleSchema.safeParse({
    courseId: formData.get("courseId"),
    moduleId: formData.get("moduleId"),
    title: values.title,
  });

  if (!parsed.success) {
    return {
      values,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { courseId, moduleId, title } = parsed.data;

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
        values,
        errors: {
          form: ["Draft module was not found."],
        },
      };
    }

    await db
      .update(courseModules)
      .set({
        title,
        updatedAt: new Date(),
      })
      .where(eq(courseModules.id, moduleId));

    revalidatePath(`/dashboard/courses/${courseId}/builder`);

    return {
      success: true,
    };
  } catch {
    return {
      values,
      errors: {
        form: ["Something went wrong while updating the module."],
      },
    };
  }
}
