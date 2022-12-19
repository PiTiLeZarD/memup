import React from "react";
import { Kanji } from "./Kanji";
import { isKanji, splitByKanji } from "./lib";

export type FuriganaProps = {
    furigana: string[];
    children: string;
};

export type FuriganaComponent = React.FunctionComponent<FuriganaProps>;

export const Furigana: FuriganaComponent = ({ furigana, children }): JSX.Element => {
    const split = splitByKanji(children);

    if (split.filter((block) => isKanji(block[0])).length !== furigana.length)
        throw new Error("Furigana and Kanji length don't match");

    let furiganaIt = 0;
    return (
        <>
            {[...split].map((block) =>
                isKanji(block[0]) ? (
                    <Kanji key={furiganaIt} furigana={furigana[furiganaIt++]}>
                        {block}
                    </Kanji>
                ) : (
                    block
                )
            )}
        </>
    );
};
