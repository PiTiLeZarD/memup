import React from "react";
import { memScore } from "../lib";

import { MemList } from "../MemList";
import { useStore } from "../store";
import { BackButton } from "./BackButton";
import { ContentBox } from "./ContentBox";

export type MemsPageProps = {};

export type MemsPageComponent = React.FunctionComponent<MemsPageProps>;

export const MemsPage: MemsPageComponent = (): JSX.Element => {
    const mems = useStore(({ mems }) => mems).sort(
        (ma, mb) => ((memScore(ma).nextCheck || new Date()) as any) - ((memScore(mb).nextCheck || new Date()) as any)
    );

    return (
        <ContentBox>
            <BackButton />
            <MemList mems={mems} />
        </ContentBox>
    );
};
