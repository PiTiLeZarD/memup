import React from "react";
import { useNavigate } from "react-router-dom";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import { levelGapMap, memDeck, ST_LT_THRESHOLD } from "../lib";
import { MemClusters } from "../MemClusters";
import { useStore } from "../store";
import { ContentBox } from "./ContentBox";

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
                            <Button onClick={() => navigate("/settings")}>Settings</Button>
                            <Button onClick={() => navigate("/importbackup")}>Import/Backup</Button>
                        </ButtonGroup>
                        {mems.length == 0 && (
                            <Typography sx={{ marginTop: "2em" }}>
                                Looks like you've got nothing in here, start by creating or importing mems.
                            </Typography>
                        )}
                    </Box>
                    <MemClusters mems={mems} />
                </Stack>
            </ContentBox>
            <ContentBox>
                <Stack spacing={2}>
                    <Typography variant="h4">What is this?</Typography>
                    <Typography>
                        This is memup, it's a tool designed to help you memorise anything in the form of{" "}
                        <b>
                            Mem <ArrowForwardIcon sx={{ marginBottom: "-0.3em" }} /> Definition
                        </b>
                        . As of now, it is geared towards learning Japanese but there is nothing preventing you from
                        learning anything with it.
                    </Typography>
                    <Typography variant="h4">How does it work?</Typography>
                    <Typography>
                        You will be quizzed on mems at different interval, the quizz will present you the mem, and you
                        will have to choose between different definitions within the deck. The system tries to be clever
                        about showing you the mems based on your previous answers. If you succeed, you will see mems
                        less and less frequently, if you fail, you'll see them more.
                    </Typography>
                    <Typography>
                        Your mems will be assigned a level, once you reached level {ST_LT_THRESHOLD + 1}, the mem will
                        switch to long term memory. Anytime you fail, you go right back to level 1.
                    </Typography>
                    <Typography>
                        Once in long term memory, you will be quizzed a different way, the definition will be presented
                        and you will have to chose which mem that is. The mems will be presented at different intervals
                        if you succeed, if you fail you get right back to level 1 but still in long term memory. If you
                        succeed {Object.keys(levelGapMap).length - ST_LT_THRESHOLD} times in a row, you will only see
                        flashcard every month.
                    </Typography>
                    <Typography>WIP: I haven't decided what to do if you fail the flashcards yet ;)</Typography>
                    <Typography variant="h4">How to get started?</Typography>
                    <Typography>
                        Start by adding mems, there is no requirements but if you want to have a better experience, add
                        more than 20. And keep adding to it.
                    </Typography>
                    <Typography>
                        If like me you're studying minnanonihongo N5, you can{" "}
                        <a
                            href="https://raw.githubusercontent.com/PiTiLeZarD/memup/master/content/Japanese_Minnanonihongo.json"
                            target="_blank"
                        >
                            download my file here
                        </a>{" "}
                        and import it using the import mems button up top, <b>WATCH OUT</b> for now importing a file
                        will delete all your current mems. I will work in making it more clever in the future.
                    </Typography>
                    <Typography variant="h4">Things to keep in mind</Typography>
                    <ul>
                        <Typography component="li">
                            I use the word fail but by using this tool, you never fail, you just learn.
                        </Typography>
                        <Typography component="li">
                            If you learn too many new mems at the same time, you might end up having days with a too
                            long list to handle. It's not an issue in itself but pace yourself and play the long game.
                        </Typography>
                        <Typography component="li">
                            This tool is new, it will evolve, if you want to contribute by either providing ideas or
                            pull requests or even money, just{" "}
                            <a href="https://github.com/PiTiLeZarD" target="_blank">
                                contact me on github
                            </a>{" "}
                            ;)
                        </Typography>
                        <Typography component="li">
                            <b>Import is destructive</b>, it will ruin your progress and pre-existing mems. It's meant
                            to be a backup feature but I'll update it soon.
                        </Typography>
                    </ul>
                    <Typography variant="h4">Glossary</Typography>
                    <Typography>A couple of definition to make things easier:</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Term</TableCell>
                                    <TableCell>Definition</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Mem</TableCell>
                                    <TableCell>The thing you're trying to memorise</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Deck</TableCell>
                                    <TableCell>A group of mems</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Fail</TableCell>
                                    <TableCell>The process of learning</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Quizz</TableCell>
                                    <TableCell>
                                        An interface presenting you with a part of a mem, and asking you to guess which
                                        is it in a selection within the deck
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Flashcard</TableCell>
                                    <TableCell>An interface asking you simply if you remember a mem.</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </ContentBox>
        </Stack>
    );
};
