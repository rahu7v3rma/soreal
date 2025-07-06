"use client";

import { AuthRightPanel } from "@/components/auth/right-panel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useSupabase } from "@/context/supabase";
import { ChevronRight, Home, Loader, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    session,
    authUser,
    createUserProfile,
    createUserProfileLoading,
    createUserTopup,
    createUserTopupLoading,
    createUserSubscription,
    createUserSubscriptionLoading,
  } = useSupabase();

  const [loading, setLoading] = useState(true);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  const createUser = async () => {
    try {
      const createUserProfileResponse = await createUserProfile();
      if (!createUserProfileResponse) {
        throw new Error("Failed to create user profile");
      }

      const createUserTopupResponse = await createUserTopup();
      if (!createUserTopupResponse) {
        throw new Error("Failed to create user topup");
      }

      const createUserSubscriptionResponse = await createUserSubscription();
      if (!createUserSubscriptionResponse) {
        throw new Error("Failed to create user subscription");
      }

      toast({
        title: "Successfully confirmed your email",
        duration: 5000,
      });

      setEmailConfirmed(true);
    } catch (error) {
      toast({
        title: "Something went wrong while confirming your email",
        duration: 5000,
      });
      setEmailConfirmed(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken && authUser?.id) {
      createUser();
    }
  }, [session, authUser]);

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
            <span className="text-foreground font-medium">Confirm Email</span>
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
            </div>

            <form className="space-y-4">
              <Button
                type="submit"
                disabled={
                  createUserProfileLoading ||
                  createUserTopupLoading ||
                  createUserSubscriptionLoading ||
                  loading
                }
                className="w-full rounded-full bg-teal-500 hover:bg-teal-600"
                onClick={(e) => {
                  e.preventDefault();
                  if (emailConfirmed) {
                    router.push("/onboarding");
                  } else {
                    router.push("/signup");
                  }
                }}
              >
                {createUserProfileLoading ||
                createUserTopupLoading ||
                createUserSubscriptionLoading ||
                loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Confirming Email...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    {emailConfirmed ? "Go to Dashboard" : "Go to Signup"}
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
