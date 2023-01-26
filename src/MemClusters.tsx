import React, { useState } from "react";

import { Box, Chip, Stack, Switch, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";

import { lightBlue, orange } from "@mui/material/colors";
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

const DAY = 24 * 60 * 60000;
const MAX_DIFF_SHORT = 2 * DAY;
const MAX_DIFF_LONG = 8 * DAY;

export type MemClustersComponent = React.FunctionComponent<MemClustersProps>;

export const MemClusters: MemClustersComponent = ({ mems }): JSX.Element => {
    const smallScreenFactor = useMediaQuery(useTheme().breakpoints.down("md")) ? 2 : 1;
    const [maxDiff, setMaxDiff] = useState<number>(MAX_DIFF_SHORT);

    const memsToCluster = mems.filter(
        (m) =>
            (m.checks || []).length > 0 &&
            memScore(m).nextCheck > new Date() &&
            -dateDiff(memScore(m).nextCheck) < maxDiff / smallScreenFactor
    );
    const clusters = clusterByDate(memsToCluster, (mem) => memScore(mem).nextCheck);

    if (clusters.length == 0) return <></>;

    const left = (d: Date) => ((-dateDiff(d) > 0 ? -dateDiff(d) : 0) / (maxDiff / smallScreenFactor)) * 100;

    return (
        <Stack spacing={2}>
            <Typography>
                {memsToCluster.length} Mems will be available as follows: (upcoming {maxDiff / smallScreenFactor / DAY}{" "}
                days)
            </Typography>
            <Box sx={{ position: "relative", width: "100%", height: "3em" }}>
                <Switch
                    size="small"
                    sx={{ position: "absolute", top: "-0.5em", right: 0 }}
                    onChange={(ev) => setMaxDiff(ev.target.checked ? MAX_DIFF_LONG : MAX_DIFF_SHORT)}
                />
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
                <Box sx={{ position: "absolute", bottom: "-1em", left: 0 }}>Now</Box>
                <Box sx={{ position: "absolute", bottom: "-1em", left: "50%", transform: "translateX(-50%)" }}>
                    +{maxDiff / smallScreenFactor / (2 * DAY)}days
                </Box>
                <Box sx={{ position: "absolute", bottom: "-1em", right: 0 }}>
                    +{maxDiff / smallScreenFactor / DAY}days
                </Box>
                {maxDiff == MAX_DIFF_LONG && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 2,
                            width: `${(MAX_DIFF_SHORT / MAX_DIFF_LONG) * 100}%`,
                            height: "3em",
                            background: orange[100],
                            opacity: 0.5,
                        }}
                    />
                )}
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
