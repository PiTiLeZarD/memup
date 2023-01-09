import create from "zustand";
import { combine, devtools, persist } from "zustand/middleware";

export type NanoID = string;

export type AppSettings = {
    furiganaMode: "Romaji" | "Furigana" | "Kanji" | "Hiragana";
    countdownSeconds: number;
    kanjiDefSource: "jisho.org" | "classic.jisho.org";
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
    folders: string[];
    description: string;
    hint?: string;
    notes?: string;
    furigana?: string[];
    checks: MemAnswer[];
};

export type StorePropsType = {
    mems: MemType[];
    learnContext: MemType[];
    settings: AppSettings;
};

export type StoreActionsPropsType = {
    saveMem: (mem: MemType) => void;
    setLearnContext: (mems: MemType[]) => void;
    deleteMem: (mem: MemType) => void;
    addAnswer: (memId: string, check: MemAnswer) => void;
    set: (newSettings: Partial<AppSettings>) => void;
};

const InitialState: StorePropsType = {
    mems: [],
    learnContext: [],
    settings: {
        furiganaMode: "Furigana",
        countdownSeconds: 10,
        kanjiDefSource: "jisho.org",
    },
};

const StoreActions = (set: Function, get: Function): StoreActionsPropsType => ({
    saveMem: (mem) => set(({ mems }) => ({ mems: [...mems.filter((m: MemType) => m.id != mem.id), mem] })),
    setLearnContext: (mems) => set(() => ({ learnContext: mems })),
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

export const memsToStore = (mems: MemType[]): { state: Pick<StorePropsType, "mems"> } => ({ state: { mems } });

const store = persist(combine(InitialState, StoreActions), {
    name: "memup",
    deserialize: (s: string) => {
        const storage: { state: useStorePropsType; version: number } = JSON.parse(s);

        storage.state.mems = storage.state.mems.map((m) => ({
            ...m,
            checks: (m.checks || []).map((c) => ({ ...c, date: new Date(c.date as any) })),
        }));

        return storage;
    },
    partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !["learnContext"].includes(key))),
});

export const useStore =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? create<useStorePropsType, [["zustand/devtools", never], ["zustand/persist", useStorePropsType]]>(
              /** @ts-ignore */
              devtools(store)
          )
        : /** @ts-ignore */
          create<useStorePropsType, [["zustand/persist", useStorePropsType]]>(store);
