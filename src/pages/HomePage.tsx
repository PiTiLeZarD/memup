import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, ButtonGroup, Divider, LinearProgress, Stack, TextField, Typography } from "@mui/material";

import { ImportMemsDialog } from "../ImportMemsDialog";
import { memDeck } from "../lib";
import { Mem } from "../Mem";
import { useStore } from "../store";
import { ContentBox } from "./ContentBox";

const downloadAllMems = () =>
    Object.assign(document.createElement("a"), {
        href: `data:application/JSON, ${encodeURIComponent(JSON.stringify(localStorage.getItem("memup")))}`,
        download: "your_history",
    }).click();

const storageSpaceUsed = () => {
    const used = Object.entries(localStorage)
        .map(([key, val]) => (val.length + key.length) * 2)
        .reduce((a, l) => a + l, 0);
    return (used / (50 * 1024 * 1024)) * 100;
};

export type HomePageProps = {};

export type HomePageComponent = React.FunctionComponent<HomePageProps>;

export const HomePage: HomePageComponent = (): JSX.Element => {
    const [importOpen, setImportOpen] = useState<boolean>(false);
    const settings = useStore(({ settings }) => settings);
    const set = useStore(({ set }) => set);
    const setLearnContext = useStore(({ setLearnContext }) => setLearnContext);
    const memsAvailable = memDeck(useStore(({ mems }) => mems)).length;

    const navigate = useNavigate();

    const handleLearn = () => {
        setLearnContext([]);
        navigate("/learn");
    };

    return (
        <Stack>
            <ContentBox>
                <ImportMemsDialog open={importOpen} onClose={() => setImportOpen(false)} />

                <Stack>
                    {memsAvailable > 0 && (
                        <Typography variant="h6" sx={{ textAlign: "center" }}>
                            {memsAvailable} mems for you to review
                        </Typography>
                    )}
                    <Box sx={{ textAlign: "center" }}>
                        <ButtonGroup variant="contained">
                            <Button color={memsAvailable > 0 ? "primary" : "inherit"} onClick={handleLearn}>
                                Learn
                            </Button>
                            <Divider orientation="vertical" flexItem />
                            <Button onClick={() => navigate("/mems")}>List Mems</Button>
                            <Divider orientation="vertical" flexItem />
                            <Button onClick={downloadAllMems}>Backup Progress</Button>
                            <Button onClick={() => setImportOpen(true)}>Import Mems</Button>
                        </ButtonGroup>
                    </Box>
                </Stack>
            </ContentBox>
            <ContentBox>
                <Stack spacing={4}>
                    <Typography variant="h3">Settings</Typography>
                    <Divider />
                    <Stack direction="row" spacing={4}>
                        <ButtonGroup variant="contained">
                            <Button
                                color={settings.furiganaMode == "Romaji" ? "primary" : "inherit"}
                                onClick={() => set({ furiganaMode: "Romaji" })}
                            >
                                Romaji
                            </Button>
                            <Button
                                color={settings.furiganaMode == "Hiragana" ? "primary" : "inherit"}
                                onClick={() => set({ furiganaMode: "Hiragana" })}
                            >
                                Hiragana
                            </Button>
                            <Button
                                color={settings.furiganaMode == "Furigana" ? "primary" : "inherit"}
                                onClick={() => set({ furiganaMode: "Furigana" })}
                            >
                                Furigana
                            </Button>
                            <Button
                                color={settings.furiganaMode == "Kanji" ? "primary" : "inherit"}
                                onClick={() => set({ furiganaMode: "Kanji" })}
                            >
                                Kanji
                            </Button>
                        </ButtonGroup>
                        <Typography>Example: </Typography>
                        <Mem variant="h4" mem={{ mem: "皆さん", furigana: ["みな"] }} />
                    </Stack>
                    <TextField
                        label="Countdown in s"
                        value={settings.countdownSeconds}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        onChange={(ev) => set({ countdownSeconds: parseInt(ev.target.value) })}
                    />
                    <Divider />
                    <Typography variant="h6">Storage used:</Typography>
                    <LinearProgress
                        color="error"
                        variant="determinate"
                        sx={{ height: "2em" }}
                        value={storageSpaceUsed()}
                    />
                </Stack>
            </ContentBox>
        </Stack>
    );
};
