"use client";

import { AuthRightPanel } from "@/components/auth/right-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabase } from "@/context/supabase";
import { ChevronRight, Eye, EyeOff, Home, Loader, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const { login, loginLoading } = useSupabase();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginResponse = await login({ email, password });
    if (loginResponse) {
      router.push("/dashboard");
    }
  };

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
            <span className="text-foreground font-medium">Login</span>
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

              <h1 className="text-3xl font-bold text-center">Welcome back</h1>
              <p className="text-muted-foreground mt-2 text-center">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-teal-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-500 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-full bg-teal-500 hover:bg-teal-600"
              >
                {loginLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <span
                    onClick={() => {
                      router.replace("/signup");
                    }}
                    className="text-teal-500 font-medium hover:underline cursor-pointer"
                  >
                    Sign up
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AuthRightPanel variant="default" />
    </div>
  );
};

export default Page;
