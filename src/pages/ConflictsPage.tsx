import React from "react";
import { HomeButton } from "./buttons/HomeButton";
import { ContentBox } from "./ContentBox";

export type ConflictsPageProps = {};

export type ConflictsPageComponent = React.FunctionComponent<ConflictsPageProps>;

export const ConflictsPage: ConflictsPageComponent = (): JSX.Element => {
    return (
        <ContentBox>
            <HomeButton />
            Conflicts here
        </ContentBox>
    );
};
