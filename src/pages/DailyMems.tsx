import React from "react";

import { List, ListItem, Stack, Typography } from "@mui/material";

import { memScore, randomiseDeck } from "../lib";
import { MemListItem } from "../MemListItem";
import { useStore } from "../store";
import { ContentBox } from "./ContentBox";

export type DailyMemsProps = {};

export type DailyMemsComponent = React.FunctionComponent<DailyMemsProps>;

export const DailyMems: DailyMemsComponent = (): JSX.Element => {
    const mems = randomiseDeck(useStore(({ mems }) => mems).filter((m) => memScore(m).memory == "LT")).splice(0, 5);

    if (mems.length == 0) return <></>;

    return (
        <ContentBox>
            <Stack alignItems="center" spacing={4}>
                <Typography variant="h4">Mems of the day</Typography>
                <Typography>
                    These are mems in your long term memory, every day you'll get 5 new ones. Try to use them so they
                    commit to your memory.
                </Typography>
                <List sx={{ width: "60%", margin: "auto" }}>
                    {mems.map((m) => (
                        <ListItem key={m.id}>
                            <MemListItem data={m} />
                        </ListItem>
                    ))}
                </List>
            </Stack>
        </ContentBox>
    );
};
