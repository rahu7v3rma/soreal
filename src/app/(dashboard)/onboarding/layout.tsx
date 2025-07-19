"use client";

import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/supabase";
import { LogOut, Sparkles } from "lucide-react";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logout } = useSupabase();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <header className="flex items-center justify-between p-2 border-b bg-white shadow-sm w-full">
        <div className="flex items-center container max-w-screen-2xl mx-auto px-2 sm:px-4 w-full">
          <div className="flex items-center">
            <div className="text-primary w-6 h-6 mr-2 flex items-center justify-center rounded-md bg-primary/10">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="text-base font-bold tracking-tight">Soreal</span>
          </div>
          <div className="flex-1"></div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground h-8 text-xs"
            aria-label="Logout"
          >
            <LogOut className="h-3 w-3" aria-hidden="true" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      <main
        className="flex-1 flex flex-col items-center justify-center p-3 md:p-5 bg-gray-50/50 w-full"
        aria-label="Onboarding content"
      >
        <div className="w-full max-w-2xl mx-auto flex justify-center">
          <div className="w-full bg-white p-6 md:p-8 rounded-lg shadow-sm">
            {children}
          </div>
        </div>
      </main>

      <footer className="py-2 text-center text-xs text-muted-foreground border-t bg-white w-full">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <p>© {currentYear} Soreal AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
