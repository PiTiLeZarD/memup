import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import SchoolIcon from "@mui/icons-material/School";
import { Box, Button, Stack } from "@mui/material";

import { EmptyMems } from "../EmptyMems";
import { memDeck } from "../lib";
import { MemClusters } from "../MemClusters";
import { useStore } from "../store";
import { SidebarButton } from "./buttons/SidebarButton";
import { ContentBox } from "./ContentBox";
import { DailyMems } from "./DailyMems";

export type HomePageProps = {};

export type HomePageComponent = React.FunctionComponent<HomePageProps>;

export const HomePage: HomePageComponent = (): JSX.Element => {
    const setLearnContext = useStore(({ setLearnContext }) => setLearnContext);
    const { learnNewCount } = useStore(({ settings }) => settings);
    const mems = useStore(({ mems }) => mems);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("refresh") !== null) {
            navigate("/");
            window.location.reload();
        }
    }, [searchParams.get("refresh")]);

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
            <DailyMems />
        </Stack>
    );
};
