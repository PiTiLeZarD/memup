import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";

import { DialogTextField } from "./DialogTextField";
import { cleanMemsForExport, uniqueMems } from "./lib";
import { MemFoldersLearnButton } from "./MemFoldersLearnButton";
import { MemsLinearProgress } from "./MemsLinearProgress";
import { downloadMems } from "./pages/ImportBackupPage";
import { MemType, useStore } from "./store";

export const FOLDER_SEP = "|";

export type MemFoldersProps = {
    subfolders: { [k: string]: MemType[] };
};

export type MemFoldersComponent = React.FunctionComponent<MemFoldersProps>;

export const MemFolders: MemFoldersComponent = ({ subfolders }): JSX.Element => {
    const { folder } = useParams();
    const [renameOpen, setRenameOpen] = useState<false | string>(false);
    const saveMem = useStore(({ saveMem }) => saveMem);
    const [newFolderName, setNewFolderName] = useState<string>("");
    const navigate = useNavigate();

    const handleClick = (subfolder: string) => () => {
        let current = (folder || "").split(FOLDER_SEP).filter((e) => !!e);
        current.push(subfolder);
        navigate(`/mems/${current.join(FOLDER_SEP)}`);
    };

    const handleFolderClick = (subfolder) => () => {
        setRenameOpen(subfolder);
        setNewFolderName(subfolder);
    };

    const handleRenameFolder = () => {
        const oldFolder = `${folder}${FOLDER_SEP}${renameOpen as string}`;
        const newFolder = `${folder}${FOLDER_SEP}${newFolderName}`;
        subfolders[renameOpen as string].forEach((m) => {
            if (m.folders.includes(oldFolder)) {
                m.folders = [...m.folders.filter((f) => f != oldFolder), newFolder];
                saveMem(m);
            }
        });
        setNewFolderName("");
        setRenameOpen(false);
    };

    return (
        <>
            <DialogTextField
                open={renameOpen !== false}
                value={newFolderName}
                onChange={(newValue) => setNewFolderName(newValue)}
                onSave={handleRenameFolder}
                label="New Folder Name?"
            />

            <List>
                {Object.keys(subfolders)
                    .filter((t) => t != "undefined")
                    .sort()
                    .map((subfolder) => (
                        <ListItem key={subfolder}>
                            <ListItemText
                                primary={subfolder}
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "background.paper",
                                        borderRadius: "10px",
                                        padding: "0 1em",
                                        cursor: "pointer",
                                    },
                                }}
                                onClick={handleFolderClick(subfolder)}
                                secondary={`${uniqueMems(subfolders[subfolder]).length} mems`}
                            />
                            <Box sx={{ width: "45%", marginRight: "10.5em" }} component="span">
                                <MemsLinearProgress mems={uniqueMems(subfolders[subfolder])} />
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
        </>
    );
};
