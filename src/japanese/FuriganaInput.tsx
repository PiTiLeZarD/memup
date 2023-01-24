import React, { useEffect, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import ErrorIcon from "@mui/icons-material/Error";
import { Box, Chip, FormLabel, ListItem, Paper, Typography } from "@mui/material";

import { DialogTextField } from "../DialogTextField";
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
    const getKanjiGroups = () =>
        splitByKanji(memValue)
            .filter((s) => isKanji(s[0]))
            .map((k, i) => [k, furigana[i] || ""]);
    const [kanjiGroups, setKanjiGroups] = useState<string[][]>(getKanjiGroups());
    const [open, setOpen] = useState<false | number>(false);
    const [furiganaValue, setFuriganaValue] = useState<string>("");

    useEffect(() => {
        setKanjiGroups(getKanjiGroups());
    }, [memValue, furigana]);

    const handleFuriganaSave = (cancel?: true) => {
        if (cancel) return setOpen(false);
        const newGroups = [...kanjiGroups];
        newGroups[open as number][1] = furiganaValue;
        setKanjiGroups(newGroups);
        setOpen(false);
        setValue("furigana", JSON.stringify(newGroups.map(([k, f]) => f)));
    };

    return (
        <div>
            <DialogTextField
                open={open !== false}
                title={open === false ? "" : `Set furigana for ${kanjiGroups[open as number][0]}`}
                label="Furigana"
                value={furiganaValue}
                onChange={setFuriganaValue}
                onSave={handleFuriganaSave}
                Component={HiraganaTextField}
            />

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
