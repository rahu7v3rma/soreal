import {
  Brain,
  CreditCard,
  Download,
  Filter,
  Gauge,
  LifeBuoy,
  Lock,
  Users,
} from "lucide-react";

export const topUpPackages = [
  {
    name: "Essentials Pack",
    price: 10,
    credits: 1500,
    description: "Best for casual use and test runs",
    features: ["1,500 credits"],
  },
  {
    name: "Creator Pack",
    price: 30,
    credits: 5000,
    description: "Great for solo creators and small teams",
    features: ["5,000 credits"],
    discount: "Save 10%",
    popular: true,
  },
];

export const subscriptionPlans = [
  {
    name: "Starter",
    monthlyPrice: 15,
    annualPrice: 153,
    credits: 1000,
    description: "Ideal for hobbyists and light users",
    features: [
      "1,000 Credits Per Month",
      "Credits Reset Monthly",
      "Add-On Credits Anytime",
      "Access To All Core Features",
      "No API Access",
    ],
    annualSavings: 15,
  },
  {
    name: "Growth",
    monthlyPrice: 49,
    annualPrice: 441,
    credits: 3500,
    description: "Built for creators, small teams, and API use",
    features: [
      "3,500 Credits Per Month",
      "Credits Reset Monthly",
      "Add-On Credits Anytime",
      "API Access Included",
      "Priority Support",
    ],
    annualSavings: 25,
  },
];

export const enterpriseFeatures = [
  { icon: Lock, text: "Secure OAuth Login" },
  { icon: Users, text: "Multi-User Support" },
  { icon: Filter, text: "AI-Powered Content Guardrails" },
  { icon: Download, text: "Data Export" },
  { icon: Brain, text: "Custom Model Training" },
  { icon: Gauge, text: "Higher API Rate Limits" },
  { icon: LifeBuoy, text: "24/7 Support" },
  { icon: CreditCard, text: "Credits Don't Expire" },
];
