import React, { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, IconButton, List, ListItem } from "@mui/material";

import { blue, lightBlue } from "@mui/material/colors";
import { MemFormDialog } from "./MemFormDialog";
import { MemListItem } from "./MemListItem";
import { SearchMemButton } from "./pages/buttons/SearchMemButton";
import { MemType, useStore } from "./store";

export type MemListProps = {
    mems: MemType[];
};

export type MemListComponent = React.FunctionComponent<MemListProps>;

export const MemList: MemListComponent = ({ mems }): JSX.Element => {
    const [formOpen, setFormOpen] = useState<false | MemType>(false);
    const deleteMem = useStore(({ deleteMem }) => deleteMem);
    const { displayMode } = useStore(({ settings }) => settings);

    const handleDelete = (mem: MemType) => () => {
        if (confirm("Are you sure you want to delete this mem?")) {
            deleteMem(mem);
        }
    };

    return (
        <>
            <SearchMemButton
                actions={[
                    {
                        child: <EditIcon />,
                        action: (mem, close: () => void) => {
                            setFormOpen(mem);
                        },
                        Component: IconButton,
                    },
                ]}
            />
            <MemFormDialog open={formOpen} setOpen={setFormOpen} />
            <List sx={{ marginTop: "0.5em" }}>
                {mems.map((mem, i) => (
                    <ListItem
                        key={mem.id}
                        sx={{
                            background: i % 2 ? "inherit" : displayMode == "light" ? lightBlue[50] : blue[900],
                            padding: "1em",
                        }}
                    >
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
