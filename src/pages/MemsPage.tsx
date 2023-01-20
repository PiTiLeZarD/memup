import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs, Chip } from "@mui/material";

import { EmptyMems } from "../EmptyMems";
import { memScore, sortByDate } from "../lib";
import { FOLDER_SEP, MemFolders } from "../MemFolders";
import { MemList } from "../MemList";
import { MemType, useStore } from "../store";
import { AddMemButton } from "./buttons/AddMemButton";
import { BackButton } from "./buttons/BackButton";
import { HomeButton } from "./buttons/HomeButton";
import { ContentBox } from "./ContentBox";

const withDepth: (folder: string | undefined, depth: number) => string = (folder, depth) =>
    (folder || "").split(FOLDER_SEP).slice(0, depth).join(FOLDER_SEP);

const atDepth: (folder: string | undefined, depth: number) => string = (folder, depth) =>
    (folder || "").split(FOLDER_SEP)[depth];

export type MemsPageProps = {};

export type MemsPageComponent = React.FunctionComponent<MemsPageProps>;

export const MemsPage: MemsPageComponent = (): JSX.Element => {
    const navigate = useNavigate();
    const { folder } = useParams();
    const depth = !!folder ? folder.split(FOLDER_SEP).length : 0;

    const mems = sortByDate(
        useStore(({ mems }) => mems).filter((m) => m.folders.filter((f) => f.startsWith(folder || "")).length > 0),
        (m) => memScore(m).nextCheck
    )
        .reverse()
        .reduce<{ [folder: string]: MemType[] }>((acc, m) => {
            m.folders
                .filter((f) => f.startsWith(folder || ""))
                .forEach((f) => (acc[atDepth(f, depth)] = [...(acc[atDepth(f, depth)] || []), m]));
            return acc;
        }, {});

    const handleBreadcrumbClick = (depth: number) => () =>
        navigate(`/mems/${(folder?.split(FOLDER_SEP) || []).slice(0, depth).join(FOLDER_SEP)}`);

    return (
        <ContentBox>
            <HomeButton />
            {folder && <BackButton />}

            <AddMemButton />

            <Breadcrumbs sx={{ marginBottom: "1em" }}>
                <Chip label="/" onClick={() => navigate("/mems")} />
                {folder?.split(FOLDER_SEP).map((folder, i) => (
                    <Chip key={folder} onClick={handleBreadcrumbClick(i + 1)} label={folder} />
                ))}
            </Breadcrumbs>

            <MemFolders subfolders={mems} />
            <MemList mems={mems["undefined"] || []} />

            {Object.keys(mems).length == 0 && <EmptyMems />}
        </ContentBox>
    );
};
