import { SxProps, Theme, useTheme } from "@mui/material";

export type ClassesStyle = {
    [k: string]: SxProps;
};

const isObject = (item: any): item is object => item && typeof item === "object" && !Array.isArray(item);

const mergeDeep = (target: object, ...sources: object[]): object => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
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
        return mergeDeep(
            classes as object,
            ...(variantClasses as object[]),
            ...(extendWith.map((e) => (typeof e == "function" ? e(theme) : e)) as object[])
        ) as ClassesStyle;
    };

type useVariantFn = (styles: ClassesStyle, key: string, variant: string) => SxProps;

export const useVariant: useVariantFn = (styles, key, variant) =>
    mergeDeep({ ...(styles[key] || {}) }, styles[`${key}_${variant}`] || {});
