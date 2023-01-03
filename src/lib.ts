import { nanoid } from "nanoid";
import * as wanakana from "wanakana";

import { MemScore, MemType } from "./store";

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

export const sanitizeMem = (s: string): string => s.replace(" ", "").replace("~", "");

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
    1: 30 * 60000,
    2: 2 * 60 * 60000,
    3: 6 * 60 * 60000,
    4: 24 * 60 * 60000,
    5: 2 * 24 * 60 * 60000,
    6: 5 * 24 * 60 * 60000,
};
const MONTH = 30 * 24 * 60 * 60000;

export const memScore = (mem: MemType): MemScore => {
    if (mem.checks.length == 0)
        return {
            level: 0,
            memory: "ST",
            nextCheck: new Date(),
        };

    const checks = mem.checks.sort((a, b) => (b.date as any) - (a.date as any));
    const lastFail = checks.findIndex((c) => !c.success);
    const level = lastFail >= 0 ? lastFail + 1 : checks.length;
    const memory = Object.keys(levelGapMap).includes(String(level)) ? "ST" : "LT";
    const nextCheck = new Date(checks[0].date?.getTime() + (memory == "LT" ? MONTH : levelGapMap[level]));

    return { level, memory, nextCheck };
};

export const randomiseDeck = (mems: MemType[]): MemType[] =>
    mems
        .map((mem: MemType) => [Math.random(), mem])
        .sort(([a, memA], [b, memB]) => (a as number) - (b as number))
        .map(([_, mem]) => mem as MemType);

export const memDeck = (mems: MemType[]): MemType[] =>
    randomiseDeck(mems.filter((mem: MemType) => memScore(mem).nextCheck <= new Date()));

export const kanaToRomaji = (s: string) => wanakana.toRomaji(s);
