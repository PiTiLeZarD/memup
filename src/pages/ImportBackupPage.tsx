import React from "react";
import { array, boolean, number, object, string } from "yup";

import { Box, Button, Dialog, DialogActions, DialogContentText, DialogTitle, Stack, Typography } from "@mui/material";

import { grey } from "@mui/material/colors";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropzone, FileWithPreview } from "../Dropzone";
import { deserialiseMems } from "../lib";
import { MemType, useStore } from "../store";
import { HomeButton } from "./buttons/HomeButton";
import { ContentBox } from "./ContentBox";

export type ImportBackupPageProps = {};

export type ImportBackupPageComponent = React.FunctionComponent<ImportBackupPageProps>;

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
                    importMems(deserialiseMems(state), (statuses) => {
                        const total = Object.values(statuses).reduce<number>((acc, l) => acc + l.length, 0);
                        setImported(
                            `
                                <p>${total - (statuses.FINE || []).length} mems in the file</p>
                                <ul>
                                    <li>${(statuses.CONFLICTS || []).length} conflicts</li>
                                    <li>${(statuses.IGNORE || []).length} ignored</li>
                                </ul>
                            `
                        );
                    });
                });
            };
            fr.readAsText(file);
        });
    };

    return (
        <>
            <Dialog open={imported !== false}>
                <DialogTitle>Import</DialogTitle>
                <DialogContentText sx={{ padding: "1em 3em" }}>
                    <span dangerouslySetInnerHTML={{ __html: imported as string }} />
                </DialogContentText>
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
            {conflicts.length > 0 && (
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
