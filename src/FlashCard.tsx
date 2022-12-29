import React, { useState } from "react";

import { Box, Button, ButtonGroup, Divider, Typography } from "@mui/material";

import { MemType } from "./store";

export type FlashCardProps = {
    nextMem: () => void;
    mem: MemType;
};

export type FlashCardComponent = React.FunctionComponent<FlashCardProps>;

export const FlashCard: FlashCardComponent = ({ nextMem, mem }): JSX.Element => {
    const [showMe, setShowMe] = useState<boolean>(false);

    const handleNext = () => {
        setShowMe(false);
        nextMem();
    };

    return (
        <>
            {showMe && (
                <>
                    <Typography>{mem.description}</Typography>
                    <Divider />
                </>
            )}

            <Box sx={{ textAlign: "center" }}>
                <ButtonGroup variant="contained" size="large">
                    {showMe && <Button onClick={handleNext}>Next</Button>}
                    {!showMe && (
                        <>
                            <Button color="warning" onClick={() => setShowMe(true)}>
                                No Idea
                            </Button>
                            <Button color="primary" onClick={() => setShowMe(true)}>
                                Show me
                            </Button>
                            <Button color="success" onClick={handleNext}>
                                I know
                            </Button>
                        </>
                    )}
                </ButtonGroup>
            </Box>
        </>
    );
};
