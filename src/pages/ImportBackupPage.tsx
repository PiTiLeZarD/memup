import React from "react";
import { array, boolean, number, object, string } from "yup";

import { Box, Button, Typography } from "@mui/material";

import { grey } from "@mui/material/colors";
import { Dropzone, FileWithPreview } from "../Dropzone";
import { memsToStore, MemType } from "../store";
import { HomeButton } from "./buttons/HomeButton";
import { ContentBox } from "./ContentBox";

export type ImportBackupPageProps = {};

export type ImportBackupPageComponent = React.FunctionComponent<ImportBackupPageProps>;

export const downloadMems = (title: string, mems: MemType[]) =>
    Object.assign(document.createElement("a"), {
        href: `data:application/JSON, ${encodeURIComponent(JSON.stringify(mems.map((m) => ({ ...m, checks: [] }))))}`,
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
                });
            };
            fr.readAsText(file);
        });
    };

    return (
        <>
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
                            href="https://raw.githubusercontent.com/PiTiLeZarD/memup/master/content/Japanese_Minnanonihongo.json"
                        >
                            If you need a starting point, use my file.
                        </Button>
                    </Typography>
                </Box>
            </ContentBox>
        </>
    );
};
