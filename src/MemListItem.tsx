import React from "react";

import { Grid, Stack, Typography } from "@mui/material";

import { dateDiff, memScore, timeUntil } from "./lib";
import { Mem } from "./Mem";
import { MemsLinearProgress } from "./MemsLinearProgress";
import { MemType } from "./store";

export type MemListItemProps = {
    data: MemType;
    showDescription?: boolean;
};

export type MemListItemComponent = React.FunctionComponent<MemListItemProps>;

export const MemListItem: MemListItemComponent = ({ data, showDescription }): JSX.Element => {
    const { mem, furigana, description } = data;
    const score = memScore(data);

    return (
        <Grid container>
            <Grid item xs={12} md={8}>
                <Stack direction="row" spacing={4}>
                    <Mem mem={{ mem, furigana }} variant="h4" />
                    {showDescription ? <Typography>{description}</Typography> : <></>}
                </Stack>
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
