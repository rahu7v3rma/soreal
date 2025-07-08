import { USER_SUBSCRIPTION_COOKIE_KEY, USER_ROLE_COOKIE_KEY } from "@/constants/cookies";
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

export const getUserRoleCookie = async (): Promise<{
  role_type?: string;
}> => {
  const cookieStore = await cookies();

  return JSON.parse(
    cookieStore.get(USER_ROLE_COOKIE_KEY)?.value || "{}"
  );
};
