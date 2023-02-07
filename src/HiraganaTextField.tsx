import { TextField, TextFieldProps } from "@mui/material";
import React, { useEffect, useRef } from "react";
import * as wanakana from "wanakana";

export type HiraganaTextFieldComponent = React.FunctionComponent<Omit<TextFieldProps, "inputRef">>;

export const HiraganaTextField: HiraganaTextFieldComponent = (props): JSX.Element => {
    const hiraganaInputRef = useRef<HTMLInputElement>();

    useEffect(() => {
        if (hiraganaInputRef.current) {
            const ref = hiraganaInputRef.current;
            wanakana.bind(ref);
            return () => wanakana.unbind(ref);
        }
    }, [hiraganaInputRef.current]);

    return (
        <TextField
            helperText="Text automatically converted to hiragana"
            {...(props as any)}
            inputRef={hiraganaInputRef}
        />
    );
};
