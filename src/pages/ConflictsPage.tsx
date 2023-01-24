import React from "react";

import PreviewIcon from "@mui/icons-material/Preview";
import { Button, Grid, IconButton, List, ListItem, Stack } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { MemListItem } from "../MemListItem";
import { MemType, useStore } from "../store";
import { HomeButton } from "./buttons/HomeButton";
import { ContentBox } from "./ContentBox";

export type ConflictsPageProps = {};

export type ConflictsPageComponent = React.FunctionComponent<ConflictsPageProps>;

export const ConflictsPage: ConflictsPageComponent = (): JSX.Element => {
    const conflicts = useStore(({ conflicts }) => conflicts);
    const setConflicts = useStore(({ setConflicts }) => setConflicts);
    const navigate = useNavigate();

    const handlePreview = (mem: MemType) => () => {};
    const handleClearAll = () => {
        if (confirm("Are you sure to delete all current conflicts?")) {
            setConflicts([]);
            navigate("/");
        }
    };

    return (
        <ContentBox>
            <HomeButton />
            <Stack spacing={2}>
                <Button variant="contained" onClick={handleClearAll}>
                    Clear all
                </Button>
                <List>
                    {conflicts.map((mem) => (
                        <ListItem key={mem.id}>
                            <Grid container>
                                <Grid item xs={10}>
                                    <MemListItem data={mem} />
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: "right" }}>
                                    <IconButton onClick={handlePreview(mem)}>
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
