import { db } from "@/db/client";
import { courseModules, courses, lessons } from "@/db/schema";

export async function resetDatabase() {
  await db.delete(lessons);
  await db.delete(courseModules);
  await db.delete(courses);
}
