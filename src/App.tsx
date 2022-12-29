import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import { Paper } from "@mui/material";
import { lightBlue } from "@mui/material/colors";

import { BackButton } from "./BackButton";
import { HomePage } from "./HomePage";
import { LearnPage } from "./LearnPage";
import { MemsPage } from "./MemsPage";

export type AppProps = {};

export type AppComponent = React.FunctionComponent<AppProps>;

export const App: AppComponent = (): JSX.Element => {
    return (
        <React.StrictMode>
            <style type="text/css">{`
                html, body {
                    background-color: ${lightBlue[100]}
                }
            `}</style>
            <HashRouter>
                <BackButton />
                <Paper
                    elevation={8}
                    sx={{
                        borderRadius: "25px",
                        padding: "2em",
                        margin: "2em",
                        border: `3px solid ${lightBlue[400]}`,
                    }}
                >
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/mems" element={<MemsPage />} />
                        <Route path="/learn" element={<LearnPage />} />
                    </Routes>
                </Paper>
            </HashRouter>
        </React.StrictMode>
    );
};
