"use client";

import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex w-full">{children}</div>;
}
