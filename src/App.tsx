import React from "react";
import { HashRouter } from "react-router-dom";

import { Routes } from "./pages/Routes";
import { ThemeProvider } from "./skin/ThemeProvider";
import { useStore } from "./store";

export type AppProps = {};

export type AppComponent = React.FunctionComponent<AppProps>;

export const App: AppComponent = (): JSX.Element => {
    const { displayMode } = useStore(({ settings }) => settings);
    return (
        <React.StrictMode>
            <ThemeProvider forceMode={displayMode}>
                <HashRouter>
                    <Routes />
                </HashRouter>
            </ThemeProvider>
        </React.StrictMode>
    );
};
