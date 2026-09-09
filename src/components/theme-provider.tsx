'use client'

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const applyThemeClass = (theme: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        applyThemeClass(theme);
    }, [theme]);

    const setTheme = (next: Theme) => {
        setThemeState(next);
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", next);
            applyThemeClass(next);
        }
    };

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
};

function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "light";

    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
