import { z } from "zod";

export const topupCheckoutSessionRequestBodySchema = z.object({
  type: z.enum(["essential", "creator"]),
  quantity: z.number().min(1),
});

export const topupCheckoutSessionResponseDataSchema = z.object({
  url: z.string().min(1),
});

export const topupCheckoutSessionVerifyRequestQuerySchema = z.object({
  CHECKOUT_SESSION_ID: z.string().min(1),
});

export const subscriptionCheckoutSessionRequestBodySchema = z.object({
  planName: z.enum(["starter", "growth"]),
  billingCycle: z.enum(["monthly", "annual"]),
  billingCycleAnchor: z.number().min(1).optional(),
  cancelExistingSubscription: z.boolean().optional(),
  trailEnd: z.number().min(1).optional(),
  existingSubscription: z.object({
    planName: z.enum(["starter", "growth"]),
    billingCycle: z.enum(["monthly", "annual"]),
  }).optional(),
});

export const subscriptionCheckoutSessionResponseDataSchema = z.object({
  url: z.string().min(1),
});

export const subscriptionCheckoutSessionVerifyRequestQuerySchema = z.object({
  CHECKOUT_SESSION_ID: z.string().min(1),
});
