import { USER_SUBSCRIPTION_COOKIE_KEY } from "@/constants/cookies";
import { cookies } from "next/headers";

export const getUserSubscriptionCookie = async (): Promise<{
  planName?: string;
  isExpired?: boolean;
}> => {
  const cookieStore = await cookies();

  return JSON.parse(
    cookieStore.get(USER_SUBSCRIPTION_COOKIE_KEY)?.value || "{}"
  );
};
