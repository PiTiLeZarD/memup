import React, { useEffect, useState } from "react";
import { useCountdown } from "usehooks-ts";

import EditIcon from "@mui/icons-material/Edit";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MovingIcon from "@mui/icons-material/Moving";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { Alert, Box, Button, Divider, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import { useMemo } from "react";
import { Mem } from "../Mem";
import { MemFormDialog } from "../MemFormDialog";
import { levelGapMap, memScore } from "../lib";
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
    const [formOpen, setFormOpen] = useState<false | MemType>(false);

    const mem = mems[currentMem] || null;
    const score = useMemo(() => (mem ? memScore(mem) : null), [mem?.id]);

    const [scores, setScores] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
    const [currentScore, setCurrentScore] = useState<boolean | null>(null);
    const addAnswer = useStore(({ addAnswer }) => addAnswer);

    const { countdownSeconds, hideAndSeek } = useStore(({ settings }) => settings);
    const [seek, setSeek] = useState<boolean>(!hideAndSeek);
    const maxTime = countdownSeconds * (score && score.memory == "LT" ? 2 : 1);
    const [time, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
        countStart: maxTime,
        countStop: 0,
    });

    const inLevels = Object.keys(levelGapMap).includes(String(score?.level || 1));
    const titleDescription = score?.memory == "LT";

    useEffect(() => {
        resetCountdown();
        if (inLevels && seek) {
            startCountdown();
            return stopCountdown;
        }
    }, [currentMem, maxTime, seek]);

    useEffect(() => {
        setSeek(!hideAndSeek);
    }, [currentMem]);

    if (mems.length == 0) return <Typography variant="h2">You're all caught up!</Typography>;

    const handleNextMem = () => {
        resetCountdown();
        setCurrentScore(null);
        setCurrentMem(currentMem + 1);
    };

    const handleAnswer = (answer: MemAnswer | null) => {
        if (currentScore == null) {
            stopCountdown();
            if (answer != null) {
                setCurrentScore(answer.success);
                setScores({ up: scores.up + (answer.success ? 1 : 0), down: scores.down + (answer.success ? 0 : 1) });
                addAnswer(mem.id, { ...answer, time: maxTime - time, date: new Date() });
            } else {
                handleNextMem();
            }
        }
    };

    const handleTimerClick = () => {
        if (currentScore == null) {
            handleAnswer({ success: false });
        }
    };

    return (
        <>
            {" "}
            <MemFormDialog open={formOpen} setOpen={setFormOpen} />
            <Grid container>
                <Grid item xs={0} lg={2}></Grid>
                <Grid item xs={12} lg={8}>
                    <Box>
                        <Stack spacing={2}>
                            <Stack direction="row" alignItems="center" justifyContent="center">
                                <Alert severity="success" icon={<MovingIcon />}>
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
                                <Alert severity="error" icon={<TrendingDownIcon />}>
                                    {scores.down}
                                </Alert>
                            </Stack>

                            {mem && score && (
                                <>
                                    <Stack direction="row" spacing={4} alignItems="center" justifyContent="center">
                                        {!titleDescription && (
                                            <Mem mem={mem} variant="h2" sx={{ paddingTop: "0.5em" }} />
                                        )}
                                        {titleDescription && <Typography variant="h2">{mem.description}</Typography>}
                                        {mem.hint && (
                                            <Tooltip title={mem.hint}>
                                                <HelpOutlineIcon />
                                            </Tooltip>
                                        )}
                                    </Stack>

                                    {inLevels && <Timer time={time} maxTime={maxTime} onClick={handleTimerClick} />}

                                    {inLevels ? (
                                        <>
                                            {seek && (
                                                <Quizz
                                                    answer={handleAnswer}
                                                    mem={mem}
                                                    timesup={time == 0 || currentScore !== null}
                                                    memory={score.memory}
                                                />
                                            )}
                                            {!seek && (
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    onClick={(ev) => setSeek(true)}
                                                >
                                                    Pick your answer
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <FlashCard answer={handleAnswer} mem={mem} />
                                    )}
                                </>
                            )}

                            {!mem && <Typography variant="h3">Congrats, that was a nice sesh!</Typography>}

                            {currentScore !== null && (
                                <>
                                    <Divider />
                                    <Stack direction="row">
                                        <IconButton onClick={() => setFormOpen(mem)}>
                                            <EditIcon />
                                        </IconButton>

                                        <Button variant="contained" onClick={handleNextMem} fullWidth>
                                            Next
                                        </Button>
                                    </Stack>
                                </>
                            )}
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={0} lg={2}></Grid>
            </Grid>
        </>
    );
};
