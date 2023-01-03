import React from "react";
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
import { useState } from "react";

export type FoldersInputProps = {
    watch: UseFormWatch<any>;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
};

export type FoldersInputComponent = React.FunctionComponent<FoldersInputProps>;

export const FoldersInput: FoldersInputComponent = ({ register, setValue, watch }): JSX.Element => {
    const [open, setOpen] = useState<false | number>(false);
    const [currentFolder, setCurrentFolder] = useState<string>("");
    let folders = JSON.parse(watch("folders"));

    const handleDelete = (i: number) => () => {
        folders.splice(i, 1);
        setValue("folders", JSON.stringify(folders));
    };

    const handleClick = (i: number) => () => {
        setCurrentFolder(folders[i]);
        setOpen(i);
    };

    const handleSaveCurrentFolder = () => {
        if (open >= 0) {
            folders.splice(open, 1, currentFolder);
        } else {
            folders.push(currentFolder);
        }
        setOpen(false);
        setValue("folders", JSON.stringify(folders));
    };

    return (
        <div>
            <Dialog open={open !== false}>
                <DialogContent>
                    <TextField
                        sx={{ marginTop: "0.5em" }}
                        label="Folder?"
                        value={currentFolder}
                        onChange={(ev) => setCurrentFolder(ev.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                            setOpen(false);
                            setCurrentFolder("");
                        }}
                    >
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSaveCurrentFolder}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <FormLabel>Folder:</FormLabel>

            <Stack direction="row" spacing={2}>
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
                    {folders.map((folder, i) => (
                        <ListItem key={i} sx={{ display: "inline", width: "auto", padding: 0 }}>
                            <Chip label={folder} onClick={handleClick(i)} onDelete={handleDelete(i)} />
                        </ListItem>
                    ))}
                </Paper>
                <IconButton color="primary" onClick={() => setOpen(-1)}>
                    <AddIcon />
                </IconButton>
            </Stack>
            <input type="hidden" {...register("folders")} />
        </div>
    );
};
