import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import { Mem } from "./Mem";
import { useStore } from "./store";

export type AppProps = {};

export type AppComponent = React.FunctionComponent<AppProps>;

export const App: AppComponent = (): JSX.Element => {
    const mems = useStore(({ mems }) => mems);
    const [addOpen, setAddOpen] = useState<boolean>(false);
    return (
        <div>
            <Button onClick={() => setAddOpen(true)}>Add a mem</Button>
            <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
                <DialogTitle>Add a mem</DialogTitle>
                <DialogContent>Test</DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            {mems.map((mem) => (
                <Mem data={mem} />
            ))}
        </div>
    );
};
