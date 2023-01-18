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
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";

import { FoldersInput } from "./FoldersInput";
import { FuriganaInput } from "./japanese/FuriganaInput";
import { includesKanji, newMem } from "./lib";
import { Mem } from "./Mem";
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
    onClose: () => void;
};

const mem2Form = ({ mem, description, hint, furigana, folders }: MemType): FormState => ({
    mem,
    description,
    furigana: JSON.stringify(furigana || ""),
    folders: JSON.stringify(folders || ""),
    hint: hint || "",
});

export type MemFormComponent = React.FunctionComponent<MemFormProps>;

export const MemForm: MemFormComponent = ({ open, onClose }): JSX.Element => {
    const { register, handleSubmit, reset, watch, setValue } = useForm<FormState>({
        defaultValues: open ? mem2Form(open) : {},
    });
    const [logsOpen, setLogsOpen] = useState<boolean>(false);
    const [setFurigana, setSetFurigana] = useState<boolean>(false);

    const memValue = watch("mem");
    const hasKanji = includesKanji(memValue);

    useEffect(() => {
        if (open) {
            reset(mem2Form(open));
            setSetFurigana((open.furigana || []).length > 0);
        }
    }, [open]);

    const saveMem = useStore(({ saveMem }) => saveMem);
    const mems = useStore(({ mems }) => mems);

    const handleSave = ({ mem, description, hint, furigana, folders }) => {
        saveMem({
            ...(open || newMem()),
            mem,
            description,
            furigana: furigana ? JSON.parse(furigana) : null,
            folders: folders ? JSON.parse(folders) : [],
            hint: hint || null,
        });
        onClose();
    };
    const handleClose = () => onClose();

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
                    <Button variant="contained" onClick={() => setLogsOpen(false)}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            <form onSubmit={handleSubmit(handleSave)}>
                <Dialog open={!!open} onClose={handleClose}>
                    <DialogTitle>Add a mem</DialogTitle>
                    <DialogContent sx={{ minWidth: "500px" }}>
                        <Stack spacing={2} sx={{ margin: "0.5em 0" }}>
                            <FoldersInput watch={watch} register={register} setValue={setValue} />
                            <Stack direction="row" sx={{ width: "100%" }}>
                                <TextField label="Mem" {...register("mem")} required fullWidth />
                                {hasKanji && (
                                    <Button
                                        color={setFurigana ? "primary" : "inherit"}
                                        variant="contained"
                                        onClick={() => setSetFurigana(!setFurigana)}
                                    >
                                        +あ
                                    </Button>
                                )}
                            </Stack>
                            {hasKanji && setFurigana && (
                                <FuriganaInput
                                    memValue={memValue}
                                    furigana={open ? open.furigana || [] : []}
                                    register={register}
                                    setValue={setValue}
                                />
                            )}
                            <TextField label="Description" {...register("description")} required />
                            <TextField label="Hint" {...register("hint")} />
                        </Stack>
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
