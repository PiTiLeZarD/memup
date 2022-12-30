import React, { useState } from "react";

import { memDeck } from "../lib";
import { DeckBrowser } from "../modes/DeckBrowser";
import { MemType, useStore } from "../store";
import { BackButton } from "./BackButton";
import { ContentBox } from "./ContentBox";

export type LearnPageProps = {};

export type LearnPageComponent = React.FunctionComponent<LearnPageProps>;

export const LearnPage: LearnPageComponent = (): JSX.Element => {
    const [mems, _] = useState<MemType[]>(memDeck(useStore(({ mems }) => mems)));
    return (
        <ContentBox>
            <BackButton />
            <DeckBrowser mems={mems} />
        </ContentBox>
    );
};
