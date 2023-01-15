import React from "react";

import { Box, Paper, Stack, Typography } from "@mui/material";
import { lightBlue, orange, red } from "@mui/material/colors";

import { levelGapMap, memScore, ST_LT_THRESHOLD } from "./lib";
import { MemType } from "./store";

export type MemsLinearProgressProps = {
    mems: MemType[];
    label?: React.ReactNode;
};

export type MemsLinearProgressComponent = React.FunctionComponent<MemsLinearProgressProps>;

const barStyle = {
    float: "left",
    height: "2.5em",
    textAlign: "center",
    paddingTop: "3px",
};

export const MemsLinearProgress: MemsLinearProgressComponent = ({ mems, label }): JSX.Element => {
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
        <Box
            sx={{
                background: lightBlue[50],
                border: `1px solid ${lightBlue[900]}`,
                width: "100%",
                height: "2.5em",
                borderRadius: "10px",
                overflow: "hidden",
            }}
            component={Paper}
            elevation={2}
        >
            {Object.keys(stats).map((level) => (
                <Box
                    key={level}
                    sx={{
                        ...barStyle,
                        width: width(stats[parseInt(level)]),
                        background:
                            parseInt(level) > ST_LT_THRESHOLD
                                ? orange[(parseInt(level) - ST_LT_THRESHOLD) * 100]
                                : lightBlue[parseInt(level) * 100],
                    }}
                >
                    <Stack>
                        <Typography sx={{ lineHeight: "1em" }}>level {level}</Typography>
                        {label && <Typography>{label}</Typography>}
                        {!label && <Typography>{stats[parseInt(level)]} mems</Typography>}
                    </Stack>
                </Box>
            ))}
            {LT > 0 && (
                <Box
                    sx={{
                        ...barStyle,
                        width: width(LT),
                        background: red[500],
                    }}
                >
                    {LT} mems
                </Box>
            )}
        </Box>
    );
};
