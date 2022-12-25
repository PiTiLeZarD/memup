import React from "react";

import { Box, Divider, Grid, Paper, Stack, Typography } from "@mui/material";

export type QuizzPageProps = {};

export type QuizzPageComponent = React.FunctionComponent<QuizzPageProps>;

export const QuizzPage: QuizzPageComponent = (): JSX.Element => {
    return (
        <Grid container>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
                <Box sx={{ padding: "2em" }}>
                    <Stack spacing={4} sx={{ textAlign: "center" }}>
                        <Typography variant="h1">The word</Typography>
                        <Divider />
                        <Grid container spacing={4}>
                            {new Array(9).fill(null).map((_, i) => (
                                <Grid item xs={4} key={i}>
                                    <Paper elevation={4} sx={{ padding: "2em 1em", borderRadius: "10px" }}>
                                        <Typography variant="h4">This one?</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </Box>
            </Grid>
            <Grid item xs={2}></Grid>
        </Grid>
    );
};
