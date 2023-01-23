import React from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    TextFieldProps,
} from "@mui/material";

export type DialogTextFieldProps = {
    open: boolean;
    title?: string;
    label: string;
    value: string;
    onChange: (newValue: string) => void;
    onSave: (cancel?: true) => void;
    Component?: React.ElementType;
};

export type DialogTextFieldComponent = React.FunctionComponent<
    DialogTextFieldProps & Omit<TextFieldProps, keyof DialogTextFieldProps>
>;

export const DialogTextField: DialogTextFieldComponent = ({
    open,
    title,
    label,
    value,
    onChange,
    onSave,
    Component = TextField,
    ...ComponentProps
}): JSX.Element => {
    const handleKeyDown = (ev) => {
        if (ev.keyCode == 13) {
            onSave();
        }
    };

    return (
        <Dialog open={open !== false}>
            <DialogTitle>{title || label}</DialogTitle>
            <DialogContent>
                {open !== false && (
                    <Stack spacing={2} sx={{ paddingTop: "0.5em" }}>
                        <Component
                            label={label}
                            value={value}
                            onChange={(ev) => onChange(ev.target.value)}
                            onKeyDown={handleKeyDown}
                            {...ComponentProps}
                        />
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="inherit" onClick={() => onSave(true)}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={() => onSave()}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
