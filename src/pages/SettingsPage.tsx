import React from "react";

import { Box, Button, ButtonGroup, Divider, LinearProgress, Stack, TextField, Typography } from "@mui/material";

import { Mem } from "../Mem";
import { useStore } from "../store";
import { HomeButton } from "./buttons/HomeButton";
import { ContentBox } from "./ContentBox";

const storageSpaceUsed = () => {
    const used = Object.entries(localStorage)
        .map(([key, val]) => (val.length + key.length) * 2)
        .reduce((a, l) => a + l, 0);
    return (used / (50 * 1024 * 1024)) * 100;
};

export type SettingsPageProps = {};

export type SettingsPageComponent = React.FunctionComponent<SettingsPageProps>;

export const SettingsPage: SettingsPageComponent = (): JSX.Element => {
    const settings = useStore(({ settings }) => settings);
    const set = useStore(({ set }) => set);

    return (
        <ContentBox>
            <HomeButton />
            <Stack spacing={4}>
                <Typography variant="h3">Settings</Typography>
                <Divider />
                <Typography variant="h6">Display Mode</Typography>
                <ButtonGroup variant="contained" sx={{ width: "auto" }}>
                    <Button
                        color={settings.displayMode == "light" ? "primary" : "inherit"}
                        onClick={() => set({ displayMode: "light" })}
                    >
                        Light
                    </Button>
                    <Button
                        color={settings.displayMode == "dark" ? "primary" : "inherit"}
                        onClick={() => set({ displayMode: "dark" })}
                    >
                        Dark
                    </Button>
                </ButtonGroup>
                <Divider />
                <Typography variant="h6">Kanji display</Typography>
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
                <Divider />
                <Typography variant="h6">Kanji definition source</Typography>
                <ButtonGroup variant="contained" sx={{ width: "auto" }}>
                    <Button
                        color={settings.kanjiDefSource == "jisho.org" ? "primary" : "inherit"}
                        onClick={() => set({ kanjiDefSource: "jisho.org" })}
                    >
                        jisho.org
                    </Button>
                    <Button
                        color={settings.kanjiDefSource == "classic.jisho.org" ? "primary" : "inherit"}
                        onClick={() => set({ kanjiDefSource: "classic.jisho.org" })}
                    >
                        classic.jisho.org
                    </Button>
                </ButtonGroup>
                <Divider />
                <Stack direction="row" spacing={6}>
                    <Stack spacing={4} sx={{ flex: 1 }}>
                        <Typography variant="h6">Deckbrowser timeout</Typography>
                        <TextField
                            label="Countdown in s"
                            value={settings.countdownSeconds}
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                            onChange={(ev) => set({ countdownSeconds: parseInt(ev.target.value) })}
                        />
                    </Stack>
                    <Stack spacing={4} sx={{ flex: 1 }}>
                        <Typography variant="h6">Deckbrowser hideAndSeek</Typography>
                        <ButtonGroup variant="contained" sx={{ width: "auto" }}>
                            <Button
                                color={settings.hideAndSeek ? "primary" : "inherit"}
                                onClick={() => set({ hideAndSeek: true })}
                            >
                                On
                            </Button>
                            <Button
                                color={!settings.hideAndSeek ? "primary" : "inherit"}
                                onClick={() => set({ hideAndSeek: false })}
                            >
                                Off
                            </Button>
                        </ButtonGroup>
                        <Typography>
                            By selecting On here, the deckbrowser will hide the answers and hold the timer and let you
                            decide when to start it, it provides some thinking time and helps with not being biaised
                            with the displayed answers. It is however less dynamic ¯\_(ツ)_/¯
                        </Typography>
                    </Stack>
                </Stack>
                <Divider />
                <Typography variant="h6">Learn new mems</Typography>
                <TextField
                    label="Count"
                    value={settings.learnNewCount}
                    helperText="at a time"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    onChange={(ev) => set({ learnNewCount: parseInt(ev.target.value) })}
                />
                <Divider />
                <Typography variant="h6">Storage used:</Typography>
                <Box sx={{ position: "relative", width: "100%", height: "2em", textAlign: "center" }}>
                    <LinearProgress
                        color="error"
                        variant="determinate"
                        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "2em" }}
                        value={storageSpaceUsed()}
                    />
                    <Typography
                        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "2em", lineHeight: "2em" }}
                    >
                        {parseInt((storageSpaceUsed() * 100).toFixed()) / 100}% used
                    </Typography>
                </Box>
            </Stack>
        </ContentBox>
    );
};
