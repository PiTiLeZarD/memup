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
import { isKanji, splitByKanji } from "../../lib";
import { MemListItem } from "../../MemListItem";
import { MemType, useStore } from "../../store";

export type SearchMemButtonProps = {
    defaultSearch?: string;
    Component?: React.FunctionComponent;
    ComponentProps?: Object;
};

const memSearchTerms: (mem: MemType) => string = (mem) => {
    let terms = [mem.mem, mem.description];
    if ((mem.furigana || []).length > 0) {
        let i = 0;
        terms.push(
            splitByKanji(mem.mem)
                .map((b) => (isKanji(b) ? (mem.furigana as string[])[i++] : b))
                .join("")
        );
    }
    return terms.join(" ");
};

export type SearchMemButtonComponent = React.FunctionComponent<SearchMemButtonProps>;

export const SearchMemButton: SearchMemButtonComponent = ({
    defaultSearch,
    Component = Fab,
    ComponentProps = {
        sx: {
            position: "absolute",
            top: "-30px",
            right: "35px",
        },
        color: "primary",
    },
}): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false);
    const [hiragana, setHiragana] = useState<boolean>(false);
    const [search, setSearch] = useState<string>(defaultSearch || "");
    const mems = useStore(({ mems }) => mems);

    const InputComponent = hiragana ? HiraganaTextField : TextField;
    const filteredMems: { [folder: string]: MemType[] } =
        search.length > 0
            ? mems
                  .filter((m) => memSearchTerms(m).includes(search))
                  .reduce<{ [folder: string]: MemType[] }>((acc, m) => {
                      m.folders.forEach((f) => (acc[f] = [...(acc[f] || []), m]));
                      return acc;
                  }, {})
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
                                            <ListItem key={`${folder}_${mem.id}`}>
                                                <MemListItem data={mem} showDescription />
                                            </ListItem>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                    </List>
                </DialogContent>
            </Dialog>

            <Component {...(ComponentProps as any)} onClick={() => setOpen(true)}>
                <SearchIcon />
            </Component>
        </>
    );
};
