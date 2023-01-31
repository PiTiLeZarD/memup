import React, { useEffect, useRef } from "react";

import {
    Box,
    Button,
    Chip,
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
    suggestions?: string[];
    onChange: (newValue: string) => void;
    onSave: (cancel?: true) => void;
    Component?: React.ElementType;
};

export type DialogTextFieldComponent = React.FunctionComponent<
    React.PropsWithChildren<DialogTextFieldProps> & Omit<TextFieldProps, keyof DialogTextFieldProps>
>;

export const DialogTextField: DialogTextFieldComponent = ({
    open,
    title,
    label,
    value,
    onChange,
    onSave,
    suggestions,
    children,
    Component = TextField,
    ...ComponentProps
}): JSX.Element => {
    const cbSaveRef = useRef<boolean>(false);
    useEffect(() => {
        if (cbSaveRef.current) {
            cbSaveRef.current = false;
            onSave();
        }
    }, [value]);

    const handleKeyDown = (ev) => {
        if (ev.keyCode == 13) {
            onSave();
        }
    };
    const handleSuggestion = (s: string) => () => {
        onChange(s);
        cbSaveRef.current = true;
    };

    return (
        <Dialog open={open !== false} onClose={() => onSave(true)}>
            <DialogTitle>{title || label}</DialogTitle>
            <DialogContent>
                {open !== false && (
                    <Stack sx={{ paddingTop: "0.5em", width: "25em" }}>
                        <Component
                            label={label}
                            value={value}
                            onChange={(ev) => onChange(ev.target.value)}
                            onKeyDown={handleKeyDown}
                            {...ComponentProps}
                        />
                        {suggestions && (
                            <Box sx={{ maxWidth: "100%", lineHeight: "2.5em" }}>
                                {suggestions.map((s, i) => (
                                    <Chip key={i} label={s} onClick={handleSuggestion(s)} />
                                ))}
                            </Box>
                        )}
                        {children}
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
