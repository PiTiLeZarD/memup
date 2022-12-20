import React from "react";
import { Mem } from "./Mem";
import { useStore } from "./store";

export type AppProps = {};

export type AppComponent = React.FunctionComponent<AppProps>;

export const App: AppComponent = (): JSX.Element => {
    const mems = useStore(({ mems }) => mems);
    return (
        <div>
            {mems.map((mem) => (
                <Mem data={mem} />
            ))}
        </div>
    );
};
