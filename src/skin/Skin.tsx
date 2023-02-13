import { createTheme, PaletteMode, unstable_createMuiStrictModeTheme } from "@mui/material";

const createThemeFunction =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development" ? unstable_createMuiStrictModeTheme : createTheme;

export const Skin = (mode: PaletteMode) => {
    return createThemeFunction({
        palette: {
            mode,
        },
    });
};
