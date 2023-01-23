import React from "react";
import { array, boolean, number, object, string } from "yup";

import { Box, Button, Dialog, DialogActions, DialogContentText, DialogTitle, Typography } from "@mui/material";

import { grey } from "@mui/material/colors";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropzone, FileWithPreview } from "../Dropzone";
import { memsToStore, MemType } from "../store";
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
            hint: string().nullable(true),
            furigana: array().of(string()).nullable(),
            folders: array().of(string()).nullable(),
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

    const handleImport = (files: FileWithPreview[]) => {
        files.map((file) => {
            const fr = new FileReader();
            fr.onload = () => {
                const data: MemType[] = fr.result
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
                    localStorage.setItem("memup", JSON.stringify(memsToStore(data)));
                    setImported("All went well!");
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
                    <Button onClick={() => navigate("/?refresh", { replace: true })}>OK</Button>
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
