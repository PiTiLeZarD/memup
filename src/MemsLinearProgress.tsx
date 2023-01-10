import React from "react";

import { Box, Paper } from "@mui/material";
import { lightBlue, orange } from "@mui/material/colors";

import { memScore } from "./lib";
import { MemType } from "./store";

export type MemsLinearProgressProps = {
    mems: MemType[];
};

export type MemsLinearProgressComponent = React.FunctionComponent<MemsLinearProgressProps>;

const barStyle = {
    float: "left",
    height: "2.5em",
    textAlign: "center",
    paddingTop: "3px",
};

export const MemsLinearProgress: MemsLinearProgressComponent = ({ mems }): JSX.Element => {
    const stats = mems.reduce((acc, m: MemType) => {
        if ((m.checks || []).length == 0) return { ...acc, [0]: (acc[0] || 0) + 1 };
        const score = memScore(m);
        if (score.memory == "ST") return { ...acc, [score.level as number]: (acc[score.level as number] || 0) + 1 };
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
            {LT > 0 && (
                <Box
                    sx={{
                        ...barStyle,
                        width: width(LT),
                        background: orange[500],
                    }}
                >
                    {LT} mems
                </Box>
            )}
            {Object.keys(stats).map((level) => (
                <Box
                    key={level}
                    sx={{
                        ...barStyle,
                        width: width(stats[parseInt(level)]),
                        background: lightBlue[parseInt(level) * 100],
                    }}
                >
                    level {level}
                    <br />
                    {stats[parseInt(level)]} mems
                </Box>
            ))}
        </Box>
    );
};
