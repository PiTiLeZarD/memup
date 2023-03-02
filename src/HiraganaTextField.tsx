import React, { useEffect, useRef, useState } from "react";
import * as wanakana from "wanakana";

import { Button, InputAdornment, TextField, TextFieldProps } from "@mui/material";

export type HiraganaTextFieldProps = {
    romaji?: boolean;
    defaultRomaji?: boolean;
} & Omit<TextFieldProps, "inputRef">;

export type HiraganaTextFieldComponent = React.FunctionComponent<HiraganaTextFieldProps>;

export const HiraganaTextField: HiraganaTextFieldComponent = ({
    romaji = false,
    defaultRomaji = false,
    ...props
}): JSX.Element => {
    const [isHiragana, setisHiragana] = useState<boolean>(!(romaji && defaultRomaji));
    const hiraganaInputRef = useRef<HTMLInputElement>();

    useEffect(() => {
        if (hiraganaInputRef.current) {
            const ref = hiraganaInputRef.current;
            wanakana.bind(ref);
            return () => wanakana.unbind(ref);
        }
    }, [hiraganaInputRef.current]);

    const handleClick = () => {
        if (romaji) {
            setisHiragana(!isHiragana);
        }
    };

    return (
        <TextField
            helperText={isHiragana ? "Text automatically converted to hiragana" : undefined}
            {...(props as any)}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Button onClick={handleClick}>{isHiragana ? "あ" : "ABC"}</Button>
                    </InputAdornment>
                ),
                ...props.InputProps,
            }}
            inputRef={isHiragana ? hiraganaInputRef : undefined}
        />
    );
};
