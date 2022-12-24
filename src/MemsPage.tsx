import React from "react";

import { MemList } from "./MemList";
import { useStore } from "./store";

export type MemsPageProps = {};

export type MemsPageComponent = React.FunctionComponent<MemsPageProps>;

export const MemsPage: MemsPageComponent = (): JSX.Element => {
    const mems = useStore(({ mems }) => mems);
    return <MemList mems={mems} />;
};
