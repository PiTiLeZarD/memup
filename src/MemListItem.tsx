import * as hd from "humanize-duration";
import React from "react";

import { Grid, LinearProgress, Stack, Typography } from "@mui/material";

import { levelGapMap, memScore, ST_LT_THRESHOLD } from "./lib";
import { Mem } from "./Mem";
import { MemType } from "./store";

export type MemListItemProps = {
    data: MemType;
};

export type MemListItemComponent = React.FunctionComponent<MemListItemProps>;

export const MemListItem: MemListItemComponent = ({ data }): JSX.Element => {
    const { mem, furigana } = data;
    const score = memScore(data);
    const availableIn: number = (score.nextCheck as any) - (new Date() as any);
    const value =
        (score.memory == "ST"
            ? (score.level || 0) / ST_LT_THRESHOLD
            : ((score.level || ST_LT_THRESHOLD) - ST_LT_THRESHOLD) /
              (Object.keys(levelGapMap).length - ST_LT_THRESHOLD)) * 100;
    return (
        <Grid container>
            <Grid item xs={12} md={8}>
                <Mem mem={{ mem, furigana }} variant="h4" />
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack>
                    <LinearProgress
                        variant="determinate"
                        color={score.memory == "ST" ? "primary" : "error"}
                        value={value}
                    />
                    {availableIn > 0 && (
                        <Typography>
                            Available in: {hd(availableIn, { units: ["d", "h", "m"], round: true })}
                        </Typography>
                    )}
                    {availableIn <= 0 && <Typography>Available now!</Typography>}
                </Stack>
            </Grid>
        </Grid>
    );
};
