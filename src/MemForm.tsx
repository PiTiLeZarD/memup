import React, { useEffect } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

import { MemType, newMem, useStore } from "./store";

type FormState = {
    mem: string;
};

export type MemFormProps = {
    open: false | MemType;
    onClose: () => void;
};

const mem2Form = ({ mem }: MemType): FormState => ({ mem });

export type MemFormComponent = React.FunctionComponent<MemFormProps>;

export const MemForm: MemFormComponent = ({ open, onClose }): JSX.Element => {
    const { register, handleSubmit, reset } = useForm<FormState>({
        defaultValues: open ? mem2Form(open) : {},
    });

    useEffect(() => {
        if (open) reset(mem2Form(open));
    }, [open]);

    const saveMem = useStore(({ saveMem }) => saveMem);

    const handleSave = ({ mem }) => {
        saveMem({ ...(open || newMem()), mem });
        onClose();
    };
    const handleClose = () => onClose();

    return (
        <form onSubmit={handleSubmit(handleSave)}>
            <Dialog open={!!open} onClose={handleClose}>
                <DialogTitle>Add a mem</DialogTitle>
                <DialogContent>
                    <TextField {...register("mem")} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit(handleSave)}>Save</Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};
