import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, ButtonGroup, Divider, Stack } from "@mui/material";

import { EmptyMems } from "../EmptyMems";
import { memDeck } from "../lib";
import { MemClusters } from "../MemClusters";
import { useStore } from "../store";
import { ContentBox } from "./ContentBox";
import { DailyWords } from "./DailyWords";

export type HomePageProps = {};

export type HomePageComponent = React.FunctionComponent<HomePageProps>;

export const HomePage: HomePageComponent = (): JSX.Element => {
    const setLearnContext = useStore(({ setLearnContext }) => setLearnContext);
    const { learnNewCount } = useStore(({ settings }) => settings);
    const mems = useStore(({ mems }) => mems);
    const reviseMems = memDeck(mems.filter((m) => !!m.checks.length));
    const learnMems = mems.filter((m) => !m.checks.length);

    const navigate = useNavigate();

    const handleRevise = () => {
        if (reviseMems.length) {
            setLearnContext(reviseMems);
            navigate("/learn");
        }
    };

    const handleLearn = () => {
        if (learnMems.length) {
            setLearnContext(memDeck(learnMems).slice(0, learnNewCount));
            navigate("/learn");
        }
    };

    return (
        <Stack>
            <ContentBox>
                <Stack spacing={6}>
                    <Box sx={{ textAlign: "center" }}>
                        <ButtonGroup variant="contained">
                            <Button color={reviseMems.length > 0 ? "primary" : "inherit"} onClick={handleRevise}>
                                {reviseMems.length > 0 ? `Revise ${reviseMems.length} mems` : "All caught up!"}
                            </Button>
                            <Button
                                color={learnMems.length > learnNewCount ? "primary" : "inherit"}
                                onClick={handleLearn}
                            >
                                {learnMems.length > learnNewCount
                                    ? `Learn new mems`
                                    : learnMems.length > 0
                                    ? "Not enough new mems!"
                                    : "No new mems!"}
                            </Button>
                            <Divider orientation="vertical" flexItem />
                            <Button onClick={() => navigate("/mems")}>List Mems</Button>
                            <Divider orientation="vertical" flexItem />
                            <Button onClick={() => navigate("/about")}>About</Button>
                            <Button onClick={() => navigate("/settings")}>Settings</Button>
                            <Button onClick={() => navigate("/importbackup")}>Import/Backup</Button>
                        </ButtonGroup>
                        {mems.length == 0 && <EmptyMems />}
                    </Box>
                    <MemClusters mems={mems} />
                </Stack>
            </ContentBox>
            <DailyWords />
        </Stack>
    );
};
