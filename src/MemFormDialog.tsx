import React, { useState } from "react";

import DoneIcon from "@mui/icons-material/Done";
import ReportIcon from "@mui/icons-material/Report";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import { grey } from "@mui/material/colors";
import { Mem } from "./Mem";
import { MemForm } from "./MemForm";
import { MemFormDialogWrapper } from "./MemFormDialogWrapper";
import { MemQuizzAnswer, MemType, useStore } from "./store";

export type MemFormDialogProps = {
    open: false | MemType;
    setOpen: (open: false | MemType) => void;
};

export type MemFormDialogComponent = React.FunctionComponent<MemFormDialogProps>;

export const MemFormDialog: MemFormDialogComponent = ({ open, setOpen }): JSX.Element => {
    const [logsOpen, setLogsOpen] = useState<boolean>(false);

    const mems = useStore(({ mems }) => mems);

    return (
        <>
            <Dialog open={logsOpen} onClose={() => setLogsOpen(false)}>
                <DialogTitle>
                    <Mem mem={open as MemType} variant="h4" />
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Success</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Selected</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {open &&
                                    open.checks.map((check) => (
                                        <TableRow key={(check.date || new Date()).toDateString()}>
                                            <TableCell>{check.date?.toDateString()}</TableCell>
                                            <TableCell>{check.success ? <DoneIcon /> : <ReportIcon />}</TableCell>
                                            <TableCell>{check.time}</TableCell>
                                            <TableCell>
                                                {(check as MemQuizzAnswer).selected && (
                                                    <Mem
                                                        mem={
                                                            mems.find(
                                                                (m) => m.id == (check as MemQuizzAnswer).selected
                                                            ) as MemType
                                                        }
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Typography sx={{ flexGrow: "1", color: grey[200] }} variant="subtitle2">
                        {(open as MemType).id}
                    </Typography>
                    <Button variant="contained" onClick={() => setLogsOpen(false)}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            {open && (
                <MemForm
                    mem={open}
                    FieldsWrapper={MemFormDialogWrapper}
                    setOpen={setOpen}
                    open={open}
                    setLogsOpen={setLogsOpen}
                />
            )}
        </>
    );
};
