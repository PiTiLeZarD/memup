import React from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import { MemType } from "./store";

export type MemFormDialogWrapperProps = {
    onSubmit: () => void;
    open: false | MemType;
    setOpen: (open: false | MemType) => void;
    setLogsOpen: (open: boolean) => void;
};

export type MemFormDialogWrapperComponent = React.FunctionComponent<React.PropsWithChildren<MemFormDialogWrapperProps>>;

export const MemFormDialogWrapper: MemFormDialogWrapperComponent = ({
    onSubmit,
    open,
    setOpen,
    setLogsOpen,
    children,
}): JSX.Element => {
    return (
        <Dialog open={!!open} onClose={() => setOpen(false)}>
            <DialogTitle>Add a mem</DialogTitle>
            <DialogContent sx={{ minWidth: "500px" }}>{children}</DialogContent>
            <DialogActions>
                {open && open.checks && <Button onClick={() => setLogsOpen(true)}>Logs</Button>}
                <Button variant="contained" color="inherit" onClick={() => setOpen(false)}>
                    Close
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        setOpen(false);
                        onSubmit();
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
