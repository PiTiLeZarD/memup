import create from "zustand";
import { combine, devtools, persist } from "zustand/middleware";

export type NanoID = string;

export type AppSettings = {
    furiganaMode: "Furigana" | "Kanji" | "Hiragana";
};

export type MemScore = {
    score: number;
    memory: "LT" | "ST";
    nextCheck: Date;
};

export type MemCheckType = {
    date: Date;
    result: number;
};

export type MemType = {
    id: NanoID;
    mem: string;
    description: string;
    hint?: string;
    notes?: string;
    furigana?: string[];
    checks: MemCheckType[];
};

export type StorePropsType = {
    mems: MemType[];
    settings: AppSettings;
};

export type StoreActionsPropsType = {
    saveMem: (mem: MemType) => void;
    deleteMem: (mem: MemType) => void;
    set: (newSettings: Partial<AppSettings>) => void;
};

const InitialState: StorePropsType = {
    mems: [],
    settings: {
        furiganaMode: "Furigana",
    },
};

const StoreActions = (set: Function, get: Function): StoreActionsPropsType => ({
    saveMem: (mem) => set(({ mems }) => ({ mems: [...mems.filter((m: MemType) => m.id != mem.id), mem] })),
    deleteMem: (mem) => set(({ mems }) => ({ mems: mems.filter((m: MemType) => m.id != mem.id) })),
    set: (newSettings) => set(({ settings }) => ({ settings: { ...settings, ...newSettings } })),
});

export type useStorePropsType = StorePropsType & StoreActionsPropsType;

const store = persist(combine(InitialState, StoreActions), { name: "memup" });

export const useStore =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? create<useStorePropsType, [["zustand/devtools", never], ["zustand/persist", useStorePropsType]]>(
              devtools(store)
          )
        : create<useStorePropsType, [["zustand/persist", useStorePropsType]]>(store);
