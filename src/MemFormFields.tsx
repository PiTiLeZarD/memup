import React, { useEffect, useState } from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

import ColorizeIcon from "@mui/icons-material/Colorize";
import { Button, IconButton, Stack, TextField } from "@mui/material";

import { FoldersInput } from "./FoldersInput";
import { FuriganaInput } from "./japanese/FuriganaInput";
import { includesKanji } from "./lib";
import { SearchMemButton } from "./pages/buttons/SearchMemButton";
import { MemType } from "./store";

export type MemFormFieldsProps = {
    mem: MemType;
    pickMem: (mem: MemType) => void;
    watch: UseFormWatch<any>;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
};

export type MemFormFieldsComponent = React.FunctionComponent<MemFormFieldsProps>;

export const MemFormFields: MemFormFieldsComponent = ({ mem, watch, register, setValue, pickMem }): JSX.Element => {
    const memValue = watch("mem");
    const hasKanji = includesKanji(memValue);

    const [setFurigana, setSetFurigana] = useState<boolean>(false);

    useEffect(() => {
        setSetFurigana((mem.furigana || []).length > 0);
    }, [mem]);

    return (
        <Stack spacing={2} sx={{ margin: "0.5em 0" }}>
            <FoldersInput watch={watch} register={register} setValue={setValue} />
            <Stack direction="row" sx={{ width: "100%" }}>
                <TextField label="Mem" {...register("mem")} required fullWidth />
                {hasKanji && (
                    <Button
                        color={setFurigana ? "primary" : "inherit"}
                        variant="contained"
                        onClick={() => setSetFurigana(!setFurigana)}
                    >
                        +あ
                    </Button>
                )}
                <SearchMemButton
                    defaultSearch={memValue}
                    Component={Button}
                    ComponentProps={{ color: "primary", variant: "contained" }}
                    actions={[
                        {
                            child: <ColorizeIcon />,
                            Component: IconButton,
                            action: (m, close) => {
                                close();
                                pickMem({
                                    ...m,
                                    folders: [...m.folders, ...mem.folders],
                                });
                            },
                        },
                    ]}
                />
            </Stack>
            {hasKanji && setFurigana && (
                <FuriganaInput
                    memValue={memValue}
                    furigana={mem.furigana || []}
                    register={register}
                    setValue={setValue}
                />
            )}
            <TextField label="Description" {...register("description")} required />
            <TextField label="Hint" {...register("hint")} />
        </Stack>
    );
};
