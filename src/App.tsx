import React, { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Grid, IconButton, List, ListItem, Paper } from "@mui/material";
import { lightBlue } from "@mui/material/colors";

import { Mem } from "./Mem";
import { MemForm } from "./MemForm";
import { MemType, newMem, useStore } from "./store";

export type AppProps = {};

export type AppComponent = React.FunctionComponent<AppProps>;

export const App: AppComponent = (): JSX.Element => {
    const mems = useStore(({ mems }) => mems);
    const deleteMem = useStore(({ deleteMem }) => deleteMem);
    const [formOpen, setFormOpen] = useState<false | MemType>(false);
    return (
        <>
            <style type="text/css">{`
                html, body {
                    background-color: ${lightBlue[100]}
                }
            `}</style>
            <Paper
                elevation={8}
                sx={{ borderRadius: "25px", padding: "2em", margin: "2em", border: `3px solid ${lightBlue[400]}` }}
            >
                <Button variant="contained" onClick={() => setFormOpen(newMem())}>
                    Add a mem
                </Button>
                <MemForm open={formOpen} onClose={() => setFormOpen(false)} />

                <List>
                    {mems.map((mem) => (
                        <ListItem key={mem.id}>
                            <Grid container>
                                <Grid item xs={10}>
                                    <Mem data={mem} />
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: "right" }}>
                                    <IconButton onClick={() => setFormOpen(mem)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => deleteMem(mem)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </>
    );
};
