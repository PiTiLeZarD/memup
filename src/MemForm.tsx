import React from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

export type MemFormProps = {
    open: boolean;
    onClose: () => void;
};

export type MemFormComponent = React.FunctionComponent<MemFormProps>;

export const MemForm: MemFormComponent = ({ open, onClose }): JSX.Element => {
    const { register, handleSubmit } = useForm();

    const handleSave = (data) => {
        console.log({ data });
        onClose();
    };
    const handleClose = () => onClose();

    return (
        <form onSubmit={handleSubmit(handleSave)}>
            <Dialog open={open} onClose={handleClose}>
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
