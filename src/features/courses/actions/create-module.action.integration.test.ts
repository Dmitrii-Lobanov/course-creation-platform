import { describe, expect, it } from "vitest";

import { createModuleAction } from "./create-module.action";

describe("createModuleAction", () => {
  it("preserves submitted values when validation fails", async () => {
    const formData = new FormData();

    formData.set("courseId", "not-a-valid-course-id");
    formData.set("title", "");

    const result = await createModuleAction({}, formData);

    expect(result.values).toEqual({
      title: "",
    });

    expect(result.errors?.title).toBeDefined();
    expect(result.errors?.courseId).toBeDefined();
    expect(result.resetKey).toBeUndefined();
  });
});