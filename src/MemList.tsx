import React, { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Grid, IconButton, List, ListItem } from "@mui/material";

import { Mem } from "./Mem";
import { MemForm } from "./MemForm";
import { MemType, newMem, useStore } from "./store";

export type MemListProps = {
    mems: MemType[];
};

export type MemListComponent = React.FunctionComponent<MemListProps>;

export const MemList: MemListComponent = ({ mems }): JSX.Element => {
    const [formOpen, setFormOpen] = useState<false | MemType>(false);
    const deleteMem = useStore(({ deleteMem }) => deleteMem);

    return (
        <>
            <Button variant="contained" onClick={() => setFormOpen(newMem())}>
                Add a mem
            </Button>

            <MemForm open={formOpen} onClose={() => setFormOpen(false)} />
            <List sx={{ marginTop: "0.5em" }}>
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
        </>
    );
};
