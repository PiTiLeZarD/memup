import { nanoid } from "nanoid";
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

export const includesKanji = (s: string): boolean =>
    s ? splitByKanji(s).filter((block) => isKanji(block[0])).length > 0 : false;

export const newMem = (): MemType => ({
    id: nanoid(),
    checks: [],
    mem: "",
    description: "",
});

export const memScore = (mem: MemType): MemScore => {
    return {
        score: 10,
        memory: "ST",
        nextCheck: new Date(),
    };
};

export const randomiseDeck = (mems: MemType[]): MemType[] =>
    mems
        .map((mem: MemType) => [Math.random(), mem])
        .sort(([a, memA], [b, memB]) => (a as number) - (b as number))
        .map(([_, mem]) => mem as MemType);

export const memDeck = (mems: MemType[]): MemType[] =>
    randomiseDeck(mems.filter((mem: MemType) => memScore(mem).nextCheck <= new Date()));
