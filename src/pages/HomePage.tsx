import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, ButtonGroup, Divider, Stack, TextField } from "@mui/material";

import { Typography } from "@mui/material";
import { ImportMemsDialog } from "../ImportMemsDialog";
import { Mem } from "../Mem";
import { useStore } from "../store";
import { ContentBox } from "./ContentBox";

const downloadAllMems = () =>
    Object.assign(document.createElement("a"), {
        href: `data:application/JSON, ${encodeURIComponent(JSON.stringify(localStorage.getItem("memup")))}`,
        download: "your_history",
    }).click();

export type HomePageProps = {};

export type HomePageComponent = React.FunctionComponent<HomePageProps>;

export const HomePage: HomePageComponent = (): JSX.Element => {
    const [importOpen, setImportOpen] = useState<boolean>(false);
    const settings = useStore(({ settings }) => settings);
    const set = useStore(({ set }) => set);
    const navigate = useNavigate();

    return (
        <>
            <ContentBox>
                <ImportMemsDialog open={importOpen} onClose={() => setImportOpen(false)} />
                <Box sx={{ textAlign: "center" }}>
                    <ButtonGroup variant="contained">
                        <Button onClick={() => navigate("/learn")}>Learn</Button>
                        <Divider orientation="vertical" flexItem />
                        <Button onClick={() => navigate("/mems")}>List Mems</Button>
                        <Divider orientation="vertical" flexItem />
                        <Button onClick={downloadAllMems}>Export Mems</Button>
                        <Button onClick={() => setImportOpen(true)}>Import Mems</Button>
                    </ButtonGroup>
                </Box>
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
                </Stack>
            </ContentBox>
        </>
    );
};
