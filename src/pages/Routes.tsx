import React from "react";
import { Route, Routes as RRDRoutes } from "react-router-dom";

import { HomePage } from "./HomePage";
import { ImportBackupPage } from "./ImportBackupPage";
import { LearnPage } from "./LearnPage";
import { MemsPage } from "./MemsPage";
import { SettingsPage } from "./SettingsPage";

export type RoutesProps = {};

export type RoutesComponent = React.FunctionComponent<RoutesProps>;

export const Routes: RoutesComponent = (): JSX.Element => {
    return (
        <RRDRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mems/:folder?" element={<MemsPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/importbackup" element={<ImportBackupPage />} />
        </RRDRoutes>
    );
};
