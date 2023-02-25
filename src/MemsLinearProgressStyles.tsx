import { Theme } from "@mui/material";
import { green, lightBlue, orange } from "@mui/material/colors";
import { makeStyles } from "./classes";
import { levelGapMap, ST_LT_THRESHOLD } from "./lib";

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: lightBlue[50],
        border: `1px solid ${lightBlue[900]}`,
        width: "100%",
        height: "2.5em",
        borderRadius: "10px",
        overflow: "hidden",
    },
    bar: {
        float: "left",
        height: "2.5em",
        textAlign: "center",
        paddingTop: "3px",
        lineHeight: "1.1em",
    },
    bar_LT: {
        background: green[200],
    },
    ...Object.fromEntries(
        new Array(Object.keys(levelGapMap).length).fill(null).map((_, level) => [
            `bar_L${level + 1}`,
            {
                background:
                    level + 1 > ST_LT_THRESHOLD
                        ? orange[(level + 1 - ST_LT_THRESHOLD) * 100]
                        : lightBlue[(level + 1) * 100],
            },
        ])
    ),
}));
