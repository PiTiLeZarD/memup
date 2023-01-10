import React, { useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import ErrorIcon from "@mui/icons-material/Error";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormLabel,
    ListItem,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import { HiraganaTextField } from "../HiraganaTextField";
import { isKanji, splitByKanji } from "../lib";
import { Furigana } from "./Furigana";

export type FuriganaInputProps = {
    memValue: string;
    furigana: string[];
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
};

export type FuriganaInputComponent = React.FunctionComponent<FuriganaInputProps>;

export const FuriganaInput: FuriganaInputComponent = ({ memValue, furigana, register, setValue }): JSX.Element => {
    const [kanjiGroups, setKanjiGroups] = useState<string[][]>(
        splitByKanji(memValue)
            .filter((s) => isKanji(s[0]))
            .map((k, i) => [k, furigana[i] || ""])
    );
    const [open, setOpen] = useState<false | number>(false);
    const [furiganaValue, setFuriganaValue] = useState<string>("");

    const handleFuriganaSave = () => {
        const newGroups = [...kanjiGroups];
        newGroups[open as number][1] = furiganaValue;
        setKanjiGroups(newGroups);
        setOpen(false);
        setValue("furigana", JSON.stringify(newGroups.map(([k, f]) => f)));
    };

    const handleKeyDown = (ev) => {
        if (ev.keyCode == 13) {
            handleFuriganaSave();
        }
    };

    return (
        <div>
            <Dialog open={open !== false}>
                <DialogTitle>Set Furigana</DialogTitle>
                <DialogContent>
                    {open !== false && (
                        <Stack spacing={2}>
                            <Typography variant="h4">{kanjiGroups[open][0]}</Typography>
                            <HiraganaTextField
                                label="Furigana"
                                value={furiganaValue}
                                onKeyDown={handleKeyDown}
                                onChange={(ev) => setFuriganaValue(ev.target.value)}
                            />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleFuriganaSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <FormLabel>Furigana:</FormLabel>

            <Paper
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    listStyle: "none",
                    p: 0.5,
                    m: 0,
                }}
                component="ul"
            >
                {kanjiGroups.map(([kanji, furigana], i) => (
                    <ListItem key={i} sx={{ display: "inline", width: "auto" }}>
                        <Chip
                            label={kanji}
                            color={!!furigana ? "default" : "error"}
                            icon={!!furigana ? undefined : <ErrorIcon />}
                            onClick={() => {
                                setFuriganaValue(furigana);
                                setOpen(i);
                            }}
                        />
                    </ListItem>
                ))}
            </Paper>
            <Box sx={{ marginTop: "1.5em", textAlign: "center" }}>
                <Typography variant="h4">
                    <Furigana furigana={kanjiGroups.map(([k, f]) => f || "")}>{memValue}</Furigana>
                </Typography>
            </Box>
            <input type="hidden" {...register("furigana")} />
        </div>
    );
};
