import React from "react";

import { Grid, Typography } from "@mui/material";

import { dateDiff, memScore, timeUntil } from "./lib";
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

    return (
        <Grid container>
            <Grid item xs={12} md={8}>
                <Mem mem={{ mem, furigana }} variant="h4" />
            </Grid>
            <Grid item xs={12} md={4}>
                <MemsLinearProgress
                    mems={[data]}
                    label={
                        -dateDiff(score.nextCheck) > 0 ? (
                            <Typography>Available in: {timeUntil(score.nextCheck)}</Typography>
                        ) : (
                            <Typography>Available now!</Typography>
                        )
                    }
                />
            </Grid>
        </Grid>
    );
};
