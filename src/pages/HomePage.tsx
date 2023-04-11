import React from "react";
import { useNavigate } from "react-router-dom";
import { useInterval } from "usehooks-ts";

import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import SchoolIcon from "@mui/icons-material/School";
import { Box, Button, Stack } from "@mui/material";

import { EmptyMems } from "../EmptyMems";
import { HeatMap } from "../HeatMap";
import { MemClusters } from "../MemClusters";
import { memDeck } from "../lib";
import { useStore } from "../store";
import { useForceRender } from "../useForceRender";
import { ContentBox } from "./ContentBox";
import { DailyMems } from "./DailyMems";
import { ScoreButton } from "./buttons/ScoreButton";
import { SidebarButton } from "./buttons/SidebarButton";

export type HomePageProps = {};

export type HomePageComponent = React.FunctionComponent<HomePageProps>;

export const HomePage: HomePageComponent = (): JSX.Element => {
    const setLearnContext = useStore(({ setLearnContext }) => setLearnContext);
    const { learnNewCount } = useStore(({ settings }) => settings);
    const mems = useStore(({ mems }) => mems);
    const navigate = useNavigate();
    useInterval(useForceRender(), 60000);

    const reviseMems = memDeck(mems.filter((m) => !!m.checks.length));
    const learnMems = mems.filter((m) => !m.checks.length);

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
                <SidebarButton />
                <Stack spacing={6}>
                    <ScoreButton />
                    <Box sx={{ textAlign: "center" }}>
                        <Button
                            startIcon={<LocalLibraryIcon />}
                            size="large"
                            variant="contained"
                            color={reviseMems.length > 0 ? "primary" : "inherit"}
                            onClick={handleRevise}
                        >
                            {reviseMems.length > 0 ? `Revise ${reviseMems.length} mems` : "All caught up!"}
                        </Button>
                        <Button
                            startIcon={<SchoolIcon />}
                            size="large"
                            variant="contained"
                            color={learnMems.length > learnNewCount ? "primary" : "inherit"}
                            onClick={handleLearn}
                        >
                            {learnMems.length > learnNewCount
                                ? `Learn ${learnNewCount} new mems`
                                : learnMems.length > 0
                                ? "Not enough new mems!"
                                : "No new mems!"}
                        </Button>
                        {mems.length == 0 && <EmptyMems />}
                    </Box>
                    <MemClusters mems={mems} />
                </Stack>
            </ContentBox>
            <HeatMap />
            <DailyMems />
        </Stack>
    );
};
