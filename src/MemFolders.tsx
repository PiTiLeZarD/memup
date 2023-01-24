import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";

import { MemFoldersLearnButton } from "./MemFoldersLearnButton";
import { MemsLinearProgress } from "./MemsLinearProgress";
import { cleanMemsForExport, downloadMems } from "./pages/ImportBackupPage";
import { MemType } from "./store";

export const FOLDER_SEP = "|";

export type MemFoldersProps = {
    subfolders: { [k: string]: MemType[] };
};

export type MemFoldersComponent = React.FunctionComponent<MemFoldersProps>;

export const MemFolders: MemFoldersComponent = ({ subfolders }): JSX.Element => {
    const { folder } = useParams();
    const navigate = useNavigate();

    const handleClick = (subfolder: string) => () => {
        let current = (folder || "").split(FOLDER_SEP).filter((e) => !!e);
        current.push(subfolder);
        navigate(`/mems/${current.join(FOLDER_SEP)}`);
    };

    return (
        <List>
            {Object.keys(subfolders)
                .filter((t) => t != "undefined")
                .sort()
                .map((subfolder) => (
                    <ListItem key={subfolder}>
                        <ListItemText primary={subfolder} secondary={`${subfolders[subfolder].length} mems`} />
                        <Box sx={{ width: "45%", marginRight: "10.5em" }} component="span">
                            <MemsLinearProgress mems={subfolders[subfolder]} />
                        </Box>
                        <ListItemSecondaryAction>
                            <MemFoldersLearnButton subfolders={subfolders} subfolder={subfolder} />
                            <IconButton
                                onClick={() =>
                                    downloadMems(
                                        `${folder ? `${folder}/` : ""}${subfolder}`,
                                        cleanMemsForExport(subfolders[subfolder], [
                                            folder ? [folder, subfolder].join(FOLDER_SEP) : subfolder,
                                        ])
                                    )
                                }
                            >
                                <DownloadIcon />
                            </IconButton>
                            <IconButton onClick={handleClick(subfolder)}>
                                <DoubleArrowIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
        </List>
    );
};
