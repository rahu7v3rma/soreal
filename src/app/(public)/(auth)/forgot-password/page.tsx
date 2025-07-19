"use client";

import { AuthRightPanel } from "@/components/auth/right-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabase } from "@/context/supabase";
import { ChevronRight, Home, Loader, LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const { resetPassword, resetPasswordLoading } = useSupabase();

  const [email, setEmail] = useState("");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
      <div className="flex flex-col p-8 md:p-12">
        <div className="mb-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="flex items-center hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-foreground font-medium">Forgot Password</span>
          </div>
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="w-full max-w-md space-y-6">
            <div>
              <Link href="/" className="mb-8 block mx-auto text-center">
                <img
                  src="https://api.soreal.app/assets/png/logo/soreal-logo-rgb-transparent-2x.png"
                  alt="Soreal"
                  width={240}
                  height={64}
                  style={{ height: "auto" }}
                  className="mb-4 mx-auto"
                />
              </Link>

              <h1 className="text-3xl font-bold text-center">
                Forgot password
              </h1>
              <p className="text-muted-foreground mt-2 text-center">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                resetPassword({ email });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={resetPasswordLoading}
                className="w-full rounded-full bg-teal-500 hover:bg-teal-600"
              >
                {resetPasswordLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Send Reset Password Link
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <AuthRightPanel variant="forgot-password" />
    </div>
  );
};

export default Page;
