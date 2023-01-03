import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs, Button, Chip } from "@mui/material";

import { memScore, newMem } from "../lib";
import { FOLDER_SEP, MemFolders } from "../MemFolders";
import { MemForm } from "../MemForm";
import { MemList } from "../MemList";
import { MemType, useStore } from "../store";
import { BackButton } from "./BackButton";
import { ContentBox } from "./ContentBox";

export type MemsPageProps = {};

export type MemsPageComponent = React.FunctionComponent<MemsPageProps>;

export const MemsPage: MemsPageComponent = (): JSX.Element => {
    const { folders } = useParams();
    const navigate = useNavigate();
    const [formOpen, setFormOpen] = useState<false | MemType>(false);

    const depth = !!folders ? folders.split(FOLDER_SEP).length : 0;
    const mems = useStore(({ mems }) => mems)
        .filter((m) => m.folders.join(FOLDER_SEP).includes(folders || ""))
        .sort(
            (ma, mb) =>
                ((memScore(ma).nextCheck || new Date()) as any) - ((memScore(mb).nextCheck || new Date()) as any)
        )
        .reduce((acc, m) => ({ ...acc, [m.folders[depth]]: [...(acc[m.folders[depth]] || []), m] }), {});

    const handleAdd = () => setFormOpen({ ...newMem(), folders: folders?.split(FOLDER_SEP) || [] });

    const handleBreadcrumbClick = (depth: number) => () =>
        navigate(`/mems/${(folders?.split(FOLDER_SEP) || []).slice(0, depth).join(FOLDER_SEP)}`);

    return (
        <ContentBox>
            <BackButton />

            <Breadcrumbs sx={{ marginBottom: "1em" }}>
                {folders?.split(FOLDER_SEP).map((folder, i) => (
                    <Chip key={folder} onClick={handleBreadcrumbClick(i + 1)} label={folder} />
                ))}
            </Breadcrumbs>

            <Button
                variant="contained"
                onClick={handleAdd}
                size="large"
                sx={{
                    borderRadius: "25px",
                    position: "absolute",
                    top: "-25px",
                    right: "-25px",
                    height: "60px",
                    boxShadow: 3,
                }}
            >
                Add a mem
            </Button>

            <MemForm open={formOpen} onClose={() => setFormOpen(false)} />
            <MemFolders subfolders={mems} />
            <MemList mems={mems["undefined"] || []} setFormOpen={setFormOpen} />
        </ContentBox>
    );
};
