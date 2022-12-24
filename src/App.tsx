import React, { useState } from "react";

import { Button, ButtonGroup, Paper } from "@mui/material";
import { lightBlue } from "@mui/material/colors";

import { ImportMems } from "./ImportMems";
import { MemList } from "./MemList";
import { useStore } from "./store";

const downloadAllMems = () =>
    Object.assign(document.createElement("a"), {
        href: `data:application/JSON, ${encodeURIComponent(JSON.stringify(localStorage.getItem("memup")))}`,
        download: "your_history",
    }).click();

export type AppProps = {};

export type AppComponent = React.FunctionComponent<AppProps>;

export const App: AppComponent = (): JSX.Element => {
    const mems = useStore(({ mems }) => mems);
    const [importOpen, setImportOpen] = useState<boolean>(false);
    return (
        <>
            <style type="text/css">{`
                html, body {
                    background-color: ${lightBlue[100]}
                }
            `}</style>
            <Paper
                elevation={8}
                sx={{ borderRadius: "25px", padding: "2em", margin: "2em", border: `3px solid ${lightBlue[400]}` }}
            >
                <ButtonGroup variant="contained">
                    <Button onClick={downloadAllMems}>Export Mems</Button>
                    <Button onClick={() => setImportOpen(true)}>Import Mems</Button>
                </ButtonGroup>

                <ImportMems open={importOpen} onClose={() => setImportOpen(false)} />

                <MemList mems={mems} />
            </Paper>
        </>
    );
};
