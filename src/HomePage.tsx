import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, ButtonGroup, Divider } from "@mui/material";

import { ImportMems } from "./ImportMems";

const downloadAllMems = () =>
    Object.assign(document.createElement("a"), {
        href: `data:application/JSON, ${encodeURIComponent(JSON.stringify(localStorage.getItem("memup")))}`,
        download: "your_history",
    }).click();

export type HomePageProps = {};

export type HomePageComponent = React.FunctionComponent<HomePageProps>;

export const HomePage: HomePageComponent = (): JSX.Element => {
    const [importOpen, setImportOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <>
            <ImportMems open={importOpen} onClose={() => setImportOpen(false)} />
            <Box sx={{ textAlign: "center" }}>
                <ButtonGroup variant="contained">
                    <Button onClick={() => navigate("/learn")}>Learn</Button>
                    <Divider orientation="vertical" flexItem />
                    <Button onClick={() => navigate("/mems")}>List Mems</Button>
                    <Divider orientation="vertical" flexItem />
                    <Button onClick={downloadAllMems}>Export Mems</Button>
                    <Button onClick={() => setImportOpen(true)}>Import Mems</Button>
                </ButtonGroup>
            </Box>
        </>
    );
};
