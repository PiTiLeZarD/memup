import React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import ReportIcon from "@mui/icons-material/Report";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
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
import { MemQuizzAnswer, MemType, useStore } from "./store";

export type MemChecksLogsProps = {
    mem: MemType;
    open: boolean;
    onClose: () => void;
};

export type MemChecksLogsComponent = React.FunctionComponent<MemChecksLogsProps>;

export const MemChecksLogs: MemChecksLogsComponent = ({ mem, open, onClose }): JSX.Element => {
    const mems = useStore(({ mems }) => mems);
    const saveMem = useStore(({ saveMem }) => saveMem);

    const handleDeleteCheck = (i: number) => () => {
        mem.checks.splice(i, 1);
        saveMem(mem);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Mem mem={mem} variant="h4" variantMapping={{ h4: "span" }} />
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
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mem.checks.map((check, i) => (
                                <TableRow key={i}>
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
                                    <TableCell>
                                        <IconButton size="small" onClick={handleDeleteCheck(i)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Typography sx={{ flexGrow: "1", color: grey[200] }} variant="subtitle2">
                    {mem.id}
                </Typography>
                <Button variant="contained" onClick={onClose}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};
