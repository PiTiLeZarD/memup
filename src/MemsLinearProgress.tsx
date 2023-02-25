import React from "react";

import { Box, Paper } from "@mui/material";

import { useVariant } from "./classes";
import { levelGapMap, memScore } from "./lib";
import { useStyles } from "./MemsLinearProgressStyles";
import { MemType } from "./store";

export type MemsLinearProgressProps = {
    mems: MemType[];
    label?: React.ReactNode;
};

export type MemsLinearProgressComponent = React.FunctionComponent<MemsLinearProgressProps>;

export const MemsLinearProgress: MemsLinearProgressComponent = ({ mems, label }): JSX.Element => {
    const classes = useStyles();

    const stats = mems.reduce((acc, m: MemType) => {
        if ((m.checks || []).length == 0) return { ...acc, [0]: (acc[0] || 0) + 1 };
        const score = memScore(m);
        const inLevels = Object.keys(levelGapMap).includes(String(score?.level || 1));
        if (inLevels) return { ...acc, [score.level as number]: (acc[score.level as number] || 0) + 1 };
        return { ...acc, LT: (acc["LT"] || 0) + 1 };
    }, {});

    const LT = stats["LT"] || 0;
    if (LT > 0) delete stats["LT"];

    const width = (n: number) => `${(n / mems.length) * 100}%`;

    return (
        <Box sx={classes.root} component={Paper} elevation={2}>
            {Object.keys(stats).map((level) => (
                <Box
                    key={level}
                    sx={{
                        ...useVariant(classes, "bar", `L${level}`),
                        width: width(stats[parseInt(level)]),
                    }}
                >
                    level {level}
                    <br />
                    {label ? label : `${stats[parseInt(level)]} mems`}
                </Box>
            ))}
            {LT > 0 && (
                <Box
                    sx={{
                        ...useVariant(classes, "bar", "LT"),
                        width: width(LT),
                    }}
                >
                    long term memory
                    <br />
                    {label ? label : `${LT} mems`}
                </Box>
            )}
        </Box>
    );
};
