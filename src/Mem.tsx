import React from "react";

import { Typography } from "@mui/material";

import { Furigana } from "./Furigana";
import { MemType } from "./store";

export type MemProps = {
    data: MemType;
};

export type MemComponent = React.FunctionComponent<MemProps>;

export const Mem: MemComponent = ({ data: { mem, furigana } }): JSX.Element => {
    return (
        <Typography variant="h4">
            {furigana && furigana.length ? <Furigana furigana={furigana}>{mem}</Furigana> : mem}
        </Typography>
    );
};
