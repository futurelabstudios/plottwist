import { describe, it, expect } from "vitest";
import { courses, fantasyChoices, fantasyPage } from "./content";

describe("Lumiclinik Play and Work content", () => {
  it("keeps four panels and the reader’s name throughout every fantasy route", () => {
    for (const first of fantasyChoices)
      for (const last of fantasyChoices) {
        for (const history of [[], [first.id], [first.id, last.id]]) {
          const page = fantasyPage("Asha", history);
          expect(page.panels).toHaveLength(4);
          expect(page.panels.flat().join(" ")).toContain("Asha");
        }
      }
  });
  it("changes the immediate scene and provides four distinct fantasy endings", () => {
    expect(
      new Set(
        fantasyChoices.map((c) => JSON.stringify(fantasyPage("Asha", [c.id]))),
      ).size,
    ).toBe(4);
    expect(
      new Set(
        fantasyChoices.map((c) => fantasyPage("Asha", ["listen", c.id]).title),
      ).size,
    ).toBe(4);
  });
  it("carries the first decision into a mixed fantasy ending", () => {
    const rescue = fantasyPage("Asha", ["rescue", "search"]);
    const listen = fantasyPage("Asha", ["listen", "search"]);
    expect(rescue.title).toBe(listen.title);
    expect(rescue.panels[1]).not.toEqual(listen.panels[1]);
  });
  it("gives every learning decision a consequence and an actionable exercise", () => {
    const ids = new Set<string>();
    expect(courses).toHaveLength(3);
    for (const course of courses) {
      expect(course.lessons).toHaveLength(3);
      for (const lesson of course.lessons) {
        const key = course.id + "/" + lesson.id;
        expect(ids.has(key)).toBe(false);
        ids.add(key);
        expect(lesson.scene.length).toBeGreaterThan(50);
        expect(lesson.answers).toHaveLength(3);
        expect(lesson.consequences).toHaveLength(3);
        expect(new Set(lesson.consequences).size).toBe(3);
        expect(lesson.correct).toBeGreaterThanOrEqual(0);
        expect(lesson.correct).toBeLessThan(lesson.answers.length);
        expect(lesson.exercise.length).toBeGreaterThan(20);
      }
    }
  });
});
