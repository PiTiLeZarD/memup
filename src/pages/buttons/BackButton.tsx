import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Fab } from "@mui/material";

export type BackButtonProps = {};

export type BackButtonComponent = React.FunctionComponent<BackButtonProps>;

export const BackButton: BackButtonComponent = (): JSX.Element => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    if (pathname == "/") return <></>;

    return (
        <Fab color="primary" onClick={() => navigate(-1)} sx={{ position: "absolute", top: "-30px", left: "35px" }}>
            <ArrowBackIcon />
        </Fab>
    );
};
