import React from "react";

import {
    CssBaseline,
    PaletteMode,
    StyledEngineProvider,
    Theme,
    ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import { blue, lightBlue } from "@mui/material/colors";

import { ThemeContext, ThemeContextProvider } from "./Context";
import { Skin } from "./Skin";

type ThemeFunction = (mode: PaletteMode) => Theme;
type PassableTheme = ThemeFunction | Theme;

const ModeBasedThemeProvider = ({ muiTheme, children }) => {
    const { mode } = React.useContext(ThemeContext);

    const theme = typeof muiTheme == "function" ? (muiTheme as ThemeFunction)(mode) : muiTheme;
    return (
        <MuiThemeProvider theme={theme}>
            <style type="text/css">{`
                html, body {
                    background-color: ${mode == "light" ? lightBlue[100] : blue[900]}
                }
            `}</style>
            {children}
        </MuiThemeProvider>
    );
};

export type ThemeProviderProps = {
    theme?: PassableTheme;
    forceMode?: PaletteMode;
};

export type ThemeProviderComponent = React.FunctionComponent<React.PropsWithChildren<ThemeProviderProps>>;

export const ThemeProvider: ThemeProviderComponent = ({ forceMode, theme, children }): JSX.Element => {
    const muiTheme = theme || Skin;

    return (
        <StyledEngineProvider injectFirst>
            <CssBaseline />
            <ThemeContextProvider forceMode={forceMode}>
                <ModeBasedThemeProvider muiTheme={muiTheme}>{children}</ModeBasedThemeProvider>
            </ThemeContextProvider>
        </StyledEngineProvider>
    );
};
