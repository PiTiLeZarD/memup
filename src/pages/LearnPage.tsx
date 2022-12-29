import React, { useState } from "react";

import { memDeck } from "../lib";
import { DeckBrowser } from "../modes/DeckBrowser";
import { MemType, useStore } from "../store";

export type LearnPageProps = {};

export type LearnPageComponent = React.FunctionComponent<LearnPageProps>;

export const LearnPage: LearnPageComponent = (): JSX.Element => {
    const [mems, _] = useState<MemType[]>(memDeck(useStore(({ mems }) => mems)));
    return <DeckBrowser mems={mems} />;
};
