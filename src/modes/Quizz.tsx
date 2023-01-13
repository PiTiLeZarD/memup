import React, { useEffect, useState } from "react";

import { Grid, Paper, Typography } from "@mui/material";
import { lightBlue, lightGreen, orange } from "@mui/material/colors";

import { randomiseDeck } from "../lib";
import { Mem } from "../Mem";
import { FOLDER_SEP } from "../MemFolders";
import { MemAnswer, MemScore, MemType, useStore } from "../store";

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
    memory: MemScore["memory"];
};

const getAllMems = (mem: MemType, learnContext: MemType[], mems: MemType[]): MemType[] => {
    if (learnContext.length > 20) return learnContext;
    const memsInFolder = mems.filter((m) => m.folders.join(FOLDER_SEP) == mem.folders.join(FOLDER_SEP));
    if (memsInFolder.length > 20) return memsInFolder;
    return mems;
};

export type QuizzComponent = React.FunctionComponent<QuizzProps>;

export const Quizz: QuizzComponent = ({ mem, answer, timesup, memory }): JSX.Element => {
    const allMems = useStore(({ learnContext, mems }) => getAllMems(mem, learnContext, mems));
    const [options, setOptions] = useState<MemType[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    useEffect(() => {
        const count = mem.checks.filter((c) => c.success).length > 0 ? 9 : 3;
        let newOptions = randomiseDeck(allMems.filter((m) => m.id != mem.id)).slice(0, count - 1);
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
                        {memory == "ST" && <Typography variant="h6">{m.description}</Typography>}
                        {memory == "LT" && <Mem variant="h5" mem={m} />}
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};
