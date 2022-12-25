import React from "react";

import { Box, Button, ButtonGroup, Divider, Grid, Stack, Typography } from "@mui/material";

export type LearnPageProps = {};

export type LearnPageComponent = React.FunctionComponent<LearnPageProps>;

export const LearnPage: LearnPageComponent = (): JSX.Element => {
    return (
        <Grid container>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
                <Box sx={{ padding: "2em" }}>
                    <Stack spacing={4} sx={{ textAlign: "center" }}>
                        <Typography variant="h1">The word</Typography>
                        <Divider />
                        <Box sx={{ textAlign: "center" }}>
                            <ButtonGroup variant="contained" size="large">
                                <Button color="warning">No Idea</Button>
                                <Button>Hint!</Button>
                                <Button color="success">I know</Button>
                            </ButtonGroup>
                        </Box>
                    </Stack>
                </Box>
            </Grid>
            <Grid item xs={2}></Grid>
        </Grid>
    );
};
