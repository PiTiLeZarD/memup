import React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, IconButton, List, ListItem } from "@mui/material";

import { MemListItem } from "./MemListItem";
import { MemType, useStore } from "./store";

export type MemListProps = {
    mems: MemType[];
    setFormOpen: React.Dispatch<any>;
};

export type MemListComponent = React.FunctionComponent<MemListProps>;

export const MemList: MemListComponent = ({ mems, setFormOpen }): JSX.Element => {
    const deleteMem = useStore(({ deleteMem }) => deleteMem);

    return (
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
                            <IconButton onClick={() => deleteMem(mem)}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </ListItem>
            ))}
        </List>
    );
};
