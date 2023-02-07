import React, { useEffect, useRef } from "react";
import * as wanakana from "wanakana";

import { InputAdornment, TextField, TextFieldProps } from "@mui/material";

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
            InputProps={{
                endAdornment: <InputAdornment position="end">あ</InputAdornment>,
            }}
            {...(props as any)}
            inputRef={hiraganaInputRef}
        />
    );
};
