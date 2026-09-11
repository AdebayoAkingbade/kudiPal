"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LampDesk, Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isLampOn = theme === "light";
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.button
            type="button"
            aria-label={isLampOn ? "Turn lamp off for dark mode" : "Turn lamp on for light mode"}
            aria-pressed={isLampOn}
            title={isLampOn ? "Turn lamp off" : "Turn lamp on"}
            onClick={() => setTheme(isLampOn ? "dark" : "light")}
            className="group relative h-11 w-[5.5rem] shrink-0 overflow-hidden rounded-full border border-border/70 bg-secondary/80 shadow-sm outline-none ring-offset-background transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        >
            <motion.span
                aria-hidden="true"
                className="absolute inset-0"
                animate={{
                    background: isLampOn
                        ? "radial-gradient(circle at 72% 32%, rgba(250, 204, 21, 0.42), rgba(15, 118, 110, 0.12) 42%, transparent 75%)"
                        : "radial-gradient(circle at 28% 50%, rgba(148, 163, 184, 0.22), transparent 68%)",
                }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
            />

            <motion.span
                aria-hidden="true"
                className="absolute left-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border"
                animate={{
                    x: isLampOn ? 44 : 0,
                    rotate: isLampOn ? -8 : 7,
                    backgroundColor: isLampOn ? "#FEF3C7" : "#0F172A",
                    borderColor: isLampOn ? "#F59E0B" : "#334155",
                    boxShadow: isLampOn
                        ? "0 0 0 4px rgba(245, 158, 11, 0.18), 0 0 26px rgba(250, 204, 21, 0.85)"
                        : "0 8px 22px rgba(2, 6, 23, 0.45)",
                }}
                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 24 }}
            >
                <LampDesk
                    className={isLampOn ? "h-4 w-4 text-amber-700" : "h-4 w-4 text-slate-300"}
                    strokeWidth={2.4}
                />
            </motion.span>

            <motion.span
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                animate={{ opacity: isLampOn ? 0 : 1, scale: isLampOn ? 0.72 : 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            >
                <Moon className="h-4 w-4" />
            </motion.span>

            <motion.span
                aria-hidden="true"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500"
                animate={{ opacity: isLampOn ? 1 : 0, scale: isLampOn ? 1 : 0.72 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            >
                <Sun className="h-4 w-4" />
            </motion.span>

            <motion.span
                aria-hidden="true"
                className="absolute right-6 top-1 h-3 w-3 text-amber-300"
                animate={{ opacity: isLampOn ? [0.2, 1, 0.55] : 0, y: isLampOn ? [2, -2, 1] : 2 }}
                transition={{
                    duration: shouldReduceMotion ? 0 : 1.8,
                    repeat: isLampOn && !shouldReduceMotion ? Infinity : 0,
                    ease: "easeInOut",
                }}
            >
                <Sparkles className="h-3 w-3" />
            </motion.span>
        </motion.button>
    );
}
