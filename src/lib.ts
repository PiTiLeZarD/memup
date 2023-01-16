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
    const level =
        (groupedChecks.length == 0 ? 0 : groupedChecks[0][0].success ? groupedChecks[0].length - 1 : 0) +
        (memory == "LT" ? ST_LT_THRESHOLD : 1);

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

export const randomiseDeck = (mems: MemType[]): MemType[] =>
    mems
        .map((mem: MemType) => [Math.random(), mem])
        .sort(([a, memA], [b, memB]) => (a as number) - (b as number))
        .map(([_, mem]) => mem as MemType);

export const memDeck = (mems: MemType[]): MemType[] =>
    randomiseDeck(mems.filter((mem: MemType) => memScore(mem).nextCheck <= new Date()));

export const kanaToRomaji = (s: string) => wanakana.toRomaji(s);
