import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
import { MemFormFields } from "./MemFormFields";
import { MemQuizzAnswer, MemType, useStore } from "./store";

type FormState = {
    mem: string;
    description: string;
    furigana: string;
    folders: string;
    hint: string;
};

export type MemFormProps = {
    open: false | MemType;
    setOpen: (open: false | MemType) => void;
};

const mem2Form = ({ id, mem, description, hint, furigana, folders }: MemType): FormState => ({
    mem,
    description,
    furigana: JSON.stringify(furigana || ""),
    folders: JSON.stringify(folders || ""),
    hint: hint || "",
});

export type MemFormComponent = React.FunctionComponent<MemFormProps>;

export const MemForm: MemFormComponent = ({ open, setOpen }): JSX.Element => {
    const { register, handleSubmit, reset, watch, setValue } = useForm<FormState>({
        defaultValues: open ? mem2Form(open) : {},
    });
    const [logsOpen, setLogsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            reset(mem2Form(open));
        }
    }, [open]);

    const saveMem = useStore(({ saveMem }) => saveMem);
    const mems = useStore(({ mems }) => mems);

    const handleSave = ({ mem, description, hint, furigana, folders }) => {
        saveMem({
            ...(open as MemType),
            mem,
            description,
            furigana: furigana ? JSON.parse(furigana) : null,
            folders: folders ? JSON.parse(folders) : [],
            hint: hint || null,
        });
        setOpen(false);
    };
    const handleClose = () => setOpen(false);

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
            <form onSubmit={handleSubmit(handleSave)}>
                <Dialog open={!!open} onClose={handleClose}>
                    <DialogTitle>Add a mem</DialogTitle>
                    <DialogContent sx={{ minWidth: "500px" }}>
                        {open && (
                            <MemFormFields
                                watch={watch}
                                setValue={setValue}
                                register={register}
                                mem={open}
                                pickMem={setOpen}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        {open && open.checks && <Button onClick={() => setLogsOpen(true)}>Logs</Button>}
                        <Button variant="contained" color="inherit" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="contained" onClick={handleSubmit(handleSave)}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </form>
        </>
    );
};
