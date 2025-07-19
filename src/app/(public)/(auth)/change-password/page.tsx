"use client";

import { AuthRightPanel } from "@/components/auth/right-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useSupabase } from "@/context/supabase";
import { ChevronRight, Eye, EyeOff, Home, Loader, LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const { updateAuthUser, updateAuthUserLoading, logout, logoutLoading } =
    useSupabase();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);

    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password does not match with the confirm password",
        variant: "destructive",
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    const updatePasswordResponse = await updateAuthUser({
      password: newPassword,
    });
    if (updatePasswordResponse) {
      await logout();
    }

    setLoading(false);
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
            <span className="text-foreground font-medium">Change Password</span>
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
                Change Password
              </h1>
              <p className="text-muted-foreground mt-2 text-center">
                Enter your new password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="mr-10"
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
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-500 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={updateAuthUserLoading || loading || logoutLoading}
                className="w-full rounded-full bg-teal-500 hover:bg-teal-600"
              >
                {updateAuthUserLoading || loading || logoutLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <AuthRightPanel variant="change-password" />
    </div>
  );
};

export default Page;
