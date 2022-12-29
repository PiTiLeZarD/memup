import React from "react";
import { HashRouter } from "react-router-dom";

import { Paper } from "@mui/material";
import { lightBlue } from "@mui/material/colors";

import { BackButton } from "./pages/BackButton";
import { Routes } from "./pages/Routes";

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
                <Paper
                    elevation={8}
                    sx={{
                        position: "relative",
                        borderRadius: "25px",
                        padding: "2em",
                        margin: "2em",
                        border: `3px solid ${lightBlue[400]}`,
                    }}
                >
                    <BackButton />
                    <Routes />
                </Paper>
            </HashRouter>
        </React.StrictMode>
    );
};
