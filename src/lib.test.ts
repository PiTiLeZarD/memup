import { deserialiseMems, levelGapMap, memConflicts, memScore, newMem, ST_LT_THRESHOLD } from "./lib";
import { MemAnswer, MemType } from "./store";

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

test("deserialiseMems", () => {
    const serialised = [{ ...newMem(), checks: [{ date: new Date().toString() }] }];
    expect(typeof serialised[0].checks[0].date).toBe("string");
    const mems = deserialiseMems(serialised);
    expect(typeof mems[0].checks[0].date).toBe("object");
});

test("memConflics", () => {
    const existingMem: MemType = { ...newMem(), mem: "Test", description: "TestDescription" };
    const importingMem: MemType = { ...newMem(), mem: "Test2", description: "Test2Description" };
    const ignoringMem: MemType = { ...existingMem };
    const conflictingMem: MemType = { ...existingMem, description: "SomeOtherDescription" };

    expect(memConflicts(newMem(), [])).toBe("FINE");
    expect(memConflicts(importingMem, [existingMem])).toBe("FINE");
    expect(memConflicts(ignoringMem, [existingMem])).toBe("IGNORE");
    expect(memConflicts(conflictingMem, [existingMem])).toBe("CONFLICTS");
    expect(memConflicts(ignoringMem, [existingMem])).toBe("IGNORE");
});
