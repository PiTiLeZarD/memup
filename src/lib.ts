import * as hd from "humanize-duration";
import { nanoid } from "nanoid";
import * as wanakana from "wanakana";

import { MemAnswer, MemScore, MemType } from "./store";

export const isKanji = (ch: string): boolean =>
    (ch >= "\u4e00" && ch <= "\u9faf") || (ch >= "\u3400" && ch <= "\u4dbf") || ch === "𠮟";

export const splitByKanji = (s: string): string[] =>
    [...s].reduce<[boolean, string[]]>(
        ([previousKanji, acc], char) => [
            isKanji(char),
            previousKanji == isKanji(char)
                ? [...acc.slice(0, -1), ...[(acc.slice(-1)[0] || "") + char]]
                : [...acc, char],
        ],
        [false, []]
    )[1];

export const sanitizeMem = (s: string): string => s.replace(/[ ~\[\]]/g, "");

export const includesKanji = (s: string): boolean =>
    s ? splitByKanji(s).filter((block) => isKanji(block[0])).length > 0 : false;

export const newMem = (): MemType => ({
    id: nanoid(),
    checks: [],
    mem: "",
    description: "",
    folders: [],
});

export const levelGapMap = {
    1: 60 * 60000,
    2: 6 * 60 * 60000,
    3: 12 * 60 * 60000,
    4: 24 * 60 * 60000,
    5: 2 * 24 * 60 * 60000,
    6: 5 * 24 * 60 * 60000,
    7: 24 * 60 * 60000,
    8: 2 * 24 * 60 * 60000,
    9: 4 * 24 * 60 * 60000,
    10: 7 * 24 * 60 * 60000,
};
export const ST_LT_THRESHOLD = 6;
const MONTH = 30 * 24 * 60 * 60000;

const cache: { [key: string]: MemScore } = {};

export const deserialiseMems = (mems: any[]): MemType[] =>
    mems.map((m) => ({
        ...m,
        checks: (m.checks || []).map((c: any) => ({ ...c, date: new Date(c.date as Date) })),
    }));

export type ConflictType = "IGNORE" | "CONFLICTS" | "FINE" | "MERGE";
export type ImportConflictsType = { [k in ConflictType]?: MemType[] };
export const memConflicts = (mem: MemType, existingMems: MemType[]): ConflictType =>
    existingMems.reduce<ConflictType>((status, m) => {
        if (status != "FINE") return status;
        if (m.id == mem.id) {
            if (m.mem == mem.mem && m.description == mem.description) return "IGNORE";
            return "CONFLICTS";
        }
        if (m.mem == mem.mem) {
            if ((m.furigana || []).join("") == (mem.furigana || []).join("")) return "CONFLICTS";
        }
        return "FINE";
    }, "FINE");

export const findConflicts = (newMems: MemType[], mems: MemType[]) =>
    newMems.reduce<ImportConflictsType>(
        (acc, newMem) =>
            ((conflictStatus) => ({ ...acc, [conflictStatus]: [...(acc[conflictStatus] || []), newMem] }))(
                memConflicts(newMem, [
                    ...mems,
                    ...Object.entries(acc).reduce<MemType[]>((previousMems, [c, ms]) => [...previousMems, ...ms], []),
                ])
            ),
        {}
    );

export const cleanMemsForExport = (
    mems: MemType[],
    folders?: boolean | string[],
    keepChecks?: boolean
): Partial<MemType>[] =>
    mems.map((m) => {
        let nm: Partial<MemType> = { id: m.id, mem: m.mem, description: m.description };
        if (m.hint) nm.hint = m.hint;
        if (m.furigana) nm.furigana = m.furigana;
        if (folders) {
            if (folders === true) nm.folders = [...m.folders];
            else nm.folders = m.folders.filter((f) => folders.filter((fs) => f.startsWith(fs)).length > 0);
        }
        if (keepChecks) nm.checks = m.checks;
        return nm;
    });

export const cleanMemsForImport = (mems: Partial<MemType>[]): MemType[] =>
    mems.map((m) => ({ ...m, checks: m.checks || [] } as MemType));

export const dateDiff = (d1: Date, d2: Date = new Date()) => (d2 as any) - (d1 as any);

export const sortByDate: <T>(a: T[], f: (i: T) => Date) => T[] = (a, f) => a.sort((a, b) => dateDiff(f(a), f(b)));

export const timeUntil = (d: Date) =>
    hd(-dateDiff(d), {
        units: ["d", "h", "m"],
        round: true,
    });

export const memScore = (mem: MemType): MemScore => {
    if (mem.checks.length == 0)
        return {
            level: 0,
            memory: "ST",
            nextCheck: new Date(),
        };

    const cacheKey = `${mem.id}_${mem.checks.length}`;
    if (Object.keys(cache).includes(cacheKey)) return cache[cacheKey];

    const checks = sortByDate(mem.checks, (c) => c.date as Date);
    const groupedChecks = groupChecksBySuccess(checks);

    const memory = groupedChecks.filter((g) => g.length > ST_LT_THRESHOLD).length > 0 ? "LT" : "ST";
    let level = groupedChecks.length == 0 ? 0 : groupedChecks[0][0].success ? groupedChecks[0].length : 1;
    if (memory == "LT") {
        level = groupedChecks[0][0].success
            ? groupedChecks[0].length > ST_LT_THRESHOLD
                ? groupedChecks[0].length
                : groupedChecks[0].length + ST_LT_THRESHOLD + 1
            : ST_LT_THRESHOLD + 1;
    }

    const nextCheck = new Date(
        checks[0].date?.getTime() + (Object.keys(levelGapMap).includes(String(level)) ? levelGapMap[level] : MONTH)
    );

    cache[cacheKey] = { level, memory, nextCheck };
    return cache[cacheKey];
};

export const groupChecksBySuccess = (checks: MemAnswer[]): MemAnswer[][] =>
    checks.reduce((acc: MemAnswer[][], curr: MemAnswer) => {
        if (acc.length == 0) return [[curr]];
        if (acc[acc.length - 1][0].success === curr.success) {
            acc[acc.length - 1].push(curr);
            return acc;
        }
        return [...acc, [curr]];
    }, []);

export const clusterByDate: <T>(objects: T[], cb: (o: T) => Date, interval?: number) => T[][] = (
    objects,
    cb,
    interval = 60 * 60000
) =>
    sortByDate(objects, cb).reduce<typeof objects[]>((clusters, obj) => {
        const lastCluster = clusters[clusters.length - 1];
        if (!lastCluster || cb(lastCluster[lastCluster.length - 1]).getTime() - cb(obj).getTime() > interval)
            clusters.push([obj]);
        else lastCluster.push(obj);
        return clusters;
    }, []);

export const hiraganaValue = (mem: MemType) => {
    if ((mem.furigana || []).length > 0) {
        let i = 0;
        return splitByKanji(mem.mem)
            .map((b) => (isKanji(b) ? (mem.furigana as string[])[i++] : b))
            .join("");
    }
    return mem.mem;
};

const mulberry32 = (a: number) => () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const randomiseDeck = (mems: MemType[], seed?: number): MemType[] => {
    const randomiser = mulberry32(seed || new Date().getTime());
    return mems
        .map((mem: MemType) => [randomiser(), mem])
        .sort(([a, memA], [b, memB]) => (a as number) - (b as number))
        .map(([_, mem]) => mem as MemType);
};

export const memDeck = (mems: MemType[]): MemType[] =>
    randomiseDeck(mems.filter((mem: MemType) => memScore(mem).nextCheck <= new Date()));

export const kanaToRomaji = (s: string) => wanakana.toRomaji(s);
