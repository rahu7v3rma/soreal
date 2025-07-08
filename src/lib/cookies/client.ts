import { USER_SUBSCRIPTION_COOKIE_KEY, ACCESS_TOKEN_COOKIE_KEY, USER_ROLE_COOKIE_KEY } from "@/constants/cookies";
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

export const setUserRoleCookie = ({
  role_type,
}: {
  role_type: string;
}) => {
  Cookies.set(
    USER_ROLE_COOKIE_KEY,
    JSON.stringify({ role_type })
  );
};

export const removeUserRoleCookie = () => {
  Cookies.remove(USER_ROLE_COOKIE_KEY);
};

export const isLoggedIn = (): boolean => {
  return !!Cookies.get(ACCESS_TOKEN_COOKIE_KEY);
};
