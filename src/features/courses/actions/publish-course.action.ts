"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db/client";
import { courses } from "@/db/schema";

import { getCourseBuilderData } from "../services/get-course-builder-data";
import { validateCourseForPublishing } from "../services/validate-course-for-publishing";

export type PublishCourseActionState = {
  errors?: {
    form?: string[];
  };
  validationErrors?: string[];
};

export async function publishCourseAction(
  _previousState: PublishCourseActionState,
  formData: FormData,
): Promise<PublishCourseActionState> {
  const courseId = formData.get("courseId");

  if (typeof courseId !== "string") {
    return {
      errors: {
        form: ["Invalid course id."],
      },
    };
  }

  const builderData = await getCourseBuilderData(courseId);

  if (!builderData) {
    return {
      errors: {
        form: ["Course was not found."],
      },
    };
  }

  if (builderData.course.status !== "draft") {
    return {
      errors: {
        form: ["Only draft courses can be published."],
      },
    };
  }

  const validation = validateCourseForPublishing(
    {
      title: builderData.course.title,
      description: builderData.course.description,
      level: builderData.course.level,
    },
    builderData.modules,
  );

  if (!validation.isValid) {
    return {
      validationErrors: validation.errors,
    };
  }

  await db
    .update(courses)
    .set({
      status: "published",
      updatedAt: new Date(),
    })
    .where(eq(courses.id, courseId));

  revalidatePath(`/dashboard/courses/${courseId}/builder`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/courses");
  revalidatePath("/courses");

  return {};
}
