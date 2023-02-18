import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    Stack,
    Typography,
} from "@mui/material";
import { lightBlue } from "@mui/material/colors";

import { findConflicts } from "../lib";
import { Mem } from "../Mem";
import { MemForm } from "../MemForm";
import { MemListItem } from "../MemListItem";
import { useStore } from "../store";
import { useForceRender } from "../useForceRender";
import { HomeButton } from "./buttons/HomeButton";
import { ContentBox } from "./ContentBox";

export type ConflictsPageProps = {};

export type ConflictsPageComponent = React.FunctionComponent<ConflictsPageProps>;

export const ConflictsPage: ConflictsPageComponent = (): JSX.Element => {
    const forceRender = useForceRender();
    const { displayMode } = useStore(({ settings }) => settings);
    const [diffOpen, setDiffOpen] = useState<false | number>(false);
    const conflicts = useStore(({ conflicts }) => conflicts);
    const setConflicts = useStore(({ setConflicts }) => setConflicts);
    const mems = useStore(({ mems }) => mems);
    const navigate = useNavigate();

    const handleClearAll = () => {
        if (confirm("Are you sure to delete all current conflicts?")) {
            setConflicts([]);
            navigate("/");
        }
    };
    const handlePreview = (index: number) => () => {
        setDiffOpen(index);
    };
    const handleDelete = (index: number) => () => {
        conflicts.splice(index, 1);
        setConflicts(conflicts);
        forceRender();
    };

    return (
        <ContentBox>
            <HomeButton />

            <Dialog fullScreen open={diffOpen !== false} onClose={() => setDiffOpen(false)}>
                <DialogTitle>Review the conflict</DialogTitle>
                <DialogContent>
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            {diffOpen !== false && (
                                <MemForm
                                    mem={conflicts[diffOpen]}
                                    setMem={() => {}}
                                    FieldsWrapper={({ onSubmit, children }) => <Box>{children}</Box>}
                                />
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            {diffOpen !== false && (
                                <MemForm
                                    mem={conflicts[diffOpen]}
                                    setMem={() => {}}
                                    FieldsWrapper={({ onSubmit, children }) => <Box>{children}</Box>}
                                />
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDiffOpen(false)}>Cancel</Button>
                    <Button variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            <Stack spacing={2}>
                <Button variant="contained" onClick={handleClearAll}>
                    Clear all
                </Button>
                <List>
                    {conflicts.map((mem, i) => (
                        <ListItem
                            key={mem.id}
                            sx={{
                                background: i % 2 ? "inherit" : lightBlue[displayMode == "light" ? 50 : 900],
                                paddingTop: "1.5em",
                            }}
                        >
                            <Grid container>
                                <Grid item xs={10}>
                                    <MemListItem data={mem} showDescription>
                                        Conflicts with:
                                        <Box component="ul" sx={{ paddingTop: "0.5em" }}>
                                            {findConflicts([mem], mems).CONFLICTS.map((m, i) => (
                                                <Stack key={i} direction="row" spacing={2}>
                                                    <Mem mem={m} variant="h5" />
                                                    <Typography>{m.description}</Typography>
                                                </Stack>
                                            ))}
                                        </Box>
                                    </MemListItem>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: "right" }}>
                                    <IconButton onClick={handleDelete(i)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton onClick={handlePreview(i)}>
                                        <PreviewIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>
            </Stack>
        </ContentBox>
    );
};
