import React, { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import {
    Button,
    Dialog,
    DialogContent,
    Fab,
    InputAdornment,
    List,
    ListItem,
    ListSubheader,
    TextField,
} from "@mui/material";

import { HiraganaTextField } from "../../HiraganaTextField";
import { MemListItem } from "../../MemListItem";
import { MemType, useStore } from "../../store";

export type SearchMemButtonProps = {};

export type SearchMemButtonComponent = React.FunctionComponent<SearchMemButtonProps>;

export const SearchMemButton: SearchMemButtonComponent = (): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false);
    const [hiragana, setHiragana] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const mems = useStore(({ mems }) => mems);

    const InputComponent = hiragana ? HiraganaTextField : TextField;
    const filteredMems: { [folder: string]: MemType[] } =
        search.length > 0
            ? mems
                  .filter(
                      ({ mem, description, furigana }) =>
                          mem.includes(search) || description.includes(search) || (furigana || []).includes(search)
                  )
                  .reduce((acc, m) => ({ ...acc, [m.folders.join("/")]: [...(acc[m.folders.join("/")] || []), m] }), {})
            : {};

    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
                <InputComponent
                    placeholder="Search..."
                    fullWidth
                    value={search}
                    onChange={(ev) => setSearch(ev.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button onClick={() => setHiragana(!hiragana)}>{hiragana ? "あ" : "ABC"}</Button>
                            </InputAdornment>
                        ),
                    }}
                />
                <DialogContent sx={{ minHeight: "10em" }}>
                    <List
                        subheader={<li />}
                        sx={{
                            width: "100%",
                            bgcolor: "background.paper",
                            position: "relative",
                            overflow: "auto",
                            maxHeight: "40em",
                            "& ul": { padding: 0 },
                            "& li.MuiListSubheader-root": { marginBottom: "0.5em" },
                        }}
                    >
                        {Object.keys(filteredMems)
                            .sort()
                            .map((folder) => (
                                <li key={folder}>
                                    <ul>
                                        <ListSubheader>{folder}</ListSubheader>
                                        {filteredMems[folder].map((mem) => (
                                            <ListItem>
                                                <MemListItem data={mem} key={mem.id} />
                                            </ListItem>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                    </List>
                </DialogContent>
            </Dialog>

            <Fab
                color="primary"
                onClick={() => {
                    setOpen(true);
                }}
                sx={{
                    position: "absolute",
                    top: "-30px",
                    right: "35px",
                }}
            >
                <SearchIcon />
            </Fab>
        </>
    );
};