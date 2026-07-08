"use server";

import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/client";
import { courseModules, courses } from "@/db/schema";

import { reorderModuleSchema } from "../schemas/module.schema";

export type ReorderModuleActionState = {
  success?: boolean;
  errors?: {
    courseId?: string[];
    moduleId?: string[];
    direction?: string[];
    form?: string[];
  };
};

export async function reorderModuleAction(
  _previousState: ReorderModuleActionState,
  formData: FormData,
): Promise<ReorderModuleActionState> {
  const parsed = reorderModuleSchema.safeParse({
    courseId: formData.get("courseId"),
    moduleId: formData.get("moduleId"),
    direction: formData.get("direction"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { courseId, moduleId, direction } = parsed.data;

  try {
    const [currentModule] = await db
      .select({
        id: courseModules.id,
        position: courseModules.position,
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

    if (!currentModule) {
      return {
        errors: {
          form: ["Draft module was not found."],
        },
      };
    }

    const [targetModule] = await db
      .select({
        id: courseModules.id,
        position: courseModules.position,
      })
      .from(courseModules)
      .where(
        and(
          eq(courseModules.courseId, courseId),
          direction === "up"
            ? lt(courseModules.position, currentModule.position)
            : gt(courseModules.position, currentModule.position),
        ),
      )
      .orderBy(
        direction === "up"
          ? desc(courseModules.position)
          : asc(courseModules.position),
      )
      .limit(1);

    if (!targetModule) {
      return {
        success: true,
      };
    }

    await db.transaction(async (tx) => {
      await tx
        .update(courseModules)
        .set({
          position: targetModule.position,
        })
        .where(eq(courseModules.id, currentModule.id));

      await tx
        .update(courseModules)
        .set({
          position: currentModule.position,
        })
        .where(eq(courseModules.id, targetModule.id));
    });

    revalidatePath(`/dashboard/courses/${courseId}/builder`);

    return {
      success: true,
    };
  } catch {
    return {
      errors: {
        form: ["Something went wrong while reordering the module."],
      },
    };
  }
}
