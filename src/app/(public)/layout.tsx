"use client";

import Header from "@/components/public/layout";
import { useConsentCookie } from "@/context/consent-cookie";
import {
  JoinWaitlistConsumer,
  JoinWaitlistProvider,
} from "@/context/join-waitlist";
import usePaths from "@/hooks/paths";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setIsVisible } = useConsentCookie();
  const { isApiDocsPath, isAuthPath } = usePaths();

  return (
    <JoinWaitlistProvider>
      <div className="w-full">
        {!isApiDocsPath && !isAuthPath && <Header />}
        {children}
        {!isApiDocsPath && !isAuthPath && (
          <footer className="border-t border-gray-200 py-12" id="home-footer">
            <div className="max-w-[1300px] mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-8">
                    <Image
                      src={`https://api.soreal.app/assets/png/logo/soreal-logo-rgb-transparent-2x.png`}
                      alt="Soreal"
                      width={120}
                      height={32}
                      style={{ height: "auto" }}
                      quality={95}
                    />
                  </div>
                </div>

                <div></div>

                <div>
                  <h3 className="font-semibold tracking-[-0.01em] mb-4">
                    Company
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/pricing"
                        className="text-sm font-light text-gray-600 hover:text-gray-900"
                      >
                        Pricing
                      </Link>
                    </li>
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
                  <h3 className="font-semibold tracking-[-0.01em] mb-4">
                    Legal
                  </h3>
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
        )}
        <JoinWaitlistConsumer />
      </div>
    </JoinWaitlistProvider>
  );
}
