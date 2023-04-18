import { SxProps, Theme, useTheme } from "@mui/material";

export type ClassesStyle = {
    [k: string]: SxProps;
};

const isObject = (item: any): item is object => item && typeof item === "object" && !Array.isArray(item);

const mergeDeep = <T extends object = {}>(...objs: Readonly<T>[]): T => {
    const ret = {} as T;

    objs.forEach((o) => {
        if (o && isObject(o))
            Object.keys(o).forEach((k) => {
                if (isObject(o[k])) {
                    if (isObject(ret[k])) {
                        ret[k] = mergeDeep(ret[k], o[k]);
                    } else {
                        ret[k] = { ...o[k] };
                    }
                } else {
                    ret[k] = o[k];
                }
            });
    });

    return ret;
};

type makeStylesFn = (
    stylesFn: (theme: Theme) => ClassesStyle,
    variants?: string[]
) => (...extendWith: (ClassesStyle | ((theme: Theme) => ClassesStyle))[]) => ClassesStyle;

export const makeStyles: makeStylesFn =
    (stylesFn, variants) =>
    (...extendWith) => {
        const theme = useTheme();
        const classes = stylesFn(theme);
        const variantClasses = variants
            ? variants.map((variant) =>
                  Object.fromEntries(Object.keys(classes).map((key) => [`${key}_${variant}`, {}]))
              )
            : [];
        return mergeDeep<ClassesStyle>(
            classes,
            ...variantClasses,
            ...extendWith.map((e) => (typeof e == "function" ? e(theme) : e))
        );
    };

type useVariantFn = (styles: Readonly<ClassesStyle>, key: string, variants: string | string[]) => SxProps;

export const useVariant: useVariantFn = (styles, key, variants) =>
    mergeDeep<NonNullable<SxProps>>(
        styles[key] || {},
        ...(typeof variants === "string" ? [variants] : variants).map((v) => styles[`${key}_${v}`] || {})
    );
