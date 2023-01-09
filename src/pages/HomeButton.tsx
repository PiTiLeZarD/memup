import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import { Fab } from "@mui/material";

export type HomeButtonProps = {};

export type HomeButtonComponent = React.FunctionComponent<HomeButtonProps>;

export const HomeButton: HomeButtonComponent = (): JSX.Element => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    if (pathname == "/") return <></>;

    return (
        <Fab color="primary" onClick={() => navigate("/")} sx={{ position: "absolute", top: "-30px", left: "-25px" }}>
            <HomeIcon />
        </Fab>
    );
};
