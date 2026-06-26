import { describe, expect, it } from "vitest";

import { createLessonAction } from "./create-lesson.action";

describe("createLessonAction", () => {
  it("preserves submitted values when validation fails", async () => {
    const formData = new FormData();

    formData.set("moduleId", "not-a-valid-module-id");
    formData.set("title", "");
    formData.set("type", "video");
    formData.set("content", "https://example.com/video");

    const result = await createLessonAction({}, formData);

    expect(result.values).toEqual({
      title: "",
      type: "video",
      content: "https://example.com/video",
    });

    expect(result.errors?.title).toBeDefined();
    expect(result.errors?.moduleId).toBeDefined();
    expect(result.resetKey).toBeUndefined();
  });
});
