import { USER_SUBSCRIPTION_COOKIE_KEY, ACCESS_TOKEN_COOKIE_KEY } from "@/constants/cookies";
import Cookies from "js-cookie";

export const setUserSubscriptionCookie = ({
  planName,
  isExpired,
}: {
  planName: string;
  isExpired: boolean;
}) => {
  Cookies.set(
    USER_SUBSCRIPTION_COOKIE_KEY,
    JSON.stringify({ planName, isExpired })
  );
};

export const removeUserSubscriptionCookie = () => {
  Cookies.remove(USER_SUBSCRIPTION_COOKIE_KEY);
};

export const isLoggedIn = (): boolean => {
  return !!Cookies.get(ACCESS_TOKEN_COOKIE_KEY);
};
