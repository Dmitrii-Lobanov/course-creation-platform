export type PublishableCourse = {
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
};

export type PublishableLesson = {
  title: string;
  type: "text" | "video";
  content?: string | null;
};

export type PublishableModule = {
  title: string;
  lessons: PublishableLesson[];
};

export type CoursePublishingValidationResult = {
  isValid: boolean;
  errors: string[];
};

export function validateCourseForPublishing(
  course: PublishableCourse,
  modules: PublishableModule[],
): CoursePublishingValidationResult {
  const errors: string[] = [];

  if (!course.title.trim()) {
    errors.push("Course title is required.");
  }

  if (!course.description.trim()) {
    errors.push("Course description is required.");
  }

  if (!course.level) {
    errors.push("Course level is required.");
  }

  if (modules.length === 0) {
    errors.push("Course must have at least one module.");
  }

  modules.forEach((module) => {
    if (!module.title.trim()) {
      errors.push("Each module must have a title.");
    }

    if (module.lessons.length === 0) {
      errors.push(
        `Module "${module.title || "Untitled module"}" must have at least one lesson.`,
      );
    }

    module.lessons.forEach((lesson) => {
      if (!lesson.title.trim()) {
        errors.push(`Module "${module.title}" has a lesson without a title.`);
      }

      if (lesson.type === "text" && !lesson.content?.trim()) {
        errors.push(
          `Text lesson "${lesson.title || "Untitled lesson"}" must have content.`,
        );
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
