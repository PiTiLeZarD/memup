import React from "react";

import { Paper } from "@mui/material";
import { lightBlue } from "@mui/material/colors";

export type ContentBoxProps = {};

export type ContentBoxComponent = React.FunctionComponent<React.PropsWithChildren<ContentBoxProps>>;

export const ContentBox: ContentBoxComponent = ({ children }): JSX.Element => {
    return (
        <Paper
            elevation={8}
            sx={{
                position: "relative",
                borderRadius: "25px",
                padding: "2em",
                margin: "2em",
                border: `3px solid ${lightBlue[400]}`,
            }}
        >
            {children}
        </Paper>
    );
};
