"use client";

import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/supabase";
import { useConsentCookie } from "@/context/consent-cookie";
import usePaths from "@/hooks/paths";
import Link from "next/link";

const Header = () => {
  const { isActivePath } = usePaths();
  const { authUser } = useSupabase();

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
            <img
              src="https://api.soreal.app/assets/png/logo/soreal-logo-rgb-transparent-2x.png"
              alt="Soreal"
              width={120}
              height={32}
              style={{ height: "auto" }}
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
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Log In
              </Link>
              <Link href="/signup">
                <Button className="bg-[#2fceb9] text-white hover:bg-[#26a594] dark:bg-[#5E00FF] dark:hover:bg-[#4800CC] button-primary font-medium tracking-[-0.01em]">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  const { setIsVisible } = useConsentCookie();

  return (
    <footer className="border-t border-gray-200 py-12" id="home-footer">
      <div className="max-w-[1300px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <img
                src="https://api.soreal.app/assets/png/logo/soreal-logo-rgb-transparent-2x.png"
                alt="Soreal"
                width={120}
                height={32}
                style={{ height: "auto" }}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold tracking-[-0.01em] mb-4">Resource</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/blog"
                  className="text-sm font-light text-gray-600 hover:text-gray-900"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold tracking-[-0.01em] mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/api-docs"
                  className="text-sm font-light text-gray-600 hover:text-gray-900"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm font-light text-gray-600 hover:text-gray-900"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold tracking-[-0.01em] mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm font-light text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  onClick={() => setIsVisible(true)}
                  className="text-sm font-light text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm font-light text-gray-600 hover:text-gray-900"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-2 h-2 bg-[#2fceb9] rounded-full"></div>
            <span className="text-sm font-light text-gray-600">
              All systems normal
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <span className="text-sm font-light text-gray-600 mb-4 md:mb-0">
              © 2025 Soreal AI, LLC
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Header;
export { Footer };
