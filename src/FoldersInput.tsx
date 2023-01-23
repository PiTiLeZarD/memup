import React, { useState } from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

import AddIcon from "@mui/icons-material/Add";
import { Button, Chip, Divider, FormLabel, IconButton, ListItem, Paper, Stack } from "@mui/material";

import { DialogTextField } from "./DialogTextField";
import { FOLDER_SEP } from "./MemFolders";

export type FoldersInputProps = {
    watch: UseFormWatch<any>;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
};

export type FoldersInputComponent = React.FunctionComponent<FoldersInputProps>;

export const FoldersInput: FoldersInputComponent = ({ register, setValue, watch }): JSX.Element => {
    const [open, setOpen] = useState<false | number[]>(false);
    const [currentFolder, setCurrentFolder] = useState<string>("");

    let folders = (JSON.parse(watch("folders") || []) as string[]).map((f) => f.split(FOLDER_SEP));
    const save = () => setValue("folders", JSON.stringify(folders.map((f) => f.join(FOLDER_SEP))));

    const handleDeleteChip = (folderIndex: number, chipIndex: number) => () => {
        folders[folderIndex].splice(chipIndex, 1);
        folders = folders.filter((f) => f.length > 0);
        save();
    };

    const handleClickChip = (folderIndex: number, chipIndex: number) => () => {
        setCurrentFolder(folders[folderIndex][chipIndex]);
        setOpen([folderIndex, chipIndex]);
    };

    const handleSaveCurrentFolderChip = (cancel?: true) => {
        if (cancel) return setOpen(false);
        const [folderIndex, chipIndex] = open as number[];
        if (folderIndex == -1) folders.push([currentFolder]);
        else {
            if (chipIndex == -1) folders[folderIndex].push(currentFolder);
            else folders[folderIndex].splice(chipIndex, 1, currentFolder);
        }
        setOpen(false);
        save();
    };

    const handleAddChip = (folderIndex: number) => (ev) => {
        if (ev.nativeEvent.pointerId != -1) {
            setCurrentFolder("");
            setOpen([folderIndex, -1]);
        }
    };

    const handleAddNewFolder = () => {
        setCurrentFolder("");
        setOpen([-1, -1]);
    };

    return (
        <>
            <DialogTextField
                open={open !== false}
                value={currentFolder}
                onChange={setCurrentFolder}
                onSave={handleSaveCurrentFolderChip}
                label="Folder?"
            />

            <FormLabel>Folder:</FormLabel>

            <Stack>
                {folders.map((chips: string[], folderIndex: number) => (
                    <div key={folderIndex}>
                        <Stack key={folderIndex} direction="row" spacing={2}>
                            <Paper
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    listStyle: "none",
                                    p: 0.5,
                                    m: 0,
                                    width: "100%",
                                }}
                                component="ul"
                            >
                                {chips.map((chip, chipIndex) => (
                                    <ListItem key={chipIndex} sx={{ display: "inline", width: "auto", padding: 0 }}>
                                        <Chip
                                            label={chip}
                                            onClick={handleClickChip(folderIndex, chipIndex)}
                                            onDelete={handleDeleteChip(folderIndex, chipIndex)}
                                        />
                                    </ListItem>
                                ))}
                            </Paper>
                            <IconButton color="primary" onClick={handleAddChip(folderIndex)}>
                                <AddIcon />
                            </IconButton>
                        </Stack>
                        <Divider />
                    </div>
                ))}

                <Button onClick={handleAddNewFolder}>
                    <AddIcon />
                    Add a folder
                </Button>
            </Stack>
            <input type="hidden" {...register("folders")} />
        </>
    );
};
