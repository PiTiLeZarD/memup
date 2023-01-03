import React from "react";
import { Route, Routes as RRDRoutes } from "react-router-dom";

import { HomePage } from "./HomePage";
import { LearnPage } from "./LearnPage";
import { MemsPage } from "./MemsPage";

export type RoutesProps = {};

export type RoutesComponent = React.FunctionComponent<RoutesProps>;

export const Routes: RoutesComponent = (): JSX.Element => {
    return (
        <RRDRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mems/:folders?" element={<MemsPage />} />
            <Route path="/learn" element={<LearnPage />} />
        </RRDRoutes>
    );
};
