import React from "react";

import { Grid, Typography } from "@mui/material";

import { Mem } from "./Mem";
import { MemType } from "./store";

export type MemListItemProps = {
    data: MemType;
};

export type MemListItemComponent = React.FunctionComponent<MemListItemProps>;

export const MemListItem: MemListItemComponent = ({ data: { mem, furigana, description } }): JSX.Element => {
    return (
        <Grid container>
            <Grid item xs={12} md={6}>
                <Mem mem={{ mem, furigana }} variant="h4" />
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h6">{description}</Typography>
            </Grid>
        </Grid>
    );
};
