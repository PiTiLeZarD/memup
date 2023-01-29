import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { MemFormFields } from "./MemFormFields";
import { MemType, useStore } from "./store";

type FormState = {
    mem: string;
    description: string;
    furigana: string;
    folders: string;
    hint: string;
};

export type MemFormProps = {
    mem: MemType;
    FieldsWrapper: React.ElementType;
    [k: string]: any;
};

const mem2Form = ({ mem, description, hint, furigana, folders }: MemType): FormState => ({
    mem,
    description,
    furigana: JSON.stringify(furigana || ""),
    folders: JSON.stringify(folders || ""),
    hint: hint || "",
});

export type MemFormComponent = React.FunctionComponent<MemFormProps>;

export const MemForm: MemFormComponent = ({ mem, FieldsWrapper, ...wrapperProps }): JSX.Element => {
    if (!mem) return <></>;

    const { register, handleSubmit, reset, watch, setValue } = useForm<FormState>({
        defaultValues: mem2Form(mem),
    });

    useEffect(() => {
        reset(mem2Form(mem));
    }, [mem]);

    const saveMem = useStore(({ saveMem }) => saveMem);

    const handleSave = ({ mem: memValue, description, hint, furigana, folders }) => {
        saveMem({
            ...mem,
            mem: memValue,
            description,
            furigana: furigana ? JSON.parse(furigana) : null,
            folders: folders ? JSON.parse(folders) : [],
            hint: hint || null,
        });
    };

    return (
        <form onSubmit={handleSubmit(handleSave)}>
            <FieldsWrapper onSubmit={handleSubmit(handleSave)} {...wrapperProps}>
                <MemFormFields
                    watch={watch}
                    setValue={setValue}
                    register={register}
                    mem={mem}
                    pickMem={(m) => reset(mem2Form(m))}
                />
            </FieldsWrapper>
        </form>
    );
};
