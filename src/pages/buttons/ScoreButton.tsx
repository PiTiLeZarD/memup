import React, { useState } from "react";

import { Fab, Snackbar } from "@mui/material";

import { levelGapMap, memScore } from "../../lib";
import { MemType, useStore } from "../../store";

const progressBar = (emoji: string, pct: number, maxSize = 15) =>
    new Array(Math.round(pct * maxSize)).fill(emoji).join("");

const userScore = (mems: MemType[]) =>
    mems.reduce((score, mem) => score + memScore(mem).level + mem.checks.filter((c) => !!c.success).length, 0);

export type ScoreButtonProps = {};

export type ScoreButtonComponent = React.FunctionComponent<ScoreButtonProps>;

export const ScoreButton: ScoreButtonComponent = (): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false);
    const mems = useStore(({ mems }) => mems);
    const score = userScore(mems);

    if (mems.length == 0) return <></>;

    const allLevels = mems.reduce<{ [k: string]: number }>(
        (acc, mem) => {
            const score = memScore(mem);
            const k =
                score.level == 0 ? "NEW" : score.level > Object.keys(levelGapMap).length ? "MASTERED" : score.memory;
            return { ...acc, [k]: (acc[k] || 0) + 1 };
        },
        { NEW: 0, ST: 0, LT: 0, MASTERED: 0 }
    );
    const learningCount = Object.values(allLevels).reduce<number>((s, v) => v + s, 0) - allLevels.NEW;

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
        msg.push(`Learning ${learningCount} mems, ${allLevels.NEW} left to study`);
        if (allLevels.MASTERED) {
            msg.push(`${allLevels.MASTERED} mastered`);
        }
        msg.push(
            `${progressBar("🟦", allLevels.ST / learningCount)}${progressBar(
                "🟨",
                allLevels.LT / learningCount
            )}${progressBar("🟩", allLevels.MASTERED / learningCount)}`
        );
        setOpen(true);
        navigator.clipboard.writeText(msg.join("\n"));
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
