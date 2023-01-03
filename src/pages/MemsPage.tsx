import { Button } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

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

    return (
        <ContentBox>
            <BackButton />
            <Button variant="contained" onClick={handleAdd}>
                Add a mem
            </Button>

            <MemForm open={formOpen} onClose={() => setFormOpen(false)} />
            <MemFolders subfolders={mems} />
            <MemList mems={mems["undefined"] || []} setFormOpen={setFormOpen} />
        </ContentBox>
    );
};
