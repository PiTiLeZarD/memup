import React from "react";

import { MemList } from "../MemList";
import { useStore } from "../store";
import { BackButton } from "./BackButton";
import { ContentBox } from "./ContentBox";

export type MemsPageProps = {};

export type MemsPageComponent = React.FunctionComponent<MemsPageProps>;

export const MemsPage: MemsPageComponent = (): JSX.Element => {
    const mems = useStore(({ mems }) => mems);
    return (
        <ContentBox>
            <BackButton />
            <MemList mems={mems} />
        </ContentBox>
    );
};
