import React, { useState } from "react";

import { DeckBrowser } from "./DeckBrowser";
import { memDeck } from "./lib";
import { MemType, useStore } from "./store";

export type LearnPageProps = {};

export type LearnPageComponent = React.FunctionComponent<LearnPageProps>;

export const LearnPage: LearnPageComponent = (): JSX.Element => {
    const [mems, _] = useState<MemType[]>(memDeck(useStore(({ mems }) => mems)));
    return <DeckBrowser mems={mems} />;
};
