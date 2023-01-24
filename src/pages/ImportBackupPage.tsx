import React from "react";
import { array, boolean, number, object, string } from "yup";

import { Box, Button, Dialog, DialogActions, DialogContentText, DialogTitle, Stack, Typography } from "@mui/material";

import { grey } from "@mui/material/colors";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropzone, FileWithPreview } from "../Dropzone";
import { deserialiseMems, MemType, useStore } from "../store";
import { HomeButton } from "./buttons/HomeButton";
import { ContentBox } from "./ContentBox";

export type ImportBackupPageProps = {};

export type ImportBackupPageComponent = React.FunctionComponent<ImportBackupPageProps>;

export const cleanMemsForExport = (mems: MemType[], folders?: string[]): Partial<MemType>[] =>
    mems.map((m) => {
        let nm: Partial<MemType> = { id: m.id, mem: m.mem, description: m.description };
        if (m.hint) nm.hint = m.hint;
        if (m.furigana) nm.furigana = m.furigana;
        if (folders && m.folders.length > 0)
            nm.folders = m.folders.filter((f) => folders.filter((fs) => f.startsWith(fs)).length > 0);
        return nm;
    });

export const cleanMemsForImport = (mems: Partial<MemType>[]): MemType[] =>
    mems.map((m) => ({ ...m, checks: m.checks || [] } as MemType));

export const downloadMems = (title: string, mems: Partial<MemType>[]) =>
    Object.assign(document.createElement("a"), {
        href: `data:application/JSON, ${encodeURIComponent(JSON.stringify(mems))}`,
        download: title,
    }).click();

const downloadAllMems = () => downloadMems("your_history", JSON.parse(localStorage.memup).state.mems);

const validationSchema = array()
    .of(
        object({
            id: string().required(),
            mem: string().required(),
            description: string().required(),
            hint: string().nullable(),
            furigana: array().of(string().required()).nullable(),
            folders: array().of(string().required()).required(),
            checks: array().of(
                object({
                    date: string().required(),
                    success: boolean().required(),
                    time: number().required(),
                    selected: string().nullable(),
                })
            ),
        })
    )
    .required();

export const ImportBackupPage: ImportBackupPageComponent = (): JSX.Element => {
    const [imported, setImported] = useState<false | string>(false);
    const navigate = useNavigate();
    const importMems = useStore(({ importMems }) => importMems);
    const conflicts = useStore(({ conflicts }) => conflicts);

    const handleImport = (files: FileWithPreview[]) => {
        files.map((file) => {
            const fr = new FileReader();
            fr.onload = () => {
                const data = fr.result
                    ? typeof fr.result == "string"
                        ? JSON.parse(fr.result)
                        : JSON.parse(
                              (() => {
                                  const enc = new TextDecoder("utf-8");
                                  return enc.decode(fr.result);
                              })()
                          )
                    : [];
                validationSchema.validate(data).then((state) => {
                    importMems(deserialiseMems(state), (conflicts) =>
                        setImported(
                            `${state.length - conflicts.length} mems imported with ${conflicts.length} conflicts`
                        )
                    );
                });
            };
            fr.readAsText(file);
        });
    };

    return (
        <>
            <Dialog open={imported !== false}>
                <DialogTitle>Import</DialogTitle>
                <DialogContentText sx={{ padding: "1em 3em" }}>{imported}</DialogContentText>
                <DialogActions>
                    <Button onClick={() => setImported(false)}>OK</Button>
                </DialogActions>
            </Dialog>
            <ContentBox>
                <HomeButton />
                <Box sx={{ textAlign: "center" }}>
                    <Button variant="contained" size="large" onClick={downloadAllMems}>
                        Backup
                    </Button>
                </Box>
            </ContentBox>
            {conflicts && (
                <ContentBox>
                    <Stack spacing={4}>
                        <Typography>
                            You currently have <b>{conflicts.length} conflicts</b> from previous imports
                        </Typography>
                        <Button variant="contained" onClick={() => navigate("/conflicts")}>
                            Review conflicts
                        </Button>
                    </Stack>
                </ContentBox>
            )}
            <ContentBox>
                <Box sx={{ textAlign: "center" }}>
                    <Dropzone
                        onAcceptedFiles={handleImport}
                        sx={{ background: grey[200], position: "relative", cursor: "pointer" }}
                        elevation={8}
                    >
                        <Box sx={{ width: "100%", height: "11em" }}>
                            <Typography variant="h5" sx={{ paddingTop: "2.5em" }}>
                                Import mems by dropping a file here.
                            </Typography>
                            <Typography>or click here to open the file dialog</Typography>
                        </Box>
                    </Dropzone>
                    <Typography>
                        <Button
                            target="_blank"
                            variant="contained"
                            sx={{ marginTop: "2em" }}
                            href="https://raw.githubusercontent.com/PiTiLeZarD/memup/master/content/Japanese_Minnanonihongo_N5.json"
                        >
                            If you need a starting point, use my file.
                        </Button>
                    </Typography>
                </Box>
            </ContentBox>
        </>
    );
};
