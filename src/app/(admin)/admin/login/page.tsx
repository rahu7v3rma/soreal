"use client";

import { AuthRightPanel } from "@/components/auth/right-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useSupabase } from "@/context/supabase";
import { USER_ROLES } from "@/constants/user-role";
import { Eye, EyeOff, Loader, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    login,
    loginLoading,
    logout,
    getAuthUser,
    getAuthUserLoading,
    getUserRole,
    getUserRoleLoading,
    userRole,
    authUser,
  } = useSupabase();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({ email, password });
  };

  useEffect(() => {
    // Initially clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let checkCount = 0;
    const maxChecks = 3;

    const checkUserRole = () => {
      // Check if user is admin and redirect
      if (userRole && userRole.role_type === USER_ROLES.ADMIN) {
        router.push('/admin/dashboard');
        return;
      }

      checkCount++;

      // Clear interval after 3 checks
      if (checkCount >= maxChecks) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        // Check if user exists and redirect to dashboard
        if (authUser) {
          router.push('/dashboard');
        }
      }
    };

    // Check immediately
    checkUserRole();

    // Set up interval to check every 1 second for 3 seconds total
    const interval = setInterval(checkUserRole, 1000);
    intervalRef.current = interval;

    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userRole, router, authUser]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
      <div className="flex flex-col p-8 md:p-12">
        <div className="flex items-center justify-center flex-1">
          <div className="w-full max-w-md space-y-6">
            <div>
              <Link href="/" className="mb-8 block mx-auto text-center">
                <div className="flex items-center justify-center relative">
                  <img
                    src={`https://api.soreal.app/assets/png/logo/soreal-logo-rgb-transparent-2x.png`}
                    alt="Soreal"
                    width={240}
                    height={64}
                    style={{ height: "auto" }}
                  />
                  <Badge
                    variant="outline"
                    className="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 -ml-4"
                  >
                    Admin
                  </Badge>
                </div>
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
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
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
                disabled={
                  loginLoading || getAuthUserLoading || getUserRoleLoading
                }
                className="w-full rounded-full bg-teal-500 hover:bg-teal-600"
              >
                {loginLoading || getAuthUserLoading || getUserRoleLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    {loginLoading
                      ? "Logging in..."
                      : getAuthUserLoading
                        ? "Getting user..."
                        : "Checking permissions..."}
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <AuthRightPanel variant="default" />
    </div>
  );
};

export default Page;
