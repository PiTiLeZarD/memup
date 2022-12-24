import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@mui/material";

export type BackButtonProps = {};

export type BackButtonComponent = React.FunctionComponent<BackButtonProps>;

export const BackButton: BackButtonComponent = (): JSX.Element => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    if (pathname == "/") return <></>;

    return (
        <Button variant="contained" onClick={() => navigate("/")}>
            &lt;-- Back
        </Button>
    );
};
