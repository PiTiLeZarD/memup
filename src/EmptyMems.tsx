import { Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export type EmptyMemsProps = {};

export type EmptyMemsComponent = React.FunctionComponent<EmptyMemsProps>;

export const EmptyMems: EmptyMemsComponent = (): JSX.Element => {
    const navigate = useNavigate();
    return (
        <Typography sx={{ marginTop: "2em" }}>
            Looks like you've got nothing in here, start by{" "}
            <Button size="small" onClick={() => navigate("/mems?create")}>
                creating
            </Button>{" "}
            or{" "}
            <Button size="small" onClick={() => navigate("/importbackup")}>
                importing mems
            </Button>
            .
        </Typography>
    );
};
