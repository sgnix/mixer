import { shard } from "../util";
import * as _ from "lodash";

function test_shard(n: number, c: number) {
  return describe(`shard ${n} into ${c}`, () => {
    const s = shard(n, c);
    it("sums up to original", () => {
      expect(Math.floor(_.sum(s))).toBe(n);
    });
    it(`has ${c} elements`, () => {
      expect(s.length).toBe(c);
    });
  });
}

test_shard(100, 5);
test_shard(50, 3);
test_shard(1000, 20);
