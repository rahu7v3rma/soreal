"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SorealLogo } from "@/components/ui/logo";
import { adminNavItems } from "@/constants/admin";
import { useSupabase } from "@/context/supabase";
import { useTheme } from "@/context/theme";
import { cn } from "@/lib/utils/common";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    authUser,
    userProfile,
    logout,
  } = useSupabase();
  const { mode } = useTheme();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background dark:bg-zinc-800 dark:text-white w-full overflow-visible pb-6 relative">
      <div className="fixed inset-y-0 left-0 z-30">
        <div
          className={cn(
            "flex flex-col h-screen bg-card dark:bg-zinc-800 border-r border-border dark:border-zinc-600 transition-all duration-300 overflow-hidden",
            collapsed ? "w-[70px]" : "w-[240px]"
          )}
        >
          <div className="flex items-center h-16 px-4 border-b border-border dark:border-zinc-600">
            <Link
              href="/admin/dashboard"
              className={cn(
                "flex items-center gap-2 font-semibold",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <div className="flex items-center relative">
                <img
                  src={mode === "dark" 
                    ? "https://api.soreal.app/assets/png/logo/soreal-logo-white.png"
                    : "https://api.soreal.app/assets/png/logo/soreal-logo-rgb-transparent-2x.png"
                  }
                  alt="Soreal"
                  width={collapsed ? 32 : 120}
                  height={collapsed ? 8 : 32}
                  style={{ height: "auto" }}
                />
                {!collapsed && (
                  <Badge
                    variant="outline"
                    className=" bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 dark:bg-teal-800/30 dark:text-teal-200 dark:border-teal-500 dark:hover:bg-teal-900/40 -ml-2 text-[10px] px-2 py-0.5"
                  >
                    Admin
                  </Badge>
                )}
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className={cn("ml-auto", collapsed ? "-mr-2" : "")}
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <React.Fragment key={item.href}>
                  <Link href={item.href} passHref>
                    <Button
                      variant={
                        pathname === item.href
                          ? "active"
                          : "ghost"
                      }
                      className={cn(
                        "w-full justify-start mb-1 relative",
                        collapsed ? "px-2" : "px-3"
                      )}
                      size={collapsed ? "icon" : "default"}
                    >
                      {item.icon}
                      {!collapsed && (
                        <>
                          <span className="ml-2">{item.title}</span>
                        </>
                      )}
                    </Button>
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="p-3 pt-2 border-t border-border dark:border-zinc-600 pb-8">
            <nav className="space-y-1">
              <Link href="/admin/dashboard/settings" passHref>
                <Button
                  variant={
                    pathname === "/admin/dashboard/settings"
                      ? "active"
                      : "ghost"
                  }
                  className={cn(
                    "w-full justify-start mb-1 relative",
                    collapsed ? "px-2" : "px-3"
                  )}
                  size={collapsed ? "icon" : "default"}
                >
                  <Settings className="h-5 w-5" />
                  {!collapsed && <span className="ml-2">Settings</span>}
                </Button>
              </Link>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start mb-1 relative",
                  collapsed ? "px-2" : "px-3"
                )}
                size={collapsed ? "icon" : "default"}
                onClick={() => logout({ redirectTo: "/admin/login" })}
                id="sidebar-logout-button"
              >
                <LogOut className="h-5 w-5" />
                {!collapsed && <span className="ml-2">Logout</span>}
              </Button>
              <div className="h-px w-full bg-border/50 my-4"></div>
            </nav>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col flex-1 w-full transition-all duration-300"
        style={{ marginLeft: "var(--sidebar-width, 240px)" }}
      >
        <div className="h-16 bg-background dark:bg-zinc-800 text-foreground dark:text-white w-full flex items-center z-10">
          <div className="sticky top-0 right-0 w-full bg-background/95 dark:bg-zinc-800/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-zinc-800/60 z-50 border-b dark:border-zinc-600">
            <div className="h-16 flex items-center justify-end px-4 max-w-full">
              <div className="flex items-center gap-3 pr-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="focus:outline-none">
                      <div className="flex items-center gap-2 py-2 rounded-md hover:bg-muted/30 cursor-pointer transition-colors">
                        <Avatar>
                          <AvatarImage
                            src={userProfile?.avatarUrl || ""}
                            alt={authUser?.email || ""}
                          />
                          <AvatarFallback className="bg-teal-500 text-white">
                            {userProfile?.username
                              ?.substring(0, 2)
                              .toUpperCase() || "AD"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <div className="font-medium text-xs">
                            {userProfile?.username || "Admin"}
                          </div>
                          <div className="text-[10px] text-muted-foreground dark:text-zinc-100">
                            Admin Account
                          </div>
                        </div>
                        <ChevronDown className="h-3 w-3 text-muted-foreground dark:text-zinc-100 ml-1" />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 dark:bg-zinc-700 dark:border-zinc-600">
                    <DropdownMenuLabel className="dark:text-white">Admin Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="dark:bg-zinc-600" />
                    <DropdownMenuItem onClick={() => logout({ redirectTo: "/admin/login" })} className="dark:text-white dark:hover:bg-zinc-600">Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-1 w-full overflow-visible">
          <div className="container h-full px-3 md:px-4 max-w-7xl mx-auto py-6 md:py-8 pb-12 bg-white dark:bg-zinc-800 text-foreground dark:text-white">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
