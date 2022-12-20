import React from "react";
import { Furigana } from "./Furigana";
import { MemType } from "./store";

export type MemProps = {
    data: MemType;
};

export type MemComponent = React.FunctionComponent<MemProps>;

export const Mem: MemComponent = ({ data: { id, mem } }): JSX.Element => {
    return (
        <div>
            Mem: {id}, {mem}
            <Furigana furigana={["だれ", "ほん", "わたし", "にほんご", "ほん"]}>
                誰の本ですか。これわ私の日本語の本！
            </Furigana>
        </div>
    );
};
