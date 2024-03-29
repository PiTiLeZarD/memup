import React, { useEffect, useState } from "react";

import { Grid, PaletteMode, Paper, Typography } from "@mui/material";
import { blue, lightBlue, lightGreen, orange } from "@mui/material/colors";

import { randomiseDeck } from "../lib";
import { Mem } from "../Mem";
import { MemAnswer, MemScore, MemType, useStore } from "../store";

const backgroundColour = (
    mode: PaletteMode,
    correctId: string,
    currentId: string,
    selectedId: string | null
): string => {
    const basic = mode == "light" ? lightBlue[50] : blue[900];
    if (!selectedId) return basic;

    if (selectedId == correctId) {
        if (currentId == selectedId) return lightGreen[500];
        return basic;
    }

    if (currentId == selectedId) return orange[500];
    if (currentId == correctId) return lightBlue[300];
    return basic;
};

export type QuizzProps = {
    answer: (answer: MemAnswer) => void;
    mem: MemType;
    timesup: boolean;
    memory: MemScore["memory"];
};

const getAllMems = (mem: MemType, learnContext: MemType[], mems: MemType[]): MemType[] => {
    if (learnContext.length > 20) return learnContext;
    const memsInFolders = mems.filter((m) => m.folders.filter((f) => mem.folders.includes(f)).length > 0);
    return memsInFolders.length > 20 ? memsInFolders : mems;
};

export type QuizzComponent = React.FunctionComponent<QuizzProps>;

export const Quizz: QuizzComponent = ({ mem, answer, timesup, memory }): JSX.Element => {
    const allMems = useStore(({ learnContext, mems }) => getAllMems(mem, learnContext, mems));
    const [options, setOptions] = useState<MemType[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const { displayMode } = useStore(({ settings }) => settings);

    useEffect(() => {
        const count = mem.checks.filter((c) => c.success).length > 0 ? 9 : 3;
        let newOptions = randomiseDeck(allMems.filter((m) => m.id != mem.id)).slice(0, count - 1);
        newOptions.push(mem);
        setOptions(randomiseDeck(newOptions));
        setSelectedAnswer(null);
    }, [mem.id]);

    useEffect(() => {
        if (timesup && selectedAnswer === null) {
            setSelectedAnswer("timesup");
            answer({ success: false });
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
        <Grid container spacing={1}>
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
                            background: backgroundColour(displayMode, mem.id, m.id, selectedAnswer),
                            "&:hover": selectedAnswer
                                ? {}
                                : { backgroundColor: orange[displayMode == "light" ? 50 : 900] },
                        }}
                        onClick={handleAnswer(m.id)}
                    >
                        {memory == "ST" && <Typography variant="h6">{m.description}</Typography>}
                        {memory == "LT" && <Mem variant="h4" mem={m} />}
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};
