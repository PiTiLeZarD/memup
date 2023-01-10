import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs, Chip } from "@mui/material";

import { memScore } from "../lib";
import { FOLDER_SEP, MemFolders } from "../MemFolders";
import { MemList } from "../MemList";
import { useStore } from "../store";
import { AddMemButton } from "./buttons/AddMemButton";
import { BackButton } from "./buttons/BackButton";
import { HomeButton } from "./buttons/HomeButton";
import { SearchMemButton } from "./buttons/SearchMemButton";
import { ContentBox } from "./ContentBox";

export type MemsPageProps = {};

export type MemsPageComponent = React.FunctionComponent<MemsPageProps>;

export const MemsPage: MemsPageComponent = (): JSX.Element => {
    const { folders } = useParams();

    const navigate = useNavigate();

    const depth = !!folders ? folders.split(FOLDER_SEP).length : 0;
    const mems = useStore(({ mems }) => mems)
        .filter((m) => m.folders.join(FOLDER_SEP).includes(folders || ""))
        .sort(
            (ma, mb) =>
                ((memScore(ma).nextCheck || new Date()) as any) - ((memScore(mb).nextCheck || new Date()) as any)
        )
        .reduce((acc, m) => ({ ...acc, [m.folders[depth]]: [...(acc[m.folders[depth]] || []), m] }), {});

    const handleBreadcrumbClick = (depth: number) => () =>
        navigate(`/mems/${(folders?.split(FOLDER_SEP) || []).slice(0, depth).join(FOLDER_SEP)}`);

    return (
        <ContentBox>
            <HomeButton />
            {folders && <BackButton />}

            <AddMemButton />
            <SearchMemButton />

            <Breadcrumbs sx={{ marginBottom: "1em" }}>
                <Chip label="/" onClick={() => navigate("/mems")} />
                {folders?.split(FOLDER_SEP).map((folder, i) => (
                    <Chip key={folder} onClick={handleBreadcrumbClick(i + 1)} label={folder} />
                ))}
            </Breadcrumbs>

            <MemFolders subfolders={mems} />
            <MemList mems={mems["undefined"] || []} />
        </ContentBox>
    );
};
