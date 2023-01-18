import React from "react";

import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";

import { lightBlue } from "@mui/material/colors";
import { clusterByDate, dateDiff, memScore, timeUntil } from "./lib";
import { MemType } from "./store";

export type MemClustersProps = {
    mems: MemType[];
};

const markerStyles = {
    position: "absolute",
    top: "0",
    height: "3em",
    background: lightBlue[900],
    transform: "translateX(-50%)",
    zIndex: 1,
};

export type MemClustersComponent = React.FunctionComponent<MemClustersProps>;

export const MemClusters: MemClustersComponent = ({ mems }): JSX.Element => {
    const maxDiff = 2 * 24 * 60 * 60000;
    const clusters = clusterByDate(
        mems.filter(
            (m) =>
                (m.checks || []).length > 0 &&
                memScore(m).nextCheck > new Date() &&
                -dateDiff(memScore(m).nextCheck) < maxDiff
        ),
        (mem) => memScore(mem).nextCheck
    );

    if (clusters.length == 0) return <></>;

    const left = (d: Date) => ((-dateDiff(d) > 0 ? -dateDiff(d) : 0) / maxDiff) * 100;

    return (
        <Stack spacing={2}>
            <Typography>Mems will be available as follows: (upcoming 2 days)</Typography>
            <Box sx={{ position: "relative", width: "100%", height: "3em" }}>
                {clusters
                    .map((c) => [memScore(c[c.length - 1]).nextCheck, c.length])
                    .map(([nextCheck, count], i) => (
                        <Tooltip
                            arrow
                            key={i}
                            title={`${timeUntil(nextCheck as Date)}`}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: `${left(nextCheck as Date)}%`,
                                transform: "translateY(-50%)",
                                background: lightBlue[800],
                                color: lightBlue[50],
                                zIndex: clusters.length - i + 100,
                            }}
                        >
                            <Chip label={String(count)} />
                        </Tooltip>
                    ))}
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
                        zIndex: 1,
                    }}
                />
                <Box
                    sx={{
                        ...markerStyles,
                        left: "50%",
                        width: "4px",
                    }}
                />
                <Box
                    sx={{
                        ...markerStyles,
                        left: "25%",
                        width: "2px",
                    }}
                />
                <Box
                    sx={{
                        ...markerStyles,
                        left: "75%",
                        width: "2px",
                    }}
                />
                <Box
                    sx={{
                        ...markerStyles,
                        left: "12.5%",
                        width: "1px",
                        height: "2em",
                        top: "0.5em",
                    }}
                />
                <Box
                    sx={{
                        ...markerStyles,
                        left: "37.5%",
                        width: "1px",
                        height: "2em",
                        top: "0.5em",
                    }}
                />
                <Box
                    sx={{
                        ...markerStyles,
                        left: "62.5%",
                        width: "1px",
                        height: "2em",
                        top: "0.5em",
                    }}
                />
                <Box
                    sx={{
                        ...markerStyles,
                        left: "87.5%",
                        width: "1px",
                        height: "2em",
                        top: "0.5em",
                    }}
                />
            </Box>
        </Stack>
    );
};
