import React from "react";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import { array, boolean, number, object, string } from "yup";
import { Dropzone, FileWithPreview } from "./Dropzone";
import { MemType } from "./store";

export type ImportMemsProps = {
    open: boolean;
    onClose: () => void;
};

const validationSchema = object({
    state: object({
        mems: array()
            .of(
                object({
                    id: string().required(),
                    mem: string().required(),
                    description: string().required(),
                    hint: string().nullable(true),
                    notes: string().nullable(true),
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
    version: number().required(),
});

export type ImportMemsComponent = React.FunctionComponent<ImportMemsProps>;

export const ImportMemsDialog: ImportMemsComponent = ({ open, onClose }): JSX.Element => {
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
                    onClose();
                });
            };
            fr.readAsText(file);
        });
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Import all mems</DialogTitle>
                <DialogContent>
                    <Dropzone onAcceptedFiles={handleImport}>
                        <Box sx={{ width: "10em", height: "10em", textAlign: "center", paddinTop: "4em" }}>
                            Drop your file here
                        </Box>
                    </Dropzone>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
