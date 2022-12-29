import React from "react";

import { Typography, TypographyProps } from "@mui/material";

import { Furigana } from "./japanese/Furigana";
import { MemType } from "./store";

type MemRequired = "mem" | "furigana";

export type MemProps = {
    mem: Partial<Omit<MemType, MemRequired>> & Pick<MemType, MemRequired>;
} & TypographyProps;

export type MemComponent = React.FunctionComponent<MemProps>;

export const Mem: MemComponent = ({ mem: { mem, furigana }, ...typoProps }): JSX.Element => {
    return (
        <Typography {...typoProps}>
            {furigana && furigana.length ? <Furigana furigana={furigana}>{mem}</Furigana> : mem}
        </Typography>
    );
};
