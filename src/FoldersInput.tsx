import React, { useState } from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

import AddIcon from "@mui/icons-material/Add";
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    FormLabel,
    IconButton,
    ListItem,
    Paper,
    Stack,
    TextField,
} from "@mui/material";

import { FOLDER_SEP } from "./MemFolders";

export type FoldersInputProps = {
    watch: UseFormWatch<any>;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
};

export type FoldersInputComponent = React.FunctionComponent<FoldersInputProps>;

export const FoldersInput: FoldersInputComponent = ({ register, setValue, watch }): JSX.Element => {
    const [open, setOpen] = useState<false | number>(false);
    const [currentFolder, setCurrentFolder] = useState<[number, string]>([0, ""]);
    let folders = JSON.parse(watch("folders"));

    const handleDeleteChip = (folder: number, i: number) => () => {
        let val = folders[folder].split(FOLDER_SEP);
        val.splice(i, 1);

        if (val.length == 0) {
            delete folders[folder];
            folders = folders.filter((f: string) => !!f);
        } else {
            folders[folder] = val.join(FOLDER_SEP);
        }
        setValue("folders", JSON.stringify(folders));
    };

    const handleClickChip = (folder: number, i: number) => () => {
        setCurrentFolder([folder, folders[folder].split(FOLDER_SEP)[i]]);
        setOpen(i);
    };

    const handleSaveCurrentFolderChip = () => {
        const [folder, folderName] = currentFolder;

        if (open >= 0) {
            let val = folders[folder].split(FOLDER_SEP);
            val.splice(open, 1, folderName);
            folders[folder] = val.join(FOLDER_SEP);
        } else {
            folders[folder] = `${folders[folder]}${FOLDER_SEP}${folderName}`;
        }

        setOpen(false);
        setValue("folders", JSON.stringify(folders));
    };

    const handleAddChip = (folder: number) => () => {
        setOpen(-1);
        setCurrentFolder([folder, ""]);
    };

    const handleAddNewFolder = () => {
        folders.push("Click Me!");
        setValue("folders", JSON.stringify(folders));
    };

    return (
        <div>
            <Dialog open={open !== false}>
                <DialogContent>
                    <TextField
                        sx={{ marginTop: "0.5em" }}
                        label="Folder?"
                        value={currentFolder[1]}
                        onChange={(ev) => setCurrentFolder([currentFolder[0], ev.target.value])}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                            setOpen(false);
                            setCurrentFolder([0, ""]);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSaveCurrentFolderChip}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <FormLabel>Folder:</FormLabel>

            <Stack>
                {folders
                    .map((f: string) => f.split(FOLDER_SEP))
                    .map((chips: string[], key: number) => (
                        <Stack key={key} direction="row" spacing={2}>
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
                                {chips.map((chip, i) => (
                                    <ListItem key={i} sx={{ display: "inline", width: "auto", padding: 0 }}>
                                        <Chip
                                            label={chip}
                                            onClick={handleClickChip(key, i)}
                                            onDelete={handleDeleteChip(key, i)}
                                        />
                                    </ListItem>
                                ))}
                            </Paper>
                            <IconButton color="primary" onClick={handleAddChip(key)}>
                                <AddIcon />
                            </IconButton>
                        </Stack>
                    ))}

                <Button onClick={handleAddNewFolder}>
                    <AddIcon />
                    Add a folder
                </Button>
            </Stack>
            <input type="hidden" {...register("folders")} />
        </div>
    );
};
