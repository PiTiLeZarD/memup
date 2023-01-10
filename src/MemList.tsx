import React, { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, IconButton, List, ListItem } from "@mui/material";

import { MemForm } from "./MemForm";
import { MemListItem } from "./MemListItem";
import { MemType, useStore } from "./store";

export type MemListProps = {
    mems: MemType[];
};

export type MemListComponent = React.FunctionComponent<MemListProps>;

export const MemList: MemListComponent = ({ mems }): JSX.Element => {
    const [formOpen, setFormOpen] = useState<false | MemType>(false);
    const deleteMem = useStore(({ deleteMem }) => deleteMem);

    const handleDelete = (mem: MemType) => () => {
        if (confirm("Are you sure you want to delete this mem?")) {
            deleteMem(mem);
        }
    };

    return (
        <>
            <MemForm open={formOpen} onClose={() => setFormOpen(false)} />
            <List sx={{ marginTop: "0.5em" }}>
                {mems.map((mem) => (
                    <ListItem key={mem.id}>
                        <Grid container>
                            <Grid item xs={10}>
                                <MemListItem data={mem} />
                            </Grid>
                            <Grid item xs={2} sx={{ textAlign: "right" }}>
                                <IconButton onClick={() => setFormOpen(mem)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={handleDelete(mem)}>
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
