import create from "zustand";
import { combine, devtools, persist } from "zustand/middleware";

export type NanoID = string;

export type AppSettings = {
    furiganaMode: "Romaji" | "Furigana" | "Kanji" | "Hiragana";
    countdownSeconds: number;
    kanjiDefSource: "jisho.org" | "classic.jisho.org";
    learnNewCount: number;
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
    furigana?: string[];
    checks: MemAnswer[];
};

export type StorePropsType = {
    mems: MemType[];
    learnContext: MemType[];
    conflicts: MemType[];
    settings: AppSettings;
};

export type StoreActionsPropsType = {
    saveMem: (mem: MemType) => void;
    setLearnContext: (mems: MemType[]) => void;
    setConflicts: (mems: MemType[]) => void;
    deleteMem: (mem: MemType) => void;
    addAnswer: (memId: string, check: MemAnswer) => void;
    set: (newSettings: Partial<AppSettings>) => void;
    importMems: (mems: MemType[], cb?: (conflicts: MemType[]) => void) => void;
};

const defaultSettings: AppSettings = {
    furiganaMode: "Furigana",
    countdownSeconds: 10,
    kanjiDefSource: "jisho.org",
    learnNewCount: 20,
};

const InitialState: StorePropsType = {
    mems: [],
    learnContext: [],
    conflicts: [],
    settings: defaultSettings,
};

const memHasConflicts = (mem: MemType, existingMems: MemType[]): string[] => {
    return [];
};

const StoreActions = (set: Function, get: Function): StoreActionsPropsType => ({
    saveMem: (mem) => set(({ mems }) => ({ mems: [...mems.filter((m: MemType) => m.id != mem.id), mem] })),
    setLearnContext: (mems) => set(() => ({ learnContext: mems })),
    setConflicts: (mems) => set(() => ({ conflicts: mems })),
    deleteMem: (mem) => set(({ mems }) => ({ mems: mems.filter((m: MemType) => m.id != mem.id) })),
    addAnswer: (memId, check) =>
        set(({ mems }) => {
            const i = mems.findIndex((m: MemType) => m.id == memId);
            mems[i].checks.push(check);
            return { mems };
        }),
    set: (newSettings) => set(({ settings }) => ({ settings: { ...settings, ...newSettings } })),
    importMems: (newMems, cb) =>
        set(({ mems, conflicts }) => {
            const { memsToImport, newConflicts } = newMems.reduce<{ memsToImport: MemType[]; newConflicts: MemType[] }>(
                (acc, newMem) => {
                    if (memHasConflicts(newMem, mems).length > 0) {
                        acc.newConflicts.push(newMem);
                    } else {
                        acc.memsToImport.push(newMem);
                    }
                    return acc;
                },
                { memsToImport: [], newConflicts: [] }
            );
            if (cb) cb(newConflicts);
            return {
                mems: [...mems, ...memsToImport],
                conflicts: [...conflicts, ...newConflicts],
            };
        }),
});

export type useStorePropsType = StorePropsType & StoreActionsPropsType;

export const memsToStore = (mems: MemType[], conflicts: MemType[]): { state: StorePropsType } => ({
    state: { mems, learnContext: [], conflicts, settings: defaultSettings },
});

export const deserialiseMems = (mems: any[]): MemType[] =>
    mems.map((m) => ({
        ...m,
        checks: (m.checks || []).map((c: any) => ({ ...c, date: new Date(c.date as Date) })),
    }));

const store = persist(combine(InitialState, StoreActions), {
    name: "memup",
    deserialize: (s: string) => {
        const storage: { state: useStorePropsType; version: number } = JSON.parse(s);

        storage.state.mems = deserialiseMems(storage.state.mems);
        storage.state.conflicts = deserialiseMems(storage.state.conflicts);

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
