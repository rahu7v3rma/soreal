"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import {
  enterpriseFeatures,
  subscriptionPlans,
  topUpPackages,
} from "@/constants/billing";
import {
  PREMIUM_IMAGE_CREDITS,
  REMOVE_BACKGROUND_IMAGE_CREDITS,
  STANDARD_IMAGE_CREDITS,
  UPSCALE_IMAGE_CREDITS,
} from "@/constants/credits";
import { planCredits } from "@/constants/subscription";
import { useSupabase } from "@/context/supabase";
import { useApi } from "@/hooks/api";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Calculator,
  Check,
  CreditCard,
  Layers,
  Loader,
  Minus,
  Plus,
  Repeat,
  Scissors,
  Search,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

const Page = () => {
  const { 
    userTopup, 
    generations, 
    userSubscription, 
    totalCredits,
    getUserTopupLoading,
    getUserGenerationsLoading,
    getUserSubscriptionLoading 
  } = useSupabase();
  const {
    requestTopupStripeCheckoutSession,
    requestTopupStripeCheckoutSessionLoading,
    requestSubscriptionStripeCheckoutSession,
    requestSubscriptionStripeCheckoutSessionLoading,
    requestCancelSubscription,
    requestCancelSubscriptionLoading,
    requestSubscriptionDetails,
    requestSubscriptionDetailsLoading,
  } = useApi();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();

  const [imageCount, setImageCount] = useState([50]);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [creatorPackQuantity, setCreatorPackQuantity] = useState(1);
  const [essentialsPackQuantity, setEssentialsPackQuantity] = useState(1);
  const [changingPlan, setChangingPlan] = useState(false);
  const [paymentStatusToastMessage, setPaymentStatusToastMessage] = useState<
    string | null
  >(null);
  const [paymentStatusToastVariant, setPaymentStatusToastVariant] = useState<
    "default" | "destructive"
  >("default");
  const [cancelSubscriptionDialogOpen, setCancelSubscriptionDialogOpen] =
    useState(false);

  const enterpriseRef = useRef<HTMLDivElement>(null);

  const totalSpent = (generations || []).reduce((total, generation) => {
    return total + (generation.credit_requirement || 0);
  }, 0);

  const thisMonthSpent = (generations || []).reduce((total, generation) => {
    const generationDate = new Date(generation.created_at);
    if (
      generationDate.getFullYear() === currentYear &&
      generationDate.getMonth() === currentMonth
    ) {
      return total + (generation.credit_requirement || 0);
    }
    return total;
  }, 0);

  const standardCredits = imageCount[0] * STANDARD_IMAGE_CREDITS;
  const premiumCredits = imageCount[0] * PREMIUM_IMAGE_CREDITS;
  const backgroundRemovalCredits =
    imageCount[0] * REMOVE_BACKGROUND_IMAGE_CREDITS;
  const upscaleCredits = imageCount[0] * UPSCALE_IMAGE_CREDITS;

  const handleSliderChange = (value: number[]) => {
    setImageCount(value);
  };

  const isCurrentPlan = (planName: string, currentBillingCycle: string) => {
    return (
      userSubscription?.planName?.toLowerCase() === planName.toLowerCase() &&
      userSubscription?.billingCycle?.toLowerCase() ===
        currentBillingCycle.toLowerCase()
    );
  };

  useEffect(() => {
    const topupSuccess = searchParams.get("topup_payment_success");
    if (topupSuccess) {
      setPaymentStatusToastMessage(
        "Your top-up credits were successfully purchased!"
      );
      setPaymentStatusToastVariant("default");
      return;
    }
    const topupFailed = searchParams.get("topup_payment_failed");
    if (topupFailed) {
      setPaymentStatusToastMessage(
        "There was an error processing your payment. Please try again. Contact support if the money has been charged."
      );
      setPaymentStatusToastVariant("destructive");
      return;
    }
    const subscriptionSuccess = searchParams.get(
      "subscription_payment_success"
    );
    if (subscriptionSuccess) {
      setPaymentStatusToastMessage(
        "Your subscription was successfully activated!"
      );
      setPaymentStatusToastVariant("default");
      return;
    }
    const subscriptionChangeBillingCycleSuccess = searchParams.get(
      "subscription_change_billing_cycle_success"
    );
    if (subscriptionChangeBillingCycleSuccess) {
      setPaymentStatusToastMessage(
        "Your subscription will be updated at the end of your current billing period."
      );
      setPaymentStatusToastVariant("default");
      return;
    }
    const subscriptionChangePlanNameSuccess = searchParams.get(
      "subscription_change_plan_name_success"
    );
    if (subscriptionChangePlanNameSuccess) {
      setPaymentStatusToastMessage(
        "Your subscription was successfully changed!"
      );
      setPaymentStatusToastVariant("default");
      return;
    }
    const subscriptionFailed = searchParams.get("subscription_payment_failed");
    if (subscriptionFailed) {
      setPaymentStatusToastMessage(
        "There was an error processing your payment. Please try again. Contact support if the money has been charged."
      );
      setPaymentStatusToastVariant("destructive");
      return;
    }
  }, []);

  useEffect(() => {
    if (paymentStatusToastMessage) {
      toast({
        title: paymentStatusToastMessage,
        variant: paymentStatusToastVariant,
        duration: 5000,
      });
      setPaymentStatusToastMessage(null);
      setPaymentStatusToastVariant("default");
      router.replace("/billing");
    }
  }, [paymentStatusToastMessage, paymentStatusToastVariant, toast]);

  const confirmCancelSubscription = () => {
    setCancelSubscriptionDialogOpen(true);
  };

  useEffect(() => {
    setChangingPlan(false);
  }, [userSubscription]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <CreditCard className="mr-2 h-6 w-6 text-primary" />
            Billing
          </h1>
          <p className="text-muted-foreground">
            Manage your credits and subscription
          </p>
        </div>
      </div>

      <Tabs defaultValue="credits" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
          <TabsTrigger value="credits" className="flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Credits
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center">
            <Repeat className="h-4 w-4 mr-2" />
            Subscription
          </TabsTrigger>
        </TabsList>

        <TabsContent value="credits" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="flex">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl">
                    Your Credit Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6 text-center">
                    <div className="text-2xl text-muted-foreground mb-3">
                      Credits Balance
                    </div>
                    <div
                      className="text-6xl font-bold"
                      id="billing-credit-amount"
                    >
                      {getUserTopupLoading || getUserSubscriptionLoading ? (
                        <Loader className="h-16 w-16 animate-spin mx-auto" />
                      ) : (
                        totalCredits?.toLocaleString() || "0"
                      )}
                    </div>
                  </div>

                  <div className="mt-12 mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200/50 shadow-sm">
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Your Usage
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="group">
                          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-center">
                            <div className="mb-3">
                              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                Total Spent
                              </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                              {getUserGenerationsLoading ? (
                                <Loader className="h-6 w-6 animate-spin mx-auto" />
                              ) : (
                                totalSpent.toLocaleString()
                              )}
                            </div>
                            <div className="text-xs text-gray-400">
                              All Time Credits
                            </div>
                          </div>
                        </div>

                        <div className="group">
                          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-center">
                            <div className="mb-3">
                              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                This Month
                              </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                              {getUserGenerationsLoading ? (
                                <Loader className="h-6 w-6 animate-spin mx-auto" />
                              ) : (
                                thisMonthSpent.toLocaleString()
                              )}
                            </div>
                            <div className="text-xs text-gray-400">
                              Current Period
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200/50">
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Credits Reset On
                            </span>
                            <span className="font-medium text-gray-900">
                              {getUserSubscriptionLoading ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : userSubscription?.planName &&
                              userSubscription?.creditResetDate
                                ? new Date(
                                    userSubscription.creditResetDate
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "N/A"}
                            </span>
                          </div>
                          {userSubscription?.planName && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">
                                Subscription Credits Remaining
                              </span>
                              <span className="font-medium text-gray-900">
                                {getUserSubscriptionLoading ? (
                                  <Loader className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    {userSubscription?.creditBalance?.toLocaleString()}
                                    {" out of "}
                                    {planCredits[
                                      userSubscription?.planName as keyof typeof planCredits
                                    ].toLocaleString()}
                                  </>
                                )}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Top-up Credits Remaining
                            </span>
                            <span className="font-medium text-gray-900">
                              {getUserTopupLoading ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                userTopup?.creditBalance?.toLocaleString() || "0"
                              )}
                            </span>
                          </div>
                          <div className="text-center text-xs text-gray-600 mt-4">
                            *Top-up credits do not expire and remain in your
                            balance.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="w-full text-center">
                    <div className="text-base text-muted-foreground">
                      Need help with your credits?{" "}
                      <Link href="/help" className="text-[#2fceb9] underline">
                        Contact support
                      </Link>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="flex">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="text-center">
                  <CardTitle>Top-Up Credit Packages</CardTitle>
                  <CardDescription>Credits never expire.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    {topUpPackages.map((pkg, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 hover:shadow-md transition-all relative flex flex-col min-h-[280px] ${
                          pkg.popular ? "border-[#2fceb9]/20 shadow-md" : ""
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#2fceb9] text-white px-2 py-0.5 rounded-full text-xs">
                            Most Popular
                          </div>
                        )}

                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">
                                  {pkg.name}
                                </h3>
                                {pkg.discount && (
                                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                    {pkg.discount}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {pkg.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">
                                $
                                {pkg.name === "Creator Pack"
                                  ? pkg.price * creatorPackQuantity
                                  : pkg.name === "Essentials Pack"
                                    ? pkg.price * essentialsPackQuantity
                                    : pkg.price}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {pkg.features.map((feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="flex items-center gap-2 text-sm"
                              >
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span>
                                  {pkg.name === "Creator Pack"
                                    ? `${(pkg.credits * creatorPackQuantity).toLocaleString()} credits`
                                    : pkg.name === "Essentials Pack"
                                      ? `${(pkg.credits * essentialsPackQuantity).toLocaleString()} credits`
                                      : feature}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex-1"></div>

                          <div className="flex justify-center py-6">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => {
                                  if (pkg.name === "Creator Pack") {
                                    setCreatorPackQuantity(
                                      Math.max(1, creatorPackQuantity - 1)
                                    );
                                  } else if (pkg.name === "Essentials Pack") {
                                    setEssentialsPackQuantity(
                                      Math.max(1, essentialsPackQuantity - 1)
                                    );
                                  }
                                }}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                disabled={
                                  (pkg.name === "Creator Pack" &&
                                    creatorPackQuantity <= 1) ||
                                  (pkg.name === "Essentials Pack" &&
                                    essentialsPackQuantity <= 1)
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {pkg.name === "Creator Pack"
                                  ? creatorPackQuantity
                                  : essentialsPackQuantity}
                              </span>
                              <button
                                onClick={() => {
                                  if (pkg.name === "Creator Pack") {
                                    setCreatorPackQuantity(
                                      creatorPackQuantity + 1
                                    );
                                  } else if (pkg.name === "Essentials Pack") {
                                    setEssentialsPackQuantity(
                                      essentialsPackQuantity + 1
                                    );
                                  }
                                }}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="py-4">
                            <Button
                              className="w-full bg-[#2fceb9] hover:bg-[#26a594]"
                              onClick={() => {
                                if (pkg.name === "Creator Pack") {
                                  requestTopupStripeCheckoutSession({
                                    type: "creator",
                                    quantity: creatorPackQuantity,
                                  });
                                } else if (pkg.name === "Essentials Pack") {
                                  requestTopupStripeCheckoutSession({
                                    type: "essential",
                                    quantity: essentialsPackQuantity,
                                  });
                                }
                              }}
                              disabled={
                                requestTopupStripeCheckoutSessionLoading
                              }
                            >
                              {requestTopupStripeCheckoutSessionLoading
                                ? "Loading..."
                                : pkg.name === "Creator Pack"
                                  ? `Buy ${creatorPackQuantity} Pack${creatorPackQuantity > 1 ? "s" : ""}`
                                  : pkg.name === "Essentials Pack"
                                    ? `Buy ${essentialsPackQuantity} Pack${essentialsPackQuantity > 1 ? "s" : ""}`
                                    : "Buy Credits"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#2fceb9]" />
                <CardTitle>Credit Estimator</CardTitle>
              </div>
              <CardDescription>
                Use the slider to estimate your monthly needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium">
                    Number of Images
                  </label>
                  <span className="text-sm text-muted-foreground">
                    {imageCount[0].toLocaleString()} images
                  </span>
                </div>
                <Slider
                  value={imageCount}
                  onValueChange={handleSliderChange}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span>100</span>
                </div>

                {imageCount[0] >= 90 && imageCount[0] <= 100 && (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Scaling Up?
                        </h4>
                        <p className="text-sm text-gray-700">
                          Custom Enterprise plans offer higher limits and more
                          cost-effective pricing.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          enterpriseRef.current?.scrollIntoView({
                            behavior: "smooth",
                          })
                        }
                        className="ml-4 px-4 py-2 bg-[#2fceb9] text-white text-sm font-medium rounded-lg hover:bg-[#26a594] transition-colors"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-[#2fceb9]" />
                    <span className="font-medium text-[#111]">
                      Standard Images
                    </span>
                  </div>
                  <div className="text-xl font-bold text-[#2fceb9]">
                    {standardCredits.toLocaleString()} credits
                  </div>
                  <div className="text-sm text-gray-600">
                    {STANDARD_IMAGE_CREDITS} credits ×{" "}
                    {imageCount[0].toLocaleString()} images
                  </div>
                </div>

                <div className="p-4 border rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Layers className="h-4 w-4 text-[#2fceb9]" />
                    <span className="font-medium text-[#111]">
                      Premium Images
                    </span>
                  </div>
                  <div className="text-xl font-bold text-[#2fceb9]">
                    {premiumCredits.toLocaleString()} credits
                  </div>
                  <div className="text-sm text-gray-600">
                    {PREMIUM_IMAGE_CREDITS} credits ×{" "}
                    {imageCount[0].toLocaleString()} images
                  </div>
                </div>

                <div className="p-4 border rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Scissors className="h-4 w-4 text-[#2fceb9]" />
                    <span className="font-medium text-[#111]">
                      Background Removal
                    </span>
                  </div>
                  <div className="text-xl font-bold text-[#2fceb9]">
                    {backgroundRemovalCredits.toLocaleString()} credits
                  </div>
                  <div className="text-sm text-gray-600">
                    {REMOVE_BACKGROUND_IMAGE_CREDITS} credits ×{" "}
                    {imageCount[0].toLocaleString()} images
                  </div>
                </div>

                <div className="p-4 border rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Search className="h-4 w-4 text-[#2fceb9]" />
                    <span className="font-medium text-[#111]">
                      Upscale / Enhance
                    </span>
                  </div>
                  <div className="text-xl font-bold text-[#2fceb9]">
                    {upscaleCredits.toLocaleString()} credits
                  </div>
                  <div className="text-sm text-gray-600">
                    {UPSCALE_IMAGE_CREDITS} credits ×{" "}
                    {imageCount[0].toLocaleString()} images
                  </div>
                </div>
              </div>

              {imageCount[0] >= 500 && imageCount[0] <= 1000 && (
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        <img
                          src={`https://api.soreal.app/assets/png/logo/soreal-logo-rgb-transparent-2x.png`}
                          alt="Soreal"
                          className="w-6 h-6"
                          width={24}
                          height={24}
                        />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-[#111] mb-1">
                          Scaling Up?
                        </div>
                        <div className="text-sm text-gray-600">
                          Custom Enterprise plans offer higher limits and more
                          cost-effective pricing.
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        enterpriseRef.current?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className="ml-4 bg-[#00B3A4] text-white hover:bg-[#009688] transition-colors"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          {getUserSubscriptionLoading ? (
            <div className="flex justify-center py-12">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          ) : userSubscription?.planName && userSubscription?.billingCycle && (
            <div className="mt-12 mb-8">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200/50 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Your Subscription
                  </h3>
                </div>

                <div
                  className={`grid ${userSubscription?.cancelled ? "grid-cols-2" : "grid-cols-3"} gap-8 items-center`}
                >
                  <div className="group">
                    <div className="flex flex-col justify-center bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-center">
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Plan Name
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        {userSubscription?.planName
                          ? userSubscription.planName.charAt(0).toUpperCase() +
                            userSubscription.planName.slice(1)
                          : ""}
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex flex-col justify-center bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-center">
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Billing Cycle
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        {userSubscription?.billingCycle
                          ? userSubscription.billingCycle
                              .charAt(0)
                              .toUpperCase() +
                            userSubscription.billingCycle.slice(1)
                          : ""}
                      </div>
                    </div>
                  </div>

                  {!userSubscription?.cancelled && (
                    <div className="group flex flex-col gap-4">
                      <Button
                        className="w-full bg-[#2fceb9] hover:bg-[#26a594]"
                        onClick={() => {
                          setChangingPlan(true);
                          setTimeout(() => {
                            document
                              .getElementById("subscription-plans")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }}
                        disabled={
                          requestCancelSubscriptionLoading ||
                          requestSubscriptionStripeCheckoutSessionLoading ||
                          requestSubscriptionDetailsLoading
                        }
                      >
                        Change Plan
                      </Button>
                      <Button
                        className="w-full bg-[#2fceb9] hover:bg-[#26a594]"
                        onClick={confirmCancelSubscription}
                        disabled={
                          requestCancelSubscriptionLoading ||
                          requestSubscriptionStripeCheckoutSessionLoading ||
                          requestSubscriptionDetailsLoading
                        }
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  )}
                </div>

                {userSubscription?.subscriptionEndDate && (
                  <div className="mt-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="grid grid-cols-2 gap-8 items-center">
                        <div className="flex items-center justify-center">
                          <div className="text-sm font-medium text-gray-500 uppercase tracking-wide text-center">
                            Your subscription will end on{" "}
                            <span className="font-bold text-gray-900">
                              {new Date(
                                userSubscription.subscriptionEndDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <Button
                            className="w-full bg-[#2fceb9] hover:bg-[#26a594]"
                            onClick={() => {
                              setChangingPlan(true);
                              setTimeout(() => {
                                document
                                  .getElementById("subscription-plans")
                                  ?.scrollIntoView({ behavior: "smooth" });
                              }, 100);
                            }}
                            disabled={
                              requestCancelSubscriptionLoading ||
                              requestSubscriptionStripeCheckoutSessionLoading ||
                              requestSubscriptionDetailsLoading
                            }
                          >
                            Renew Subscription
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!getUserSubscriptionLoading && ((!userSubscription?.planName && !userSubscription?.billingCycle) ||
            changingPlan) && (
            <div id="subscription-plans" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Subscription Plans
              </h2>

              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center bg-gray-100 rounded-full p-1 shadow-sm relative">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      billingCycle === "monthly"
                        ? "bg-white shadow-sm text-gray-900 ring-1 ring-gray-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 relative ${
                      billingCycle === "annual"
                        ? "bg-white shadow-sm text-gray-900 ring-1 ring-gray-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Annual
                    <span className="absolute -top-2 -right-8 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      Best Value
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptionPlans.map((plan, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle>{plan.name}</CardTitle>
                        {billingCycle === "annual" && (
                          <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                            Save {plan.annualSavings}%
                          </span>
                        )}
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-2">
                        {billingCycle === "monthly" ? (
                          <>
                            <span className="text-3xl font-bold">
                              ${plan.monthlyPrice}
                            </span>
                            <span className="text-muted-foreground">
                              /month
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-3xl font-bold">
                              ${(plan.annualPrice / 12).toFixed(2)}
                            </span>
                            <span className="text-muted-foreground">
                              /month
                            </span>
                            <div className="text-sm text-muted-foreground">
                              billed annually (${plan.annualPrice})
                            </div>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start gap-2"
                          >
                            {feature === "No API Access" ? (
                              <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            )}
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={async () => {
                          if (
                            changingPlan &&
                            userSubscription?.planName &&
                            userSubscription?.billingCycle
                          ) {
                            const getSubscriptionDetails =
                              await requestSubscriptionDetails();
                            if (getSubscriptionDetails) {
                              requestSubscriptionStripeCheckoutSession({
                                planName: plan.name.toLowerCase(),
                                billingCycle: billingCycle,
                                cancelExistingSubscription: true,
                              });
                            }
                            return;
                          }

                          requestSubscriptionStripeCheckoutSession({
                            planName: plan.name.toLowerCase(),
                            billingCycle: billingCycle,
                          });
                        }}
                        disabled={
                          requestSubscriptionDetailsLoading ||
                          requestSubscriptionStripeCheckoutSessionLoading ||
                          requestCancelSubscriptionLoading ||
                          (!userSubscription?.cancelled &&
                            isCurrentPlan(plan.name, billingCycle))
                        }
                      >
                        {requestSubscriptionDetailsLoading ||
                        requestSubscriptionStripeCheckoutSessionLoading
                          ? "Loading..."
                          : !userSubscription?.cancelled && isCurrentPlan(plan.name, billingCycle)
                            ? "Current Plan"
                            : "Subscribe"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div ref={enterpriseRef} className="mt-8">
                <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-4">Enterprise</h2>
                        <p className="text-muted-foreground mb-6 max-w-2xl">
                          Large organizations and businesses that require
                          extensive customization, full control over their
                          environments, and a direct line to customer support.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {enterpriseFeatures.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <IconComponent className="h-4 w-4 text-[#2fceb9]" />
                                <span className="text-sm">{feature.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          className="bg-[#2fceb9] hover:bg-[#26a594] text-white px-8 py-3"
                          onClick={() => router.replace("/help")}
                        >
                          Talk to Sales
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog.Root
        open={cancelSubscriptionDialogOpen}
        onOpenChange={setCancelSubscriptionDialogOpen}
      >
        <Dialog.Portal
          container={
            typeof document !== "undefined" ? document.body : undefined
          }
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-[999]" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[1000] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
              Cancel Subscription
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground">
              Are you sure you want to cancel your subscription? You will lose
              access to subscription benefits at the end of your current billing
              period. This action cannot be undone.
            </Dialog.Description>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCancelSubscriptionDialogOpen(false);
                }}
                disabled={requestCancelSubscriptionLoading}
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await requestCancelSubscription();
                  setCancelSubscriptionDialogOpen(false);
                  setChangingPlan(false);
                }}
                disabled={requestCancelSubscriptionLoading}
              >
                {requestCancelSubscriptionLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Subscription"
                )}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Page;
