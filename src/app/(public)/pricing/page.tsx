"use client";

import { Button } from "@/components/ui/button";
import { enterpriseFeatures, subscriptionPlans } from "@/constants/pricing";
import {
  Building,
  Calendar,
  Check,
  Image as ImageIcon,
  RotateCcw,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/cookies/client";

const Page = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();

  const getPriceDisplay = (plan: (typeof subscriptionPlans)[0]) => {
    if (!isAnnual) {
      return {
        mainPrice: plan.monthlyPrice,
        period: "/month",
        savings: "",
      };
    }

    const discountedMonthly = Math.ceil(plan.annualPrice / 12);

    return {
      mainPrice: discountedMonthly,
      period: "/month",
      savings: `Save ${plan.annualSavings}%`,
    };
  };

  const handleSubscribeClick = () => {
    if (isLoggedIn()) {
      router.replace("/billing");
    } else {
      router.replace("/login");
    }
  };

  const handleTalkToSales = () => {
    router.replace("/help");
  };

  return (
    <div className="min-h-screen bg-background w-screen">
      <div className="pt-24 pb-16 text-center">
        <h1 className="text-4xl font-semibold tracking-[-0.022em] mb-4">
          Pricing
        </h1>
        <p className="text-xl font-light text-muted-foreground">
          Our pricing plans are transparent and affordable, with no hidden fees
          or surprises.
        </p>

        <div className="flex items-center justify-center mt-8">
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 relative">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                !isAnnual
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all relative ${
                isAnnual
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-8 bg-[#2fceb9] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 mb-24 relative">
        <div className="grid md:grid-cols-2 gap-8">
          {subscriptionPlans.map((plan, index) => {
            const pricing = getPriceDisplay(plan);

            return (
              <div
                key={index}
                className={`rounded-xl border bg-white/50 backdrop-blur-sm p-8 hover:shadow-lg transition-all relative ${
                  plan.popular ? "shadow-md border-primary/20" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#2fceb9] text-white px-3 py-1 rounded-full text-sm">
                    Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="font-medium text-base mb-2 tracking-[-0.01em]">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-[-0.022em]">
                      ${pricing.mainPrice}
                    </span>
                    <span className="text-sm font-light text-muted-foreground">
                      {pricing.period}
                    </span>
                    {isAnnual && pricing.savings && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                        {pricing.savings}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-light text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      {feature.toLowerCase().includes("no api access") ? (
                        <X className="h-4 w-4 text-red-500" />
                      ) : (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                      <span className="text-sm font-light">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full h-11 text-base font-medium ${
                    plan.popular
                      ? "bg-[#2fceb9] text-white hover:bg-[#26a594]"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={handleSubscribeClick}
                >
                  Subscribe
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-6 w-6 text-[#2fceb9]" />
              <span className="text-sm font-light text-muted-foreground">
                Core Image Features Included In All Plans
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RotateCcw className="h-6 w-6 text-[#2fceb9]" />
              <span className="text-sm font-light text-muted-foreground">
                Monthly Credit Resets For Starter & Growth
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Calendar className="h-6 w-6 text-[#2fceb9]" />
              <span className="text-sm font-light text-muted-foreground">
                Annual Billing Saves Teams Up To 25%
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Building className="h-6 w-6 text-[#2fceb9]" />
              <span className="text-sm font-light text-muted-foreground">
                Custom Pricing And Support Available
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border bg-card p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.015em] mb-4">
                Enterprise
              </h3>
              <p className="text-muted-foreground max-w-[600px] font-light">
                Large organizations and businesses that require extensive
                customization, full control over their environments, and a
                direct line to customer support.
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {enterpriseFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-[#2fceb9]" />
                      <span className="font-light">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                className="bg-[#2fceb9] text-white hover:bg-[#26a594]"
                onClick={handleTalkToSales}
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] mb-8">
            Get started today
          </h2>
          <Link href="/signup" passHref>
            <Button
              className="bg-[#2fceb9] text-white hover:bg-[#26a594]"
              size="lg"
            >
              Sign Up Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
