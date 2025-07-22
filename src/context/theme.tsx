"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("theme.mode") as ThemeMode;
    if (savedMode && (savedMode === "light" || savedMode === "dark")) {
      setModeState(savedMode);
    }
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("theme.mode", newMode);
  };

  const toggleMode = () => {
    setModeState(prevMode => {
        localStorage.setItem("theme.mode", prevMode === "light" ? "dark" : "light");
        return prevMode === "light" ? "dark" : "light";
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
} 