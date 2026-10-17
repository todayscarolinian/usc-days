import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { MAX_SCORE_DELTA, ScoreDeltaSchema } from "@/src/types/games.types";

describe("score delta payload", () => {
  it("accepts whole-number changes for either team", () => {
    for (const payload of [
      { team: "A", delta: 1 },
      { team: "B", delta: -3 },
      { team: "A", delta: 17 },
      { team: "B", delta: MAX_SCORE_DELTA },
    ]) {
      assert.equal(ScoreDeltaSchema.safeParse(payload).success, true);
    }
  });

  it("rejects zero, fractional, oversized, and unknown-team changes", () => {
    for (const payload of [
      { team: "A", delta: 0 },
      { team: "A", delta: 1.5 },
      { team: "B", delta: MAX_SCORE_DELTA + 1 },
      { team: "C", delta: 1 },
      { team: "A" },
    ]) {
      assert.equal(ScoreDeltaSchema.safeParse(payload).success, false);
    }
  });
});
