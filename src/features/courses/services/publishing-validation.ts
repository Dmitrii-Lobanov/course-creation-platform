type LessonForPublishing = {
  id: string;
  title: string;
  content: string;
};

type ModuleForPublishing = {
  id: string;
  title: string;
  lessons: LessonForPublishing[];
};

type CourseForPublishing = {
  title: string;
  description: string;
  modules: ModuleForPublishing[];
};

export type PublishingValidationIssue = {
  field: string;
  message: string;
};

export function validateCourseForPublishing(
  course: CourseForPublishing,
): PublishingValidationIssue[] {
  const issues: PublishingValidationIssue[] = [];

  if (!course.title.trim()) {
    issues.push({
      field: "title",
      message: "Course title is required.",
    });
  }

  if (!course.description.trim()) {
    issues.push({
      field: "description",
      message: "Course description is required.",
    });
  }

  if (course.modules.length === 0) {
    issues.push({
      field: "modules",
      message: "Course must have at least one module.",
    });
  }

  const lessons = course.modules.flatMap((module) => module.lessons);

  if (lessons.length === 0) {
    issues.push({
      field: "lessons",
      message: "Course must have at least one lesson.",
    });
  }

  course.modules.forEach((module, moduleIndex) => {
    if (!module.title.trim()) {
      issues.push({
        field: `modules.${moduleIndex}.title`,
        message: "Module title is required.",
      });
    }

    module.lessons.forEach((lesson, lessonIndex) => {
      if (!lesson.title.trim()) {
        issues.push({
          field: `modules.${moduleIndex}.lessons.${lessonIndex}.title`,
          message: "Lesson title is required.",
        });
      }

      if (!lesson.content.trim()) {
        issues.push({
          field: `modules.${moduleIndex}.lessons.${lessonIndex}.content`,
          message: "Lesson content is required.",
        });
      }
    });
  });

  return issues;
}