import React, { useEffect, useState } from "react";

import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { lightBlue, lightGreen, orange } from "@mui/material/colors";

import { randomiseDeck } from "../lib";
import { MemType, useStore } from "../store";

const backgroundColour = (correctId: string, currentId: string, selectedId: string | null): string => {
    if (!selectedId) return "white";

    if (selectedId == correctId) {
        if (currentId == selectedId) return lightGreen[500];
        return "white";
    }

    if (currentId == selectedId) return orange[500];
    if (currentId == correctId) return lightBlue[500];
    return "white";
};

export type QuizzProps = {
    nextMem: () => void;
    mem: MemType;
};

export type QuizzComponent = React.FunctionComponent<QuizzProps>;

export const Quizz: QuizzComponent = ({ mem, nextMem }): JSX.Element => {
    const allMems = useStore(({ mems }) => mems);
    const [options, setOptions] = useState<MemType[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    useEffect(() => {
        let newOptions = randomiseDeck(allMems.filter((m) => m.id != mem.id)).slice(0, 8);
        newOptions.push(mem);
        setOptions(randomiseDeck(newOptions));
    }, [mem.id]);

    const handleAnswer = (answerId: string) => () => {
        if (selectedAnswer == null) {
            setSelectedAnswer(answerId);
        }
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        nextMem();
    };

    return (
        <>
            <Grid container spacing={4}>
                {options.map((m) => (
                    <Grid item xs={4} key={m.id}>
                        <Paper
                            elevation={4}
                            sx={{
                                padding: "2em 1em",
                                borderRadius: "10px",
                                cursor: "pointer",
                                background: backgroundColour(mem.id, m.id, selectedAnswer),
                                "&:hover": selectedAnswer ? {} : { backgroundColor: orange[50] },
                            }}
                            onClick={handleAnswer(m.id)}
                        >
                            <Typography variant="h6">{m.description}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {selectedAnswer && (
                <>
                    <Divider />
                    <Box sx={{ textAlign: "center" }}>
                        <Button variant="contained" onClick={handleNext}>
                            Next
                        </Button>
                    </Box>
                </>
            )}
        </>
    );
};
