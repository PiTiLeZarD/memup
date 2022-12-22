import React, { useEffect } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

import { MemType, newMem, useStore } from "./store";

type FormState = {
    mem: string;
    description: string;
    hint: string;
    notes: string;
};

export type MemFormProps = {
    open: false | MemType;
    onClose: () => void;
};

const mem2Form = ({ mem, description, hint, notes }: MemType): FormState => ({
    mem,
    description,
    hint: hint || "",
    notes: notes || "",
});

export type MemFormComponent = React.FunctionComponent<MemFormProps>;

export const MemForm: MemFormComponent = ({ open, onClose }): JSX.Element => {
    const { register, handleSubmit, reset } = useForm<FormState>({
        defaultValues: open ? mem2Form(open) : {},
    });

    useEffect(() => {
        if (open) reset(mem2Form(open));
    }, [open]);

    const saveMem = useStore(({ saveMem }) => saveMem);

    const handleSave = ({ mem, description, hint, notes }) => {
        saveMem({
            ...(open || newMem()),
            mem,
            description,
            hint: hint || null,
            notes: notes || null,
        });
        onClose();
    };
    const handleClose = () => onClose();

    return (
        <form onSubmit={handleSubmit(handleSave)}>
            <Dialog open={!!open} onClose={handleClose}>
                <DialogTitle>Add a mem</DialogTitle>
                <DialogContent sx={{ minWidth: "500px" }}>
                    <Stack spacing={2} sx={{ margin: "0.5em 0" }}>
                        <TextField label="Mem" {...register("mem")} required />
                        <TextField label="Description" {...register("description")} required />
                        <TextField label="Hint" {...register("hint")} />
                        <TextField label="Notes" {...register("notes")} multiline rows={5} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(handleSave)}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};
