import React, { useState } from "react";

import { Box, Divider, Grid, Stack, Typography } from "@mui/material";

import { memScore } from "../lib";
import { Mem } from "../Mem";
import { MemType } from "../store";
import { FlashCard } from "./FlashCard";
import { Quizz } from "./Quizz";

export type DeckBrowserProps = {
    mems: MemType[];
};

export type DeckBrowserComponent = React.FunctionComponent<DeckBrowserProps>;

export const DeckBrowser: DeckBrowserComponent = ({ mems }): JSX.Element => {
    if (mems.length == 0) return <Typography variant="h2">You're all caught up!</Typography>;

    const [currentMem, setCurrentMem] = useState<number>(0);
    const nextMem = () => {
        setCurrentMem(currentMem + 1);
    };
    const mem = mems[currentMem];
    const score = memScore(mem);

    return (
        <Grid container>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8}>
                <Box sx={{ padding: "2em" }}>
                    <Stack spacing={6} sx={{ textAlign: "center" }}>
                        <Typography variant="h5">
                            {currentMem + 1} / {mems.length}
                        </Typography>

                        <Mem mem={mem} variant="h2" />

                        <Divider />

                        {score.memory == "ST" && <Quizz nextMem={nextMem} mem={mem} />}
                        {score.memory == "LT" && <FlashCard nextMem={nextMem} mem={mem} />}
                    </Stack>
                </Box>
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );
};
