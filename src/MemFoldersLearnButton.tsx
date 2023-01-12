import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";

import { memDeck } from "./lib";
import { MemType, useStore } from "./store";

export type MemFoldersLearnButtonProps = {
    subfolder: string;
    subfolders: { [k: string]: MemType[] };
};

export type MemFoldersLearnButtonComponent = React.FunctionComponent<MemFoldersLearnButtonProps>;

export const MemFoldersLearnButton: MemFoldersLearnButtonComponent = ({ subfolders, subfolder }): JSX.Element => {
    const navigate = useNavigate();
    const setLearnContext = useStore(({ setLearnContext }) => setLearnContext);
    const { learnNewCount } = useStore(({ settings }) => settings);

    const mems = subfolders[subfolder];
    const reviseMems = memDeck(mems.filter((m) => !!m.checks.length));
    const learnMems = mems.filter((m) => !m.checks.length);

    if (!reviseMems.length && !learnMems.length) return <></>;

    const handleLearn = () => {
        setLearnContext(reviseMems.length ? reviseMems : memDeck(learnMems).slice(0, learnNewCount));
        navigate(`/learn`);
    };

    return (
        <Button variant="contained" onClick={handleLearn} size="large" sx={{ borderRadius: "10px", margin: "0 5px" }}>
            {reviseMems.length ? "Revise" : "Learn"}
        </Button>
    );
};
