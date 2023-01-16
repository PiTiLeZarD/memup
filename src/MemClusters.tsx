import React from "react";

import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";

import { lightBlue } from "@mui/material/colors";
import { dateDiff, groupMemByDateClusters, memScore, timeUntil } from "./lib";
import { MemType } from "./store";

export type MemClustersProps = {
    mems: MemType[];
};

export type MemClustersComponent = React.FunctionComponent<MemClustersProps>;

export const MemClusters: MemClustersComponent = ({ mems }): JSX.Element => {
    const clusters = groupMemByDateClusters(mems.filter((m) => (m.checks || []).length > 0));
    if (clusters.length == 0) return <></>;

    const dates = clusters
        .map((c) => [c.length, memScore(c[0]).nextCheck])
        .filter(([l, d]) => -dateDiff(d as Date) <= 2 * 24 * 60 * 60000 + 60 * 60000);
    const maxDiff = dates.reduce((acc, [l, d]) => (-dateDiff(d as Date) > acc ? -dateDiff(d as Date) : acc), 0);

    const left = (d: Date) => ((-dateDiff(d) > 0 ? -dateDiff(d) : 0) / maxDiff) * 100;

    return (
        <Stack spacing={2}>
            <Typography>Mems will be available as follows: (upcoming 2 days)</Typography>
            <Box sx={{ position: "relative", width: "100%", height: "3em" }}>
                <Box
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "0.5em",
                        background: lightBlue[200],
                        top: "50%",
                        left: 0,
                        marginRight: "2em",
                        transform: "translateY(-50%)",
                    }}
                />
                {dates.map(([l, d], i) => (
                    <Tooltip
                        arrow
                        key={i}
                        title={`${timeUntil(d as Date)}`}
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: `${left(d as Date)}%`,
                            transform: "translateY(-50%)",
                            background: lightBlue[800],
                            color: lightBlue[50],
                            zIndex: dates.length - i + 100,
                        }}
                    >
                        <Chip label={String(l)} />
                    </Tooltip>
                ))}
            </Box>
        </Stack>
    );
};
