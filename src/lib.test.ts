import { deserialiseMems, findConflicts, levelGapMap, memConflicts, memScore, newMem, ST_LT_THRESHOLD } from "./lib";
import { MemAnswer, MemType } from "./store";

const newCheck = (success: boolean): MemAnswer => ({ success, date: new Date() });

// const rtest = (desc, fn) => {};

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
        expect(score.level).toBe(i);
        if (i <= ST_LT_THRESHOLD) {
            expect(score.memory).toBe("ST");
        } else {
            expect(score.memory).toBe("LT");
        }
    }
});
test("Test first error", () => {
    const mem = newMem();
    mem.checks = [newCheck(false)];
    const score = memScore(mem);
    expect(score.level).toBe(1);
});

test("Test levels edge case 1", () => {
    const mem = { ...newMem(), id: "test" };
    mem.checks = JSON.parse(
        '[{"success":true,"time":0,"date":"2023-02-28T04:22:31.091Z"},{"success":true,"time":5,"date":"2023-01-28T03:26:49.491Z"},{"success":true,"time":3,"date":"2023-01-20T20:53:58.887Z"},{"success":true,"time":2,"date":"2023-01-16T10:47:40.351Z"},{"success":true,"time":4,"date":"2023-01-15T20:12:42.138Z"},{"success":true,"time":5,"date":"2023-01-15T11:25:51.274Z"},{"success":true,"time":8,"date":"2023-01-15T09:48:39.798Z"},{"success":false,"selected":"HriNIy1F8fyGEhmMxqG56","time":9,"date":"2023-01-14T03:09:12.503Z"},{"success":true,"time":9,"date":"2023-01-13T22:16:27.329Z"},{"success":true,"time":2,"date":"2023-01-13T04:17:41.510Z"},{"success":true,"time":7,"date":"2023-01-12T04:08:21.406Z"},{"success":true,"time":6,"date":"2023-01-06T20:35:51.688Z"},{"success":true,"time":5,"date":"2023-01-04T20:24:05.400Z"},{"success":true,"time":8,"date":"2023-01-03T19:44:56.263Z"},{"success":true,"time":5,"date":"2023-01-03T08:20:46.399Z"},{"success":true,"time":4,"date":"2023-01-03T04:56:39.515Z"},{"success":true,"time":5,"date":"2023-01-03T04:25:24.040Z"}]'
    ).map((c) => ({ ...c, date: new Date(c.date) }));

    const score = memScore(mem);

    expect(score.level).toBe(14);
    expect(score.memory).toBe("LT");
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

    mem.checks = new Array(11).fill(newCheck(true));
    mem.id = newMem().id;
    score = memScore(mem);
    expect(score.level).toBe(11);
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

test("memConflicts with different furigana", () => {
    const memA: MemType = { ...newMem(), mem: "何時", furigana: ["いつ"], description: "when" };
    const memB: MemType = { ...newMem(), mem: "何時", furigana: ["なんじ"], description: "what time" };
    expect(memConflicts(memA, [memB])).toBe("FINE");
});

test("findConflicts", () => {
    const mems = [
        { ...newMem(), mem: "Test1", description: "Test1Description" },
        { ...newMem(), mem: "Test2", description: "Test2Description" },
        { ...newMem(), mem: "Test3", description: "Test3Description" },
        { ...newMem(), mem: "Test4", description: "Test4Description" },
    ];

    const imports = [
        { ...mems[0] },
        { ...newMem(), mem: "Test1", description: "Somestuff" },
        { ...newMem(), mem: "Test5", description: "Test5Description" },
    ];

    let conflicts = findConflicts(imports, mems);

    expect(Object.keys(conflicts).length).toBe(3);
    expect(conflicts["FINE"].length).toBe(1);
    expect(conflicts["FINE"][0].id).toBe(imports[2].id);
    expect(conflicts["CONFLICTS"].length).toBe(1);
    expect(conflicts["CONFLICTS"][0].id).toBe(imports[1].id);
    expect(conflicts["IGNORE"].length).toBe(1);
    expect(conflicts["IGNORE"][0].id).toBe(imports[0].id);

    // Testing if the import has duplicates or whatever
    conflicts = findConflicts([...imports, imports[2]], mems);
    expect(Object.keys(conflicts).length).toBe(3);
    expect(conflicts["FINE"].length).toBe(1);
    expect(conflicts["IGNORE"].length).toBe(2);
});

test("edgecase score", () => {
    const checks =
        '[{"success":true,"time":12,"date":"2023-03-15T02:38:01.075Z"},{"success":true,"time":11,"date":"2023-02-26T20:57:19.269Z"},{"success":true,"time":4,"date":"2023-02-19T20:55:32.308Z"},{"success":true,"time":7,"date":"2023-02-15T20:20:12.369Z"},{"success":true,"time":12,"date":"2023-02-13T03:55:23.567Z"},{"success":false,"selected":"tz67LGgLRXMRYyFVfR-uY","time":12,"date":"2023-02-11T19:31:22.313Z"},{"success":true,"time":15,"date":"2023-02-09T12:05:51.269Z"},{"success":false,"time":20,"date":"2023-02-08T09:58:08.100Z"},{"success":true,"time":4,"date":"2023-02-04T08:01:03.006Z"},{"success":true,"time":10,"date":"2023-02-02T03:58:10.315Z"},{"success":false,"selected":"Hulq9YtXRyRjSrv8ZX_Ns","time":19,"date":"2023-02-01T02:14:31.596Z"},{"success":true,"time":16,"date":"2023-01-30T00:51:20.920Z"},{"success":true,"time":9,"date":"2023-01-19T09:46:01.937Z"},{"success":true,"time":8,"date":"2023-01-14T04:30:18.693Z"},{"success":true,"time":9,"date":"2023-01-12T04:02:59.339Z"},{"success":true,"time":5,"date":"2023-01-09T20:58:56.659Z"},{"success":true,"time":4,"date":"2023-01-08T20:44:35.328Z"},{"success":true,"time":9,"date":"2023-01-08T03:27:58.345Z"},{"success":true,"time":7,"date":"2023-01-08T01:03:34.235Z"},{"success":false,"time":10,"date":"2023-01-07T21:10:35.534Z"},{"success":false,"time":10,"date":"2023-01-07T20:22:00.971Z"}]';

    const mem = deserialiseMems([{ ...newMem(), checks: JSON.parse(checks) }])[0];
    expect(memScore(mem).level).toBe(12);
    mem.checks = [newCheck(true), ...mem.checks];
    expect(memScore(mem).level).toBe(13);
    mem.checks = [newCheck(true), ...mem.checks];
    expect(memScore(mem).level).toBe(14);
});
