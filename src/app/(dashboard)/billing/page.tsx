"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/shared/alert";
import { Button } from "@/components/shared/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shared/card";
import { Slider } from "@/components/shared/slider";
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
import { useSupabase } from "@/context/supabase";
import {
  AlertCircle,
  Calculator,
  Check,
  CheckCircle2,
  Layers,
  Minus,
  Plus,
  Scissors,
  Search,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Page = () => {
  const { userCredits } = useSupabase();
  const searchParams = useSearchParams();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState([50]);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [creatorPackQuantity, setCreatorPackQuantity] = useState(1);
  const [essentialsPackQuantity, setEssentialsPackQuantity] = useState(1);

  const enterpriseRef = useRef<HTMLDivElement>(null);

  const standardCredits = imageCount[0] * STANDARD_IMAGE_CREDITS;
  const premiumCredits = imageCount[0] * PREMIUM_IMAGE_CREDITS;
  const backgroundRemovalCredits =
    imageCount[0] * REMOVE_BACKGROUND_IMAGE_CREDITS;
  const upscaleCredits = imageCount[0] * UPSCALE_IMAGE_CREDITS;

  const handleSliderChange = (value: number[]) => {
    setImageCount(value);
  };

  useEffect(() => {
    const success = searchParams.get("credit_payment_success");
    if (success) {
      setSuccessMessage("Your credits were successfully purchased!");
    }
    const failed = searchParams.get("credit_payment_failed");
    if (failed) {
      setErrorMessage(
        "There was an error processing your payment. Please try again. Contact support if the money has been charged."
      );
    }
  }, [searchParams]);

  return (
    <div className="container max-w-7xl py-10">
      <h1 className="text-3xl font-bold mb-6">Billing & Credits</h1>

      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-600">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="flex">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Your Credit Balance</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6 text-center">
                <div className="text-2xl text-muted-foreground mb-3">
                  Credits Balance
                </div>
                <div className="text-6xl font-bold" id="billing-credit-amount">
                  {userCredits?.creditBalance?.toLocaleString() || "0"}
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
                          12,450
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
                          1,250
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
                        <span className="text-gray-600">Credits Reset On</span>
                        <span className="font-medium text-gray-900">
                          December 15, 2025
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Subscription Credits Remaining
                        </span>
                        <span className="font-medium text-gray-900">
                          250 out of 1,000
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
              <CardDescription>
                Requires an active subscription. Credits never expire.
              </CardDescription>
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
                                setCreatorPackQuantity(creatorPackQuantity + 1);
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
                          onClick={() => {}}
                        >
                          {pkg.name === "Creator Pack"
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
              <label className="text-sm font-medium">Number of Images</label>
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
                <span className="font-medium text-[#111]">Standard Images</span>
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
                <span className="font-medium text-[#111]">Premium Images</span>
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
                    <Image
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

      <div className="mb-12">
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
                      <span className="text-muted-foreground">/month</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">
                        ${(plan.annualPrice / 12).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">/month</span>
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
                    <li key={featureIndex} className="flex items-start gap-2">
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
                <Button className="w-full">Subscribe</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div ref={enterpriseRef} className="mb-8">
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Enterprise</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl">
                  Large organizations and businesses that require extensive
                  customization, full control over their environments, and a
                  direct line to customer support.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enterpriseFeatures.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-[#2fceb9]" />
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button className="bg-[#2fceb9] hover:bg-[#26a594] text-white px-8 py-3">
                  Talk to Sales
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
