import React, { useState } from "react";

import { Box, Button, ButtonGroup, Divider, Typography } from "@mui/material";

import { MemType } from "../store";

export type FlashCardProps = {
    setScore: (success: boolean) => void;
    mem: MemType;
};

export type FlashCardComponent = React.FunctionComponent<FlashCardProps>;

export const FlashCard: FlashCardComponent = ({ setScore, mem }): JSX.Element => {
    const [showMe, setShowMe] = useState<boolean>(false);

    const handleClick = (show: boolean) => () => {
        setScore(!show);
        setShowMe(show);
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
                    {!showMe && (
                        <>
                            <Button color="warning" onClick={handleClick(true)}>
                                No Idea
                            </Button>
                            <Button color="primary" onClick={handleClick(true)}>
                                Show me
                            </Button>
                            <Button color="success" onClick={handleClick(false)}>
                                I know
                            </Button>
                        </>
                    )}
                </ButtonGroup>
            </Box>
        </>
    );
};
