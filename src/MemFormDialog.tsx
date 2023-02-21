import React, { useState } from "react";

import { MemChecksLogs } from "./MemChecksLogs";
import { MemForm } from "./MemForm";
import { MemFormDialogWrapper } from "./MemFormDialogWrapper";
import { MemType } from "./store";

export type MemFormDialogProps = {
    open: false | MemType;
    setOpen: (open: false | MemType) => void;
};

export type MemFormDialogComponent = React.FunctionComponent<MemFormDialogProps>;

export const MemFormDialog: MemFormDialogComponent = ({ open, setOpen }): JSX.Element => {
    const [logsOpen, setLogsOpen] = useState<boolean>(false);

    if (!open) return <></>;

    return (
        <>
            <MemChecksLogs open={logsOpen} onClose={() => setLogsOpen(false)} mem={open as MemType} />
            <MemForm
                mem={open}
                setMem={(mem) => setOpen(mem)}
                FieldsWrapper={MemFormDialogWrapper}
                setOpen={setOpen}
                open={open}
                setLogsOpen={setLogsOpen}
            />
        </>
    );
};
