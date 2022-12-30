import React from "react";
import { HashRouter } from "react-router-dom";

import { lightBlue } from "@mui/material/colors";

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
                <Routes />
            </HashRouter>
        </React.StrictMode>
    );
};
