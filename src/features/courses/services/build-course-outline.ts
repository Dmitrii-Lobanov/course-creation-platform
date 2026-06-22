export type CourseOutlineModuleInput = {
  id: string;
  title: string;
  position: number;
};

export type CourseOutlineLessonInput = {
  id: string;
  moduleId: string;
  title: string;
  type: "text" | "video";
  position: number;
};

export function buildCourseOutline(
  modules: CourseOutlineModuleInput[],
  lessons: CourseOutlineLessonInput[],
) {
  return modules.map((module) => ({
    ...module,
    lessons: lessons.filter((lesson) => lesson.moduleId === module.id),
  }));
}