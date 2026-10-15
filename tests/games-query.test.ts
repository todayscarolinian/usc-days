import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { decodeGamesCursor, encodeGamesCursor } from "@/src/lib/games-cursor";
import { idListQuery } from "@/src/lib/api/query-params";

describe("games cursor", () => {
  it("round-trips the start time and id", () => {
    const game = { startDate: new Date("2026-10-15T03:30:00.000Z"), id: 42 };
    assert.deepEqual(decodeGamesCursor(encodeGamesCursor(game)), game);
  });

  it("rejects malformed cursors", () => {
    for (const value of ["", "42", "_42", "2026-10-15T03:30:00.000Z", "not-a-date_4", "2026-10-15T03:30:00.000Z_0", "2026-10-15T03:30:00.000Z_x"]) {
      assert.equal(decodeGamesCursor(value), null, value);
    }
  });
});

describe("id list query", () => {
  it("parses comma-separated ids", () => {
    assert.deepEqual(idListQuery.parse("1, 2,3"), [1, 2, 3]);
  });

  it("is optional", () => {
    assert.equal(idListQuery.parse(undefined), undefined);
  });

  it("rejects non-positive or non-numeric ids", () => {
    for (const value of ["", "1,,2", "0", "1,a", "-3"]) {
      assert.equal(idListQuery.safeParse(value).success, false, value);
    }
  });
});
