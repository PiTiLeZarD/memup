import React, { useState } from "react";

import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Alert, Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";

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
    const [scores, setScores] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
    const [currentScore, setCurrentScore] = useState<boolean | null>(null);

    const mem = mems[currentMem];
    const score = memScore(mem);

    const handleNextMem = () => {
        setCurrentScore(null);
        setCurrentMem(currentMem + 1);
    };

    const handleSetScore = (success: boolean) => {
        setCurrentScore(success);
        setScores({ up: scores.up + (success ? 1 : 0), down: scores.down + (success ? 0 : 1) });
    };

    return (
        <Grid container>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8}>
                <Box sx={{ padding: "2em" }}>
                    <Stack spacing={4} sx={{ textAlign: "center" }}>
                        <Stack direction="row" sx={{ width: "auto", margin: "auto" }}>
                            <Alert severity="success" icon={<ThumbUpIcon />}>
                                {scores.up}
                            </Alert>
                            <Typography variant="h5" sx={{ padding: "6px 2em" }}>
                                {currentMem + 1} / {mems.length}
                            </Typography>
                            <Alert severity="error" icon={<ThumbDownIcon />}>
                                {scores.down}
                            </Alert>
                        </Stack>

                        <Mem mem={mem} variant="h2" />

                        <Divider />

                        {score.memory == "ST" && <Quizz setScore={handleSetScore} mem={mem} />}
                        {score.memory == "LT" && <FlashCard setScore={handleSetScore} mem={mem} />}

                        {currentScore !== null && (
                            <>
                                <Divider />
                                <Button variant="contained" onClick={handleNextMem}>
                                    Next
                                </Button>
                            </>
                        )}
                    </Stack>
                </Box>
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );
};
