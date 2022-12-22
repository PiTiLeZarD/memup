import React from "react";

import ErrorIcon from "@mui/icons-material/Error";
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ListItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { isKanji, splitByKanji } from "./lib";

export type FuriganaInputProps = {
    memValue: string;
    register: UseFormRegister<any>;
};

export type FuriganaInputComponent = React.FunctionComponent<FuriganaInputProps>;

export const FuriganaInput: FuriganaInputComponent = ({ memValue, register }): JSX.Element => {
    const [kanjiGroups, setKanjiGroups] = useState<string[][]>(
        splitByKanji(memValue)
            .filter((s) => isKanji(s[0]))
            .map((k) => [k, ""])
    );
    const [open, setOpen] = useState<false | number>(false);
    const [furiganaValue, setFuriganaValue] = useState<string>("");

    return (
        <>
            <Dialog open={open !== false}>
                <DialogTitle>Set Furigana</DialogTitle>
                <DialogContent>
                    {open !== false && (
                        <Stack spacing={2}>
                            <Typography variant="h4">{kanjiGroups[open][0]}</Typography>
                            <TextField
                                label="Furigana"
                                value={furiganaValue}
                                onChange={(ev) => setFuriganaValue(ev.target.value)}
                            />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
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
            <input type="hidden" {...register("furigana")} />
        </>
    );
};
