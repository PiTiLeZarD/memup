import React, { useEffect, useState } from "react";

import { Box, Button, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { orange } from "@mui/material/colors";

import { Furigana } from "./Furigana";
import { memDeck, randomiseDeck } from "./lib";
import { MemType, useStore } from "./store";

const backgroundColour = (correctId: string, selectedId: string | null, currentId: string): string => {
    if (!selectedId) return "white";

    if (selectedId == correctId) {
        if (currentId == selectedId) return "lightgreen";
        return "white";
    }

    if (currentId == selectedId) return "orange";
    if (currentId == correctId) return "lightblue";
    return "white";
};

export type QuizzPageProps = {};

export type QuizzPageComponent = React.FunctionComponent<QuizzPageProps>;

export const QuizzPage: QuizzPageComponent = (): JSX.Element => {
    const allMems = useStore(({ mems }) => mems);
    const [mems, _] = useState<MemType[]>(memDeck(allMems));
    const [currentMem, setCurrentMem] = useState<number>(0);
    const [options, setOptions] = useState<MemType[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    useEffect(() => {
        let newOptions = randomiseDeck(allMems.filter((mem) => mem.id != mems[currentMem].id)).slice(0, 8);
        newOptions.push(mems[currentMem]);
        setOptions(randomiseDeck(newOptions));
    }, [currentMem]);

    const { id, mem, furigana } = mems[currentMem];

    const handleAnswer = (answerId: string) => () => {
        if (selectedAnswer == null) {
            setSelectedAnswer(answerId);
        }
    };
    const nextMem = () => {
        setSelectedAnswer(null);
        setCurrentMem(currentMem + 1);
    };

    return (
        <Grid container>
            <Grid item xs={0} lg={2}></Grid>
            <Grid item xs={12} lg={8}>
                <Box sx={{ padding: "2em" }}>
                    <Stack spacing={6} sx={{ textAlign: "center" }}>
                        <Typography variant="h5">
                            {currentMem + 1} / {mems.length}
                        </Typography>

                        <Typography variant="h2">
                            {(furigana || []).length ? <Furigana furigana={furigana as string[]}>{mem}</Furigana> : mem}
                        </Typography>
                        <Divider />
                        <Grid container spacing={4}>
                            {options.map((mem) => (
                                <Grid item xs={4} key={mem.id}>
                                    <Paper
                                        elevation={4}
                                        sx={{
                                            padding: "2em 1em",
                                            borderRadius: "10px",
                                            cursor: "pointer",
                                            background: backgroundColour(id, selectedAnswer, mem.id),
                                            "&:hover": { backgroundColor: orange[50] },
                                        }}
                                        onClick={handleAnswer(mem.id)}
                                    >
                                        <Typography variant="h6">{mem.description}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        {selectedAnswer && (
                            <>
                                <Divider />
                                <Box sx={{ textAlign: "center" }}>
                                    <Button variant="contained" onClick={nextMem}>
                                        Next
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Stack>
                </Box>
            </Grid>
            <Grid item xs={0} lg={8}></Grid>
        </Grid>
    );
};
