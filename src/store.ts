import create from "zustand";
import { combine, devtools, persist } from "zustand/middleware";

export type NanoID = string;

export type AppSettings = {
    furiganaMode: "Furigana" | "Kanji" | "Hiragana";
    countdownSeconds: number;
};

export type MemQuizzAnswer = {
    selected?: string;
};

export type MemFlipcardAnswer = {
    quizz: boolean;
    hint: boolean;
};

export type MemAnswer = {
    success: boolean;
    date?: Date;
    time?: number;
} & (MemQuizzAnswer | MemFlipcardAnswer);

export type MemScore = {
    level?: number;
    memory: "LT" | "ST";
    nextCheck: Date;
};

export type MemType = {
    id: NanoID;
    mem: string;
    description: string;
    hint?: string;
    notes?: string;
    furigana?: string[];
    checks: MemAnswer[];
};

export type StorePropsType = {
    mems: MemType[];
    settings: AppSettings;
};

export type StoreActionsPropsType = {
    saveMem: (mem: MemType) => void;
    deleteMem: (mem: MemType) => void;
    addAnswer: (memId: string, check: MemAnswer) => void;
    set: (newSettings: Partial<AppSettings>) => void;
};

const InitialState: StorePropsType = {
    mems: [],
    settings: {
        furiganaMode: "Furigana",
        countdownSeconds: 10,
    },
};

const StoreActions = (set: Function, get: Function): StoreActionsPropsType => ({
    saveMem: (mem) => set(({ mems }) => ({ mems: [...mems.filter((m: MemType) => m.id != mem.id), mem] })),
    deleteMem: (mem) => set(({ mems }) => ({ mems: mems.filter((m: MemType) => m.id != mem.id) })),
    addAnswer: (memId, check) =>
        set(({ mems }) => {
            const i = mems.findIndex((m: MemType) => m.id == memId);
            mems[i].checks.push(check);
            return { mems };
        }),
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
