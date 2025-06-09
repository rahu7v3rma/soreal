import {
  Clock,
  Cpu,
  CreditCard,
  Database,
  Headphones,
  Shield,
  Users,
} from "lucide-react";

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
    popular: false,
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
    popular: true,
  },
];

export const enterpriseFeatures = [
  { icon: Shield, text: "Secure OAuth Login" },
  { icon: Users, text: "Multi-User Support" },
  { icon: Shield, text: "AI-Powered Content Guardrails" },
  { icon: Database, text: "Data Export" },
  { icon: Cpu, text: "Custom Model Training" },
  { icon: Clock, text: "Higher API Rate Limits" },
  { icon: Headphones, text: "24/7 Support" },
  { icon: CreditCard, text: "Credits Don't Expire" },
];
