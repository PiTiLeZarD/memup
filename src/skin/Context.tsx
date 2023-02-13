import React, { useEffect } from "react";

import { PaletteMode, useMediaQuery } from "@mui/material";

type ThemeContextProps = {
    mode: PaletteMode;
    setMode: (mode: PaletteMode) => void;
};
export const ThemeContext = React.createContext<ThemeContextProps>({
    mode: "light",
    setMode: () => {},
});

type ThemeContextProviderProps = {
    forceMode?: PaletteMode;
};
type ThemeContextProviderComponent = React.FunctionComponent<React.PropsWithChildren<ThemeContextProviderProps>>;

export const ThemeContextProvider: ThemeContextProviderComponent = ({ forceMode, children }): JSX.Element => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [mode, setMode] = React.useState<PaletteMode>(forceMode ? forceMode : prefersDarkMode ? "dark" : "light");
    const defaultValue = { mode, setMode };

    useEffect(() => {
        setMode(forceMode);
    }, [forceMode]);

    return <ThemeContext.Provider value={defaultValue}>{children}</ThemeContext.Provider>;
};
