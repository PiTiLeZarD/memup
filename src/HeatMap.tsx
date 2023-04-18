import { DateTime } from "luxon";
import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";

import { Box, Tooltip, useMediaQuery, useTheme } from "@mui/material";

import { lightGreen } from "@mui/material/colors";
import { ContentBox } from "./pages/ContentBox";
import { useStore } from "./store";

export type HeatMapProps = {};

export type HeatMapComponent = React.FunctionComponent<HeatMapProps>;

const k = (d: DateTime) => d.toFormat("yyyy-MM-dd");
const scaleSize = 11;

const Styles = () => {
    const theme = useTheme();

    return (
        <style type="text/css">{`
            .react-calendar-heatmap text {
                font-size: 10px;
                fill: #aaa;
            }
            .react-calendar-heatmap .react-calendar-heatmap-small-text {
                font-size: 5px;
            }
            .react-calendar-heatmap rect:hover {
                stroke: #555;
                stroke-width: 1px;
            }

            .react-calendar-heatmap .color-scale-0 {
                fill: ${theme.palette.background.paper};
            }
            .react-calendar-heatmap .color-scale-1 {
                fill: ${lightGreen[50]};
            }
            .react-calendar-heatmap .color-scale-2 {
                fill: ${lightGreen[100]};
            }
            .react-calendar-heatmap .color-scale-3 {
                fill: ${lightGreen[200]};
            }
            .react-calendar-heatmap .color-scale-4 {
                fill: ${lightGreen[300]};
            }
            .react-calendar-heatmap .color-scale-5 {
                fill: ${lightGreen[400]};
            }
            .react-calendar-heatmap .color-scale-6 {
                fill: ${lightGreen[500]};
            }
            .react-calendar-heatmap .color-scale-7 {
                fill: ${lightGreen[600]};
            }
            .react-calendar-heatmap .color-scale-8 {
                fill: ${lightGreen[700]};
            }
            .react-calendar-heatmap .color-scale-9 {
                fill: ${lightGreen[800]};
            }
            .react-calendar-heatmap .color-scale-10 {
                fill: ${lightGreen[900]};
            }

        `}</style>
    );
};

export const HeatMap: HeatMapComponent = (): JSX.Element => {
    const smallScreen = useMediaQuery(useTheme().breakpoints.down("md"));
    const mems = useStore(({ mems }) => mems);
    if (mems.length == 0) return <></>;

    const allchecks = mems
        .reduce((acc, m) => [...acc, ...m.checks.map((c) => DateTime.fromJSDate(c.date))], [])
        .reduce((acc, d: DateTime) => ({ ...acc, [k(d)]: (acc[k(d)] || 0) + 1 }), {});

    const maxValue = Math.max(...(Object.values(allchecks) as number[]));
    const factor = maxValue / scaleSize;

    return (
        <ContentBox>
            <Styles />
            <Box sx={{ width: "80%", margin: "auto" }}>
                <CalendarHeatmap
                    startDate={DateTime.now()
                        .minus(smallScreen ? { month: 4 } : { year: 1 })
                        .toJSDate()}
                    endDate={DateTime.now().toJSDate()}
                    values={Object.entries(allchecks).map(([date, count]) => ({ date, count }))}
                    classForValue={(value) =>
                        !value ? "color-scale-0" : `color-scale-${Math.ceil(value.count / factor)}`
                    }
                    transformDayElement={(elt, value, indx) =>
                        value ? <Tooltip title={`${value.count} checks`}>{elt}</Tooltip> : elt
                    }
                />
            </Box>
        </ContentBox>
    );
};
