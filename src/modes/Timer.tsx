import React from "react";

import AlarmIcon from "@mui/icons-material/Alarm";
import { Alert, LinearProgress, Stack } from "@mui/material";

export type TimerProps = {
    time: number;
    maxTime: number;
    onClick?: (ev: React.SyntheticEvent) => void;
};

export type TimerComponent = React.FunctionComponent<TimerProps>;

export const Timer: TimerComponent = ({ time, maxTime, onClick = () => {} }): JSX.Element => {
    return (
        <Stack direction="row" spacing={4}>
            <LinearProgress
                variant="determinate"
                color={time > 0 ? "primary" : "error"}
                value={(time / maxTime) * 100}
                sx={{ flex: 1, marginTop: "1.1em", height: "0.5em" }}
            />
            <Alert
                severity={time > 0 ? "info" : "error"}
                icon={<AlarmIcon />}
                sx={{ cursor: "pointer" }}
                onClick={onClick}
            >
                {time}s
            </Alert>
        </Stack>
    );
};
