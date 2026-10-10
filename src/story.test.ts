import { describe, expect, it } from "vitest";
import {
  branches,
  createBook,
  advance,
  fixture,
  choicesFor,
  validBook,
  worldFor,
  interpretOffline,
} from "./lib/story";
describe("ten-page branching book", () => {
  for (const branch of branches)
    it(`completes the ${branch} route with a personalized four-panel page at every step`, () => {
      let book = createBook("Asha");
      for (let i = 1; i < 10; i++) {
        expect(choicesFor(i)).toHaveLength(4);
        book = advance(
          book,
          branch,
          choicesFor(i).find((c) => c.id === branch)!.label,
        );
        expect(book.pages.at(-1)!.panels).toHaveLength(4);
        expect(JSON.stringify(book.pages.at(-1))).toContain("Asha");
        expect(validBook(book)).toEqual(book);
      }
      expect(book.pages).toHaveLength(10);
      expect(choicesFor(10)).toEqual([]);
      expect(advance(book, branch, "again")).toEqual(book);
      expect(worldFor(book.history).route).toBe(branch);
    });
  it("each decision changes the immediate next page across all nine decision points", () => {
    for (let i = 0; i < 9; i++) {
      const history = Array.from({ length: i }, () => branches[i % 4]);
      const variations = branches.map((branch) =>
        JSON.stringify(fixture("Shabbir", [...history, branch])),
      );
      expect(new Set(variations).size).toBe(4);
    }
  });
  it("earlier decisions still determine resources and ending when the last choice is the same", () => {
    const a = [...Array.from({ length: 8 }, () => branches[0]), branches[2]];
    const b = [...Array.from({ length: 8 }, () => branches[1]), branches[2]];
    expect(worldFor(a).energy).not.toEqual(worldFor(b).energy);
    expect(fixture("Kai", a).title).not.toEqual(fixture("Kai", b).title);
  });
  it("rejects corrupt, incomplete and mismatched saves", () => {
    const book = createBook("Ada");
    expect(validBook({ ...book, version: 1 })).toBeNull();
    expect(validBook({ ...book, history: ["rescue"] })).toBeNull();
    expect(
      validBook({ ...book, pages: [{ ...book.pages[0], panels: [] }] }),
    ).toBeNull();
    expect(validBook({ ...book, name: "Someone else" })).toBeNull();
  });
  it("asks for clarification rather than guessing ambiguous or negated orders", () => {
    expect(interpretOffline("Scan the station", 1)).toBe("discovery");
    expect(interpretOffline("scan and rescue", 1)).toBeNull();
    expect(interpretOffline("do not rescue them", 1)).toBeNull();
    expect(interpretOffline("maybe?", 1)).toBeNull();
  });
});
