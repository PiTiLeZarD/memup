import React from "react";
import { array, boolean, number, object, string } from "yup";

import { Box, Button, Typography } from "@mui/material";

import { grey } from "@mui/material/colors";
import { Dropzone, FileWithPreview } from "../Dropzone";
import { MemType } from "../store";
import { HomeButton } from "./buttons/HomeButton";
import { ContentBox } from "./ContentBox";

export type ImportBackupPageProps = {};

export type ImportBackupPageComponent = React.FunctionComponent<ImportBackupPageProps>;

const downloadAllMems = () =>
    Object.assign(document.createElement("a"), {
        href: `data:application/JSON, ${encodeURIComponent(JSON.stringify(localStorage.getItem("memup")))}`,
        download: "your_history",
    }).click();

const validationSchema = object({
    state: object({
        mems: array()
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
            .required(),
    }).required(),
    version: number(),
});

export const ImportBackupPage: ImportBackupPageComponent = (): JSX.Element => {
    const handleImport = (files: FileWithPreview[]) => {
        files.map((file) => {
            const fr = new FileReader();
            fr.onload = () => {
                const data: MemType = fr.result
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
                    localStorage.setItem("memup", JSON.stringify(state));
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
                    <Typography variant="h4">Import mems</Typography>
                    <Dropzone
                        onAcceptedFiles={handleImport}
                        sx={{ background: grey[200], position: "relative" }}
                        elevation={8}
                    >
                        <Box sx={{ width: "100%", height: "10em" }}>
                            <Typography variant="h5" sx={{ paddingTop: "2.5em" }}>
                                Drop your file here!
                            </Typography>
                        </Box>
                    </Dropzone>
                </Box>
            </ContentBox>
        </>
    );
};
