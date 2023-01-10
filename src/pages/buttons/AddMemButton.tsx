import React, { useState } from "react";
import { useParams } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";

import { newMem } from "../../lib";
import { FOLDER_SEP } from "../../MemFolders";
import { MemForm } from "../../MemForm";
import { MemType } from "../../store";

export type AddMemButtonProps = {};

export type AddMemButtonComponent = React.FunctionComponent<AddMemButtonProps>;

export const AddMemButton: AddMemButtonComponent = (): JSX.Element => {
    const { folders } = useParams();

    const handleAdd = () => setFormOpen({ ...newMem(), folders: folders?.split(FOLDER_SEP) || [] });
    const [formOpen, setFormOpen] = useState<false | MemType>(false);
    return (
        <>
            <MemForm open={formOpen} onClose={() => setFormOpen(false)} />
            <Fab
                color="primary"
                onClick={handleAdd}
                sx={{
                    position: "absolute",
                    top: "-30px",
                    right: "-25px",
                }}
            >
                <AddIcon />
            </Fab>
        </>
    );
};
