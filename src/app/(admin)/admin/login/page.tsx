"use client";

import { AuthRightPanel } from "@/components/auth/right-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useSupabase } from "@/context/supabase";
import { USER_ROLES } from "@/constants/user-role";
import { Eye, EyeOff, Loader, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
  } = useSupabase();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({ email, password });
  };

  useEffect(() => {
    let checkCount = 0;
    const maxChecks = 5;

    const checkUserRole = () => {
      // Check if user is admin and redirect
      if (userRole && userRole.role_type === USER_ROLES.ADMIN) {
        router.push('/admin/dashboard');
        return;
      }

      checkCount++;
      
      // Clear interval after 5 checks
      if (checkCount >= maxChecks) {
        clearInterval(interval);
      }
    };

    // Check immediately
    checkUserRole();

    // Set up interval to check every 1 second for 5 seconds total
    const interval = setInterval(checkUserRole, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [userRole, router]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
      <div className="flex flex-col p-8 md:p-12">
        <div className="flex items-center justify-center flex-1">
          <div className="w-full max-w-md space-y-6">
            <div>
              <Link href="/" className="mb-8 block mx-auto text-center">
                <Image
                  src={`https://api.soreal.app/assets/png/logo/soreal-logo-rgb-transparent-2x.png`}
                  alt="Soreal"
                  width={240}
                  height={64}
                  style={{ height: "auto" }}
                  priority
                  quality={95}
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
