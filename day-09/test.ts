import { describe, it } from "https://deno.land/std@0.168.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import {
  calculateKnot,
  calculateKnotPositions,
  Coords,
  generateInitialState,
  Instruction,
  mapKnotsToPath,
} from "./lib.ts";

describe("Calculating knots", function () {
  it("aligns diagonal drift on an axis", function () {
    assertEquals(calculateKnot([2, 1], [0, 0]), [1, 1]);
  });

  it("no-op when no significant drift", function () {
    assertEquals(calculateKnot([1, 1], [0, 0]), [0, 0]);
  });

  it("horizontal shift when notable horizontal drift", function () {
    assertEquals(calculateKnot([2, 0], [0, 0]), [1, 0]);
  });

  it("vertical shift when notable vertical drift", function () {
    assertEquals(calculateKnot([0, 2], [0, 0]), [0, 1]);
  });

  describe("Parsing instructions", function () {
    it("translates instructions to paths", function () {
      const instructions: Instruction[] = [
        ["R", 4],
        ["U", 4],
        ["L", 3],
        ["D", 1],
        ["R", 4],
        ["D", 1],
        ["L", 5],
        ["R", 2],
      ];

      const state = generateInitialState(3)(instructions);

      assertEquals(
        state.headPath.length,
        instructions.reduce((acc, e) => acc += e[1], 0) + 1,
      );
    });
  });

  describe("Knot movements", function () {
    describe("Directionality", function () {
      it("moves right", function () {
        const headPos: Coords = [2, 0];
        const knotPos: Coords = [0, 0];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[1, 0]].toString());
      });

      it("moves left", function () {
        const headPos: Coords = [2, 0];
        const knotPos: Coords = [4, 0];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[3, 0]].toString());
      });

      it("moves left negatively", function () {
        const headPos: Coords = [-2, 0];
        const knotPos: Coords = [0, 0];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[-1, 0]].toString());
      });

      it("moves down negatively", function () {
        const headPos: Coords = [0, -2];
        const knotPos: Coords = [0, 0];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[0, -1]].toString());
      });

      it("moves down", function () {
        const headPos: Coords = [0, 0];
        const knotPos: Coords = [0, 2];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[0, 1]].toString());
      });

      it("moves up", function () {
        const headPos: Coords = [0, 2];
        const knotPos: Coords = [0, 0];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[0, 1]].toString());
      });
    });

    describe("diagonally", function () {
      it("moves north-northeast", function () {
        const headPos: Coords = [2, 1];
        const knotPos: Coords = [0, 0];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[1, 1]].toString());
      });

      it("moves east-northeast", function () {
        const headPos: Coords = [1, 2];
        const knotPos: Coords = [0, 0];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[1, 1]].toString());
      });

      it("moves north-northwest", function () {
        const headPos: Coords = [1, 2];
        const knotPos: Coords = [2, 0];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[1, 1]].toString());
      });

      it("moves west-northwest", function () {
        const knotPos: Coords = [2, 0];
        const headPos: Coords = [knotPos[0] - 2, knotPos[1] + 1];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[1, 1]].toString());
      });

      it("moves west-southwest", function () {
        const knotPos: Coords = [2, 2];
        const headPos: Coords = [knotPos[0] - 2, knotPos[1] - 1];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[1, 1]].toString());
      });

      it("moves south-southwest", function () {
        const knotPos: Coords = [2, 2];
        const headPos: Coords = [knotPos[0] - 1, knotPos[1] - 2];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[1, 1]].toString());
      });

      it("moves south-southeast", function () {
        const knotPos: Coords = [2, 2];
        const headPos: Coords = [knotPos[0] - 1, knotPos[1] - 2];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[1, 1]].toString());
      });

      it("moves east-southeast", function () {
        const knotPos: Coords = [2, 2];
        const headPos: Coords = [knotPos[0] - 2, knotPos[1] - 1];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[1, 1]].toString());
      });

      it("moves equally", function () {
        const knotPos: Coords = [2, 2];
        const headPos: Coords = [knotPos[0] - 2, knotPos[1] - 2];
        const result: Coords[] = calculateKnotPositions([knotPos], headPos);

        assertEquals(result.toString(), [[1, 1]].toString());
      });
    });

    it("cascades multiple knot movements", function () {
      const headPos: Coords = [3, 0];
      const knotPos: Coords = [1, 0];
      const result: Coords[] = calculateKnotPositions(
        [knotPos, knotPos],
        headPos,
      );

      assertEquals(result.toString(), [[2, 0], [1, 0]].toString());
    });

    it("follows a path", function () {
      const headPath: Coords[] = [[0, 0], [0, 1], [0, 2], [0, 3]];
      const knots: Coords[][] = [[[0, 0], [0, 0], [0, 0]]];
      const result = mapKnotsToPath(headPath, knots);

      const expectedResult = [
        [[0, 0], [0, 0], [0, 0]],
        [[0, 0], [0, 0], [0, 0]],
        [[0, 1], [0, 0], [0, 0]],
        [[0, 2], [0, 1], [0, 0]],
      ];

      assertEquals(result.length, expectedResult.length);
      assertEquals(
        result.map((x) => x.toString()),
        expectedResult.map((x) => x.toString()),
      );
    });
  });
});
