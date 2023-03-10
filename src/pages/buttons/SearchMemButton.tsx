import React, { useEffect, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import {
    Badge,
    Box,
    Button,
    Dialog,
    DialogContent,
    Fab,
    InputAdornment,
    List,
    ListItem,
    ListSubheader,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { HiraganaTextField } from "../../HiraganaTextField";
import { hiraganaValue } from "../../lib";
import { MemListItem } from "../../MemListItem";
import { MemType, useStore } from "../../store";

const memSearchTerms: (mem: MemType) => string = (mem) => {
    let terms = [mem.mem, mem.description];
    if ((mem.furigana || []).length > 0) {
        terms.push(hiraganaValue(mem));
    }
    return terms.join(" ");
};

export type SearchMemAction = {
    child: React.ReactNode;
    action: (mem: MemType, close: () => void) => void;
    Component?: React.ElementType;
    ComponentProps?: Object;
};

export type SearchMemButtonProps = {
    defaultSearch?: string;
    Component?: React.FunctionComponent;
    ComponentProps?: Object;
    actions?: SearchMemAction[];
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
    actions = [],
}): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>(defaultSearch || "");
    const mems = useStore(({ mems }) => mems);
    const navigate = useNavigate();

    useEffect(() => {
        if (!!defaultSearch) {
            setSearch(defaultSearch as string);
        }
    }, [defaultSearch]);

    const handleHeaderClick = (folder) => (ev) => {
        navigate(`/mems/${folder}`);
        setOpen(false);
    };

    const memsMatching = mems.filter((m) => memSearchTerms(m).includes(search));
    const filteredMems: { [folder: string]: MemType[] } =
        search.length > 0
            ? memsMatching.reduce<{ [folder: string]: MemType[] }>((acc, m) => {
                  m.folders.forEach((f) => (acc[f] = [...(acc[f] || []), m]));
                  return acc;
              }, {})
            : {};

    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
                <HiraganaTextField
                    placeholder="Search..."
                    fullWidth
                    romaji
                    defaultRomaji={true}
                    value={search}
                    onChange={(ev) => setSearch(ev.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
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
                                        <ListSubheader sx={{ cursor: "pointer" }} onClick={handleHeaderClick(folder)}>
                                            {folder}
                                        </ListSubheader>
                                        {filteredMems[folder].map((mem) => (
                                            <ListItem key={`${folder}_${mem.id}`}>
                                                <MemListItem data={mem} showDescription />
                                                {actions.length > 0 && (
                                                    <Box component="span" sx={{ paddingLeft: "1em" }}>
                                                        {actions.map(
                                                            (
                                                                { child, action, Component = Button, ComponentProps },
                                                                sbi
                                                            ) => (
                                                                <Component
                                                                    key={sbi}
                                                                    size="small"
                                                                    variant="contained"
                                                                    {...(ComponentProps as any)}
                                                                    onClick={() => action(mem, () => setOpen(false))}
                                                                >
                                                                    {child as React.ReactNode}
                                                                </Component>
                                                            )
                                                        )}
                                                    </Box>
                                                )}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                    </List>
                </DialogContent>
            </Dialog>

            {!!defaultSearch && (
                <Badge invisible={memsMatching.length == 0} badgeContent={memsMatching.length} color="warning">
                    <Component {...(ComponentProps as any)} onClick={() => setOpen(true)}>
                        <SearchIcon />
                    </Component>
                </Badge>
            )}
            {!defaultSearch && (
                <Component {...(ComponentProps as any)} onClick={() => setOpen(true)}>
                    <SearchIcon />
                </Component>
            )}
        </>
    );
};
