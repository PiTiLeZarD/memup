import React from "react";
import { kanaToRomaji } from "../lib";
import { useStore } from "../store";

export type KanjiProps = {
    furigana: string;
    opacity?: number;
};

export type KanjiComponent = React.FunctionComponent<React.PropsWithChildren<KanjiProps>>;

export const Kanji: KanjiComponent = ({ furigana, opacity = 0.8, children }): JSX.Element => {
    const { furiganaMode } = useStore(({ settings }) => settings);

    if (furiganaMode == "Romaji") return <>{kanaToRomaji(furigana)}</>;
    if (furiganaMode == "Hiragana") return <>{furigana}</>;

    const padding: number = (Math.abs(furigana.length - (children as string).length) * 6) / 2;
    return (
        <span style={{ position: "relative", padding: `0 ${padding}px`, whiteSpace: "nowrap" }}>
            <sup
                style={{
                    position: "absolute",
                    top: "-42%",
                    left: "0px",
                    fontSize: "45%",
                    width: "100%",
                    textAlign: "center",
                    opacity,
                }}
            >
                {furigana}
            </sup>
            <span>{children}</span>
        </span>
    );
};
