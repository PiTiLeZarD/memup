import * as hd from "humanize-duration";
import React from "react";

import { Grid, Typography } from "@mui/material";

import { memScore } from "./lib";
import { Mem } from "./Mem";
import { MemsLinearProgress } from "./MemsLinearProgress";
import { MemType } from "./store";

export type MemListItemProps = {
    data: MemType;
};

export type MemListItemComponent = React.FunctionComponent<MemListItemProps>;

export const MemListItem: MemListItemComponent = ({ data }): JSX.Element => {
    const { mem, furigana } = data;
    const score = memScore(data);
    const availableIn: number = (score.nextCheck as any) - (new Date() as any);
    return (
        <Grid container>
            <Grid item xs={12} md={8}>
                <Mem mem={{ mem, furigana }} variant="h4" />
            </Grid>
            <Grid item xs={12} md={4}>
                <MemsLinearProgress
                    mems={[data]}
                    label={
                        availableIn > 0 ? (
                            <Typography>
                                Available in: {hd(availableIn, { units: ["d", "h", "m"], round: true })}
                            </Typography>
                        ) : (
                            <Typography>Available now!</Typography>
                        )
                    }
                />
            </Grid>
        </Grid>
    );
};
