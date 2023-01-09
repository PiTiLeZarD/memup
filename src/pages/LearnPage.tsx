import React, { useState } from "react";

import { memDeck } from "../lib";
import { DeckBrowser } from "../modes/DeckBrowser";
import { MemType, useStore } from "../store";
import { ContentBox } from "./ContentBox";
import { HomeButton } from "./HomeButton";

export type LearnPageProps = {};

export type LearnPageComponent = React.FunctionComponent<LearnPageProps>;

export const LearnPage: LearnPageComponent = (): JSX.Element => {
    const [mems, _] = useState<MemType[]>(
        memDeck(useStore(({ learnContext, mems }) => (learnContext.length ? learnContext : mems)))
    );
    return (
        <ContentBox>
            <HomeButton />
            <DeckBrowser mems={mems} />
        </ContentBox>
    );
};
