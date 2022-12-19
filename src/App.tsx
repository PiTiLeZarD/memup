import React from "react";
import { Furigana } from "./Furigana";

export type AppProps = {};

export type AppComponent = React.FunctionComponent<AppProps>;

export const App: AppComponent = (): JSX.Element => {
    return (
        <div>
            <Furigana furigana={["だれ", "ほん", "わたし", "にほんご", "ほん"]}>
                誰の本ですか。これわ私の日本語の本！
            </Furigana>
        </div>
    );
};
