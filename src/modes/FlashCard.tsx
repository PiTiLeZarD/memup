import React, { useEffect, useState } from "react";

import { Box, Button, ButtonGroup, Divider, Typography } from "@mui/material";

import { MemAnswer, MemType } from "../store";

export type FlashCardProps = {
    answer: (answer: MemAnswer) => void;
    mem: MemType;
    timesup: boolean;
};

export type FlashCardComponent = React.FunctionComponent<FlashCardProps>;

export const FlashCard: FlashCardComponent = ({ answer, mem, timesup }): JSX.Element => {
    const [showMe, setShowMe] = useState<boolean>(false);

    const handleClick = (show: boolean) => () => {
        answer({ success: !show });
        setShowMe(show);
    };

    useEffect(() => {
        setShowMe(timesup);
    }, [timesup]);

    return (
        <>
            {showMe && (
                <>
                    <Divider />
                    <Typography>{mem.description}</Typography>
                </>
            )}

            {!showMe && (
                <>
                    <Divider />
                    <Box sx={{ textAlign: "center" }}>
                        <ButtonGroup variant="contained" size="large">
                            <Button color="warning" onClick={handleClick(true)}>
                                No Idea
                            </Button>
                            <Button color="primary" onClick={handleClick(true)}>
                                Show me
                            </Button>
                            <Button color="success" onClick={handleClick(false)}>
                                I know
                            </Button>
                        </ButtonGroup>
                    </Box>
                </>
            )}
        </>
    );
};
