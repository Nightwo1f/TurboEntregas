import { create } from "zustand";

type ColorScheme = "light" | "dark";

type ThemeState = {
  colorScheme: ColorScheme;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  colorScheme: "light",
  toggleTheme: () =>
    set((state) => ({
      colorScheme: state.colorScheme === "light" ? "dark" : "light"
    }))
}));
