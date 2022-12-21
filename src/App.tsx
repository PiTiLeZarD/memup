import { Button } from "@mui/material";
import React, { useState } from "react";
import { Mem } from "./Mem";
import { MemForm } from "./MemForm";
import { useStore } from "./store";

export type AppProps = {};

export type AppComponent = React.FunctionComponent<AppProps>;

export const App: AppComponent = (): JSX.Element => {
    const mems = useStore(({ mems }) => mems);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    return (
        <div>
            <Button onClick={() => setFormOpen(true)}>Add a mem</Button>
            <MemForm open={formOpen} onClose={() => setFormOpen(false)} />

            {mems.map((mem) => (
                <Mem data={mem} />
            ))}
        </div>
    );
};
