import { create } from "zustand";

export type ReaderLanguage = "arabic" | "english" | "swedish";

export interface ReaderSettings {
  fontSize: number;
  chunkSize: number;
  wpm: number;
}

interface ReaderState {
  text: string;
  language: ReaderLanguage;
  settings: ReaderSettings;
  setText: (text: string) => void;
  setLanguage: (language: ReaderLanguage) => void;
  updateSettings: (settings: Partial<ReaderSettings>) => void;
}

export const useStore = create<ReaderState>((set) => ({
  text: "",
  language: "english",
  settings: {
    fontSize: 42,
    chunkSize: 1,
    wpm: 300,
  },
  setText: (text) => set({ text }),
  setLanguage: (language) => set({ language }),
  updateSettings: (settings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...settings,
      },
    })),
}));
