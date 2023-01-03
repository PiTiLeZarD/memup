import React from "react";
import { useParams } from "react-router-dom";

import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { IconButton, List, ListItem, ListItemText } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { MemType } from "./store";

export const FOLDER_SEP = "|";

export type MemFoldersProps = {
    subfolders: { [k: string]: MemType[] };
};

export type MemFoldersComponent = React.FunctionComponent<MemFoldersProps>;

export const MemFolders: MemFoldersComponent = ({ subfolders }): JSX.Element => {
    const { folders } = useParams();
    const navigate = useNavigate();

    const handleClick = (subfolder: string) => () => {
        let current = (folders || "").split(FOLDER_SEP).filter((e) => !!e);
        current.push(subfolder);
        navigate(`/mems/${current.join(FOLDER_SEP)}`);
    };

    return (
        <List>
            {Object.keys(subfolders)
                .filter((t) => t != "undefined")
                .sort()
                .map((subfolder) => (
                    <ListItem
                        key={subfolder}
                        secondaryAction={
                            <IconButton onClick={handleClick(subfolder)}>
                                <DoubleArrowIcon />
                            </IconButton>
                        }
                    >
                        <ListItemText primary={subfolder} secondary={`${subfolders[subfolder].length} mems`} />
                    </ListItem>
                ))}
        </List>
    );
};
