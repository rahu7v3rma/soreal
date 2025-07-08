"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils/common";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
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
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background w-full overflow-visible pb-6 relative">
      <div className="fixed inset-y-0 left-0 z-30">
        <div
          className={cn(
            "flex flex-col h-screen bg-card border-r border-border transition-all duration-300 overflow-hidden",
            collapsed ? "w-[70px]" : "w-[240px]"
          )}
        >
          <div className="flex items-center h-16 px-4 border-b border-border">
            <Link
              href="/admin/dashboard"
              className={cn(
                "flex items-center gap-2 font-semibold",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <SorealLogo className={collapsed ? "h-8 w-8" : "h-10"} />
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

          <div className="p-3 pt-2 border-t border-border pb-8">
            <nav className="space-y-2 flex flex-col">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-muted-foreground hover:text-foreground mt-2 rounded-lg",
                  collapsed ? "px-2" : "px-3"
                )}
                size={collapsed ? "icon" : "default"}
                onClick={logout}
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
        <div className="h-16 bg-background w-full flex items-center z-10">
          <div className="sticky top-0 right-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
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
                          <div className="text-[10px] text-muted-foreground">
                            Admin Account
                          </div>
                        </div>
                        <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-1 w-full overflow-visible">
          <div className="container h-full px-3 md:px-4 max-w-7xl mx-auto py-6 md:py-8 pb-12 bg-white">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
