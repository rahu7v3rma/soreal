"use client";

import { Button } from "@/components/ui/button";
import { SorealLogo } from "@/components/ui/logo";
import { docsNavItems } from "@/constants/api-docs/layout";
import { cn } from "@/lib/utils/common";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <div className="flex min-h-screen bg-background w-full overflow-visible pb-6 relative">
      <div className="fixed inset-y-0 left-0 z-30">
        <div
          className={cn(
            "flex flex-col h-screen bg-card border-r border-border transition-all duration-300 overflow-hidden",
            "w-[280px]"
          )}
        >
          <div className="flex items-center h-16 px-4 border-b border-border">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 font-semibold",
                "justify-start"
              )}
            >
              <SorealLogo className="h-10" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {docsNavItems.map((item) => (
                <React.Fragment key={item.href}>
                  <Link href={item.href} passHref>
                    <Button
                      variant={
                        (item.href === "/api-docs" &&
                          pathname === "/api-docs") ||
                        (item.href !== "/api-docs" &&
                          pathname !== "/api-docs" &&
                          pathname.startsWith(item.href) &&
                          !item.submenu?.some(
                            (subitem) => pathname === subitem.href
                          ))
                          ? "active"
                          : "ghost"
                      }
                      className={cn(
                        "w-full justify-start mb-1 relative",
                        "px-3"
                      )}
                      size={"default"}
                    >
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </Button>
                  </Link>

                  {item.submenu && (
                    <div className="ml-6 mt-1 space-y-1 mb-2">
                      {item.submenu.map((subitem) => (
                        <Link key={subitem.href} href={subitem.href} passHref>
                          <Button
                            variant={
                              pathname === subitem.href ? "active" : "ghost"
                            }
                            className="w-full justify-start h-9"
                            size="sm"
                          >
                            {subitem.icon}
                            <span className="ml-2">{subitem.title}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col flex-1 w-full transition-all duration-300"
        style={{ marginLeft: "var(--sidebar-width, 240px)" }}
      >
        <div
          className="fixed top-0 right-0 bg-background w-full flex items-center z-20 border-b border-border px-6 h-16"
          style={{ marginLeft: "var(--sidebar-width, 240px)" }}
        >
          <div className="flex-1 flex items-center">
            <h1 className="text-xl font-semibold">API Documentation</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="default" size="sm">
                Go to Home
              </Button>
            </Link>
          </div>
        </div>

        <main className="flex-1 w-full overflow-visible mt-16">{children}</main>
      </div>
    </div>
  );
}
