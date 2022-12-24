import React from "react";

export type QuizzPageProps = {};

export type QuizzPageComponent = React.FunctionComponent<QuizzPageProps>;

export const QuizzPage: QuizzPageComponent = (): JSX.Element => {
    return <div>QuizzPage</div>;
};
