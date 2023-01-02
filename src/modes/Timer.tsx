import React from "react";

import AlarmIcon from "@mui/icons-material/Alarm";
import { Alert, LinearProgress, Stack } from "@mui/material";
import { useStore } from "../store";

export type TimerProps = {
    time: number;
};

export type TimerComponent = React.FunctionComponent<TimerProps>;

export const Timer: TimerComponent = ({ time }): JSX.Element => {
    const { countdownSeconds } = useStore(({ settings }) => settings);
    return (
        <Stack direction="row" spacing={4}>
            <LinearProgress
                variant="determinate"
                color={time > 0 ? "primary" : "error"}
                value={(time / countdownSeconds) * 100}
                sx={{ flex: 1, marginTop: "1.1em", height: "0.5em" }}
            />
            <Alert severity={time > 0 ? "info" : "error"} icon={<AlarmIcon />}>
                {time}s
            </Alert>
        </Stack>
    );
};
