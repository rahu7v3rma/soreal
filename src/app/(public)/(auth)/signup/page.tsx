"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  Eye,
  EyeOff,
  Home,
  Loader,
  Shield,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthRightPanel } from "@/components/auth/right-panel";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useSupabase } from "@/context/supabase";
import { useToast } from "@/components/ui/toast";

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { signup, signupLoading } = useSupabase();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dataProcessingConsent, setDataProcessingConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Password and confirm password do not match",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    signup({ email, password });
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
            <span className="text-foreground font-medium">Sign up</span>
          </div>
        </div>

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

              <h1 className="text-3xl font-bold text-center">
                Create an Account
              </h1>
              <p className="text-muted-foreground mt-2 text-center">
                Generate images that feel captured, not created
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
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
                    className="pr-10"
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

              <div className="space-y-4">
                <div className="flex items-start signup-checkbox-container">
                  <Checkbox
                    id="dataProcessingConsent"
                    checked={dataProcessingConsent}
                    onCheckedChange={(checked: boolean) =>
                      setDataProcessingConsent(checked)
                    }
                    required
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="dataProcessingConsent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the processing of my personal data as described
                      in the{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-teal-500 hover:underline"
                      >
                        Privacy Policy
                      </Link>{" "}
                      *
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      This consent is required to create an account
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={signupLoading}
                className="w-full rounded-full bg-teal-500 hover:bg-teal-600"
              >
                {signupLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>

              <div className="flex items-center text-xs text-muted-foreground gap-1 justify-center mt-4">
                <Shield className="h-3 w-3" />
                <span>
                  Your data is protected under GDPR and applicable data
                  protection laws
                </span>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <span
                    onClick={() => {
                      router.push("/login");
                    }}
                    className="text-teal-500 font-medium hover:underline cursor-pointer"
                  >
                    Login
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AuthRightPanel variant="signup" />
    </div>
  );
};

export default Page;
