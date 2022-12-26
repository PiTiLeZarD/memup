import React, { useState } from "react";

import { Box, Button, ButtonGroup, Divider, Grid, Stack, Typography } from "@mui/material";

import { Furigana } from "./Furigana";
import { memDeck, useStore } from "./store";

export type LearnPageProps = {};

export type LearnPageComponent = React.FunctionComponent<LearnPageProps>;

export const LearnPage: LearnPageComponent = (): JSX.Element => {
    const mems = memDeck(useStore(({ mems }) => mems));
    console.log(mems);

    const [currentMem, setCurrentMem] = useState<number>(0);

    if (mems.length == 0) {
        return <Typography variant="h4">You're all caught up!</Typography>;
    }

    const { mem, furigana } = mems[currentMem];
    return (
        <Grid container>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
                <Box sx={{ padding: "2em" }}>
                    <Stack spacing={4} sx={{ textAlign: "center" }}>
                        <Typography variant="h1">
                            {(furigana || []).length ? <Furigana furigana={furigana as string[]}>{mem}</Furigana> : mem}
                        </Typography>
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
