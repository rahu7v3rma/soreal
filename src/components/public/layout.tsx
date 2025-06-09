"use client";

import { Button } from "@/components/shared/button";
import { useJoinWaitlist } from "@/context/join-waitlist";
import { useSupabase } from "@/context/supabase";
import usePaths from "@/hooks/paths";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { isActivePath } = usePaths();
  const { authUser } = useSupabase();
  const { setIsOpen } = useJoinWaitlist();

  return (
    <header
      className="border-b bg-white dark:bg-gray-900 dark:border-gray-800"
      id="home-navbar"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center justify-center"
            title="Go to Homepage"
          >
            <Image
              src={`https://api.soreal.app/assets/png/logo/soreal-logo-rgb-transparent-2x.png`}
              alt="Soreal"
              width={120}
              height={32}
              style={{ height: "auto" }}
              priority
              quality={95}
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/pricing"
              className={`text-sm font-medium ${isActivePath("/pricing") ? "text-gray-900 dark:text-white" : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"}`}
            >
              Pricing
            </Link>
            <Link
              href="/api-docs"
              className={`text-sm font-medium ${isActivePath("/api-docs") ? "text-gray-900 dark:text-white" : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"}`}
            >
              API
            </Link>
            <Link
              href="/help"
              className={`text-sm font-medium ${isActivePath("/help") ? "text-gray-900 dark:text-white" : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"}`}
            >
              Help Center
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {authUser ? (
            <Link href="/dashboard">
              <Button className="bg-[#2fceb9] text-white hover:bg-[#26a594] dark:bg-[#5E00FF] dark:hover:bg-[#4800CC] button-primary font-medium tracking-[-0.01em]">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Button
                className="bg-[#2fceb9] text-white hover:bg-[#26a594] dark:bg-[#5E00FF] dark:hover:bg-[#4800CC] button-primary font-medium tracking-[-0.01em]"
                onClick={() => setIsOpen(true)}
              >
                Join Waitlist
              </Button>
              {/* <Link
                    href="/login"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Log In
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-[#2fceb9] text-white hover:bg-[#26a594] dark:bg-[#5E00FF] dark:hover:bg-[#4800CC] button-primary font-medium tracking-[-0.01em]">
                      Sign Up
                    </Button>
                  </Link> */}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
