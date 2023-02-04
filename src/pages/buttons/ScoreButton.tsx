import React, { useState } from "react";

import { Fab, Snackbar } from "@mui/material";

import { memScore } from "../../lib";
import { MemType, useStore } from "../../store";

const progressBar = (emoji: string, pct: number, maxSize = 8) => {
    const count = Math.round(pct * maxSize);
    return [...new Array(count).fill(emoji), ...new Array(maxSize - count).fill("⬛")].join("");
};

const userScore = (mems: MemType[]) =>
    mems.reduce((score, mem) => score + memScore(mem).level + mem.checks.filter((c) => !!c.success).length, 0);

export type ScoreButtonProps = {};

export type ScoreButtonComponent = React.FunctionComponent<ScoreButtonProps>;

export const ScoreButton: ScoreButtonComponent = (): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false);
    const mems = useStore(({ mems }) => mems);
    const score = userScore(mems);

    const allLevels = mems.reduce<{ [k: string]: number }>((acc, mem) => {
        const score = memScore(mem);
        const k = score.level == 0 ? "NEW" : score.memory;
        return { ...acc, [k]: (acc[k] || 0) + 1 };
    }, {});

    const [totalSuccess, totalFailure] = mems.reduce<number[]>(
        ([s, f], mem) => [
            s + mem.checks.filter((c) => !!c.success).length,
            f + mem.checks.filter((c) => !c.success).length,
        ],
        [0, 0]
    );

    const handleClick = () => {
        let msg = [`My score on memup: ${score}`];
        msg.push(`${totalSuccess} successes / ${totalFailure} failures`);
        msg.push(`${progressBar("⬜", allLevels.NEW / mems.length)} ${allLevels.NEW} new mems`);
        msg.push(`${progressBar("🟦", allLevels.ST / mems.length)} ${allLevels.ST} short term memory`);
        msg.push(`${progressBar("🟩", allLevels.LT / mems.length)} ${allLevels.LT} long term memory`);
        navigator.clipboard.writeText(msg.join("\n"));
        setOpen(true);
    };

    return (
        <>
            <Fab
                size="large"
                color="primary"
                variant="extended"
                onClick={handleClick}
                sx={{ position: "absolute", top: "-25px", right: "-25px" }}
            >
                {score} points
            </Fab>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message="Copied to clipboard"
            />
        </>
    );
};
