import React, { useEffect, useState } from "react";
import * as stringSimilarity from "string-similarity";

import { Box, Button, Divider, LinearProgress } from "@mui/material";

import { HiraganaTextField } from "../HiraganaTextField";
import { hiraganaValue } from "../lib";
import { Mem } from "../Mem";
import { MemAnswer, MemType } from "../store";

export type FlashCardProps = {
    answer: (answer: MemAnswer) => void;
    mem: MemType;
};

export type FlashCardComponent = React.FunctionComponent<FlashCardProps>;

export const FlashCard: FlashCardComponent = ({ answer, mem }): JSX.Element => {
    const [value, setValue] = useState<string>("");
    const [showMe, setShowMe] = useState<boolean>(false);

    const similarity = stringSimilarity.compareTwoStrings(hiraganaValue(mem), value);

    const handleClick = (show: boolean) => () => {
        answer({ success: !show });
        setShowMe(show);
    };

    useEffect(() => {
        if (similarity == 1) {
            answer({ success: true });
            setShowMe(true);
        }
    }, [similarity]);

    return (
        <>
            {showMe && (
                <>
                    <Divider />
                    <Mem mem={mem} />
                </>
            )}

            {!showMe && (
                <>
                    <Divider />
                    <HiraganaTextField value={value} onChange={(ev) => setValue(ev.target.value)} />
                    <LinearProgress variant="determinate" value={100 * similarity} />
                    <Divider />
                    <Box sx={{ textAlign: "center" }}>
                        <Button variant="contained" size="large" onClick={handleClick(true)}>
                            No Idea
                        </Button>
                    </Box>
                </>
            )}
        </>
    );
};
