import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";

import { newMem } from "../../lib";
import { MemForm } from "../../MemForm";
import { MemType } from "../../store";

export type AddMemButtonProps = {};

export type AddMemButtonComponent = React.FunctionComponent<AddMemButtonProps>;

export const AddMemButton: AddMemButtonComponent = (): JSX.Element => {
    const { folder } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();
    const handleAdd = () => setFormOpen({ ...newMem(), folders: folder ? [folder] : [] });
    const [formOpen, setFormOpen] = useState<false | MemType>(false);

    useEffect(() => {
        setFormOpen(searchParams.get("create") !== null ? newMem() : false);
    }, [searchParams.get("create")]);

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
