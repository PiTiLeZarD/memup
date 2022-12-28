import React, { useState } from "react";

import { Box, Button, ButtonGroup, Divider, Grid, Stack, Typography } from "@mui/material";

import { Furigana } from "./Furigana";
import { memDeck, MemType, useStore } from "./store";

export type LearnPageProps = {};

export type LearnPageComponent = React.FunctionComponent<LearnPageProps>;

export const LearnPage: LearnPageComponent = (): JSX.Element => {
    const [mems, _] = useState<MemType[]>(memDeck(useStore(({ mems }) => mems)));
    const [currentMem, setCurrentMem] = useState<number>(0);
    const [showMe, setShowMe] = useState<boolean>(false);

    if (mems.length == 0) {
        return <Typography variant="h4">You're all caught up!</Typography>;
    }

    const nextMem = () => {
        setShowMe(false);
        setCurrentMem(currentMem + 1);
    };

    const { mem, furigana, description, hint } = mems[currentMem];
    return (
        <Grid container>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8}>
                <Box sx={{ padding: "2em" }}>
                    <Stack spacing={6} sx={{ textAlign: "center" }}>
                        <Typography variant="h5">
                            {currentMem + 1} / {mems.length}
                        </Typography>
                        <Typography variant="h2">
                            {(furigana || []).length ? <Furigana furigana={furigana as string[]}>{mem}</Furigana> : mem}
                        </Typography>
                        <Divider />
                        {showMe && (
                            <>
                                <Typography>{description}</Typography>
                                <Divider />
                            </>
                        )}
                        <Box sx={{ textAlign: "center" }}>
                            <ButtonGroup variant="contained" size="large">
                                {showMe && <Button onClick={nextMem}>Next</Button>}
                                {!showMe && (
                                    <>
                                        <Button color="warning" onClick={() => setShowMe(true)}>
                                            No Idea
                                        </Button>
                                        <Button color="primary" onClick={() => setShowMe(true)}>
                                            Show me
                                        </Button>
                                        <Button disabled={!hint}>Hint!</Button>
                                        <Button color="success" onClick={nextMem}>
                                            I know
                                        </Button>
                                    </>
                                )}
                            </ButtonGroup>
                        </Box>
                    </Stack>
                </Box>
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );
};
