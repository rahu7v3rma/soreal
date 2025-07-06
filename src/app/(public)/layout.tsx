"use client";

import Header, { Footer } from "@/components/public/layout";
import usePaths from "@/hooks/paths";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isApiDocsPath, isAuthPath } = usePaths();

  return (
    <div className="w-full">
      {!isApiDocsPath && !isAuthPath && <Header />}
      {children}
      {!isApiDocsPath && !isAuthPath && <Footer />}
    </div>
  );
}
