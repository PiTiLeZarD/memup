import React, { useEffect, useState } from "react";
import { useCountdown } from "usehooks-ts";

import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Alert, Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";

import { memScore } from "../lib";
import { Mem } from "../Mem";
import { MemAnswer, MemType, useStore } from "../store";
import { FlashCard } from "./FlashCard";
import { Quizz } from "./Quizz";
import { Timer } from "./Timer";

export type DeckBrowserProps = {
    mems: MemType[];
};

export type DeckBrowserComponent = React.FunctionComponent<DeckBrowserProps>;

export const DeckBrowser: DeckBrowserComponent = ({ mems }): JSX.Element => {
    const [currentMem, setCurrentMem] = useState<number>(0);
    const [scores, setScores] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
    const [currentScore, setCurrentScore] = useState<boolean | null>(null);

    const addAnswer = useStore(({ addAnswer }) => addAnswer);
    const { countdownSeconds } = useStore(({ settings }) => settings);
    const [time, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
        countStart: countdownSeconds,
        countStop: 0,
    });

    useEffect(() => {
        startCountdown();
        return stopCountdown;
    }, [currentMem]);

    if (mems.length == 0) return <Typography variant="h2">You're all caught up!</Typography>;

    const mem = mems[currentMem] || null;
    const score = mem ? memScore(mem) : null;

    const handleNextMem = () => {
        resetCountdown();
        setCurrentScore(null);
        setCurrentMem(currentMem + 1);
    };

    const handleAnswer = (answer: MemAnswer) => {
        stopCountdown();
        setCurrentScore(answer.success);
        setScores({ up: scores.up + (answer.success ? 1 : 0), down: scores.down + (answer.success ? 0 : 1) });
        addAnswer(mem.id, { ...answer, time: countdownSeconds - time, date: new Date() });
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
                                {mem ? (
                                    <>
                                        {currentMem + 1} / {mems.length}
                                    </>
                                ) : (
                                    "Done!"
                                )}
                            </Typography>
                            <Alert severity="error" icon={<ThumbDownIcon />}>
                                {scores.down}
                            </Alert>
                        </Stack>

                        {mem && score && (
                            <>
                                <Mem mem={mem} variant="h2" />

                                <Timer time={time} />

                                {score.memory == "ST" && <Quizz answer={handleAnswer} mem={mem} timesup={time == 0} />}
                                {score.memory == "LT" && (
                                    <FlashCard answer={handleAnswer} mem={mem} timesup={time == 0} />
                                )}
                            </>
                        )}

                        {!mem && <Typography variant="h3">Congrats, that was a nice sesh!</Typography>}

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