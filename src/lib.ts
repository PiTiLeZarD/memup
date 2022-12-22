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

// 誰の本ですか。これわ私の日本語の本！
