import React, { useEffect, useState } from "react";

import { Grid, Paper, Typography } from "@mui/material";
import { lightBlue, lightGreen, orange } from "@mui/material/colors";

import { randomiseDeck } from "../lib";
import { MemAnswer, MemType, useStore } from "../store";

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
    answer: (answer: MemAnswer) => void;
    mem: MemType;
    timesup: boolean;
};

export type QuizzComponent = React.FunctionComponent<QuizzProps>;

export const Quizz: QuizzComponent = ({ mem, answer, timesup }): JSX.Element => {
    const allMems = useStore(({ learnContext, mems }) => (learnContext.length ? learnContext : mems));
    const [options, setOptions] = useState<MemType[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    useEffect(() => {
        let newOptions = randomiseDeck(allMems.filter((m) => m.id != mem.id)).slice(0, 8);
        newOptions.push(mem);
        setOptions(randomiseDeck(newOptions));
        setSelectedAnswer(null);
    }, [mem.id]);

    useEffect(() => {
        if (timesup) {
            answer({ success: false });
            setSelectedAnswer("timesup");
        }
    }, [timesup]);

    const handleAnswer = (answerId: string) => () => {
        if (selectedAnswer == null) {
            if (answerId == mem.id) {
                answer({ success: true });
            } else {
                answer({ success: false, selected: answerId });
            }
            setSelectedAnswer(answerId);
        }
    };

    return (
        <Grid container spacing={2}>
            {options.map((m) => (
                <Grid item xs={4} key={m.id}>
                    <Paper
                        elevation={4}
                        sx={{
                            padding: "2em 1em",
                            marginRight: 2,
                            marginBottom: 2,
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
    );
};
