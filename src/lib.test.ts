import { levelGapMap, memScore, newMem, ST_LT_THRESHOLD } from "./lib";
import { MemAnswer } from "./store";

const newCheck = (success: boolean): MemAnswer => ({ success, date: new Date() });

test("Empty checks should score 0", () => {
    const mem = newMem();
    expect(memScore(mem).level).toBe(0);
    expect(memScore(mem).nextCheck <= new Date()).toBe(true);
});

test("Test link between successes and levels", () => {
    const mem = newMem();

    for (let i = 0; i <= Object.keys(levelGapMap).length; i++) {
        mem.checks = new Array(i).fill(newCheck(true));
        const score = memScore(mem);
        // console.log(`Testing ${i} successes`, score);
        expect(score.level).toBe(i);
        if (i <= ST_LT_THRESHOLD) {
            expect(score.memory).toBe("ST");
        } else {
            expect(score.memory).toBe("LT");
        }
    }
});

test("LT behaviour", () => {
    const mem = newMem();
    mem.checks = [newCheck(false), ...new Array(ST_LT_THRESHOLD + 1).fill(newCheck(true)), newCheck(false)];

    let score = memScore(mem);
    expect(score.memory).toBe("LT");
    expect(score.level).toBe(ST_LT_THRESHOLD + 1);

    mem.checks = [newCheck(true), newCheck(true), ...mem.checks];
    score = memScore(mem);
    expect(score.level).toBe(ST_LT_THRESHOLD + 3);
});
