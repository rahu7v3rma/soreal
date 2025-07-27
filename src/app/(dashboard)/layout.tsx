"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlackBadge } from "@/components/ui/black-badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { bottomNavItems, mainNavItems } from "@/constants/dashboard";
import { useSupabase } from "@/context/supabase";
import { cn } from "@/lib/utils/common";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const {
    authUser,
    userProfile,
    logout,
    userTopup,
    isGrowthPlan,
    totalCredits,
    userSubscription,
    isSubscriptionExpired,
    getUserTopupLoading,
    getUserSubscriptionLoading,
    getAuthUserLoading,
    getUserProfileLoading,
  } = useSupabase();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  const shouldShowApiKeys = isGrowthPlan && !isSubscriptionExpired;

  if (pathname === "/onboarding") {
    return <>{children}</>;
  }

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
              href="/"
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
              {mainNavItems
                .filter((i) =>
                  i.href === "/api-keys" ? shouldShowApiKeys : true
                )
                .map((item) => (
                  <React.Fragment key={item.href}>
                    <Link href={item.href} passHref>
                      <Button
                        variant={
                          item.href === "/create" &&
                          (pathname === "/create" || pathname === "/create/")
                            ? "active"
                            : pathname === item.href ||
                                (pathname !== "/" &&
                                  item.href !== "/" &&
                                  pathname.startsWith(item.href) &&
                                  item.href !== "/create")
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
                            {item.badge && (
                              <BlackBadge className="ml-auto text-xs px-1.5 py-0.5">
                                {item.badge}
                              </BlackBadge>
                            )}
                          </>
                        )}
                        {collapsed && item.badge && (
                          <div className="absolute -top-1 -right-1 w-4 h-4">
                            <BlackBadge className="w-full h-full flex items-center justify-center text-[10px]">
                              •
                            </BlackBadge>
                          </div>
                        )}
                      </Button>
                    </Link>

                    {!collapsed && item.submenu && (
                      <div className="ml-6 mt-1 space-y-1 mb-2">
                        {item.submenu.map((subitem) => (
                          <Link key={subitem.href} href={subitem.href} passHref>
                            <Button
                              variant={
                                pathname === subitem.href ||
                                (pathname !== "/" &&
                                  subitem.href !== "/" &&
                                  pathname.startsWith(subitem.href))
                                  ? "active"
                                  : "ghost"
                              }
                              className="w-full justify-start h-9"
                              size="sm"
                            >
                              {subitem.icon}
                              <span className="ml-2">{subitem.title}</span>
                              {subitem.badge && (
                                <BlackBadge className="ml-auto text-xs px-1.5 py-0.5">
                                  {subitem.badge}
                                </BlackBadge>
                              )}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              
              {getUserSubscriptionLoading && (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start mb-1 relative",
                    collapsed ? "px-2" : "px-3"
                  )}
                  size={collapsed ? "icon" : "default"}
                  disabled
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {!collapsed && <span className="ml-2">Loading...</span>}
                </Button>
              )}
            </nav>
          </div>

          {!collapsed && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href="/billing"
                    className="relative whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm rounded-md flex items-center justify-center gap-3 px-4 py-1 h-9"
                  >
                    {getUserTopupLoading || getUserSubscriptionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="font-medium">Loading...</span>
                      </>
                    ) : (
                      <>
                        {totalCredits < 100 ? (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {totalCredits.toLocaleString()} Credits
                        </span>
                      </>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="w-80 p-0 overflow-hidden"
                >
                  <div className="p-4 bg-card flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Subscription Credits</h3>
                      <span className="text-sm">
                        {userSubscription?.creditBalance?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Top-up Credits</h3>
                      <span className="text-sm">
                        {userTopup?.creditBalance?.toLocaleString() || 0}
                      </span>
                    </div>

                    <Link href="/billing">
                      <div className="flex justify-between items-center border-t pt-3 mt-1">
                        <span className="cursor-pointer">
                          Purchase more credits
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Link>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <div className="p-3 pt-2 border-t border-border pb-8">
            <nav className="space-y-2 flex flex-col">
              {bottomNavItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Button
                    variant={
                      pathname === item.href ||
                      (pathname !== "/" &&
                        item.href !== "/" &&
                        pathname.startsWith(item.href))
                        ? "active"
                        : "ghost"
                    }
                    className={cn(
                      "w-full justify-start rounded-lg",
                      collapsed ? "px-2" : "px-3"
                    )}
                    size={collapsed ? "icon" : "default"}
                  >
                    {item.icon}
                    {!collapsed && <span className="ml-2">{item.title}</span>}
                  </Button>
                </Link>
              ))}

              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-muted-foreground hover:text-foreground mt-2 rounded-lg",
                  collapsed ? "px-2" : "px-3"
                )}
                size={collapsed ? "icon" : "default"}
                onClick={() => logout()}
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
        style={{ marginLeft: collapsed ? "70px" : "240px" }}
      >
        <div className="h-16 bg-background w-full flex items-center z-10">
          <div className="sticky top-0 right-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
            <div className="h-16 flex items-center justify-end px-4 max-w-full">
              <div className="flex items-center gap-3 pr-0">
                {getAuthUserLoading || getUserProfileLoading ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
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
                                .toUpperCase() || "US"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <div className="font-medium text-xs">
                              {userProfile?.username || "User"}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              Personal Account
                            </div>
                          </div>
                          <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/billing">Billing</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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

export default Layout;
