"use client";

import { useToast } from "@/components/ui/toast";
import { ACCESS_TOKEN_COOKIE_KEY } from "@/constants/cookies";
import { planNames } from "@/constants/subscription";
import { USER_ROLES } from "@/constants/user-role";
import { useAxios } from "@/hooks/axios";
import usePaths from "@/hooks/paths";
import {
  removeUserSubscriptionCookie,
  setUserSubscriptionCookie,
  setUserRoleCookie,
  removeUserRoleCookie,
} from "@/lib/cookies/client";
import { supabase } from "@/lib/supabase/client";
import { generateId } from "@/lib/utils/common";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface Session {
  accessToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface UserProfile {
  avatarUrl: string | null;
  generationsNotification: boolean | null;
  isOnboarded: boolean | null;
  username: string | null;
  bio: string | null;
  aiExperience: string | null;
  usageGoals: Array<string> | null;
  interests: Array<string> | null;
  cookies: Array<string> | null;
}

export interface UserRole {
  role_type: string | null;
}

export interface UserTopup {
  creditBalance: number | null;
}

export interface UserSubscription {
  creditBalance: number | null;
  planName: string | null;
  billingCycle: string | null;
  creditResetDate: string | null;
  cancelled: boolean | null;
  subscriptionEndDate: string | null;
}

export interface Generation {
  id: string;
  created_at: string;
  prompt: string | null;
  public_url: string | null;
  generation_type: string | null;
  style: string | null;
  aspect_ratio: string | null;
  file_format: string | null;
  ai_model: string | null; // Premium API Migration: Track AI model used
  image_prompt_url: string | null;
  image_prompt_strength: number | null;
  image_url: string | null;
  scale: number | null;
  credit_requirement: number | null;
}

export interface Blog {
  id: string;
  created_at: string;
  updated_at: string;
  title: string | null;
  content: string | null;
  archived: boolean | null;
  slug: string | null;
  featured_image_url: string | null;
}

export interface ApiKey {
  id: string;
  user_id: string;
  api_key: string;
  key_name: string;
  create_image: boolean;
  get_image: boolean;
  created_at: string;
  revoked: boolean;
}

export interface AdminApiKey {
  id: string;
  user_id: string;
  api_key_token: string;
  permissions: string[];
  revoked: boolean;
  created_at: string;
  key_name: string;
}

interface SupabaseContextType {
  session: Session | null;
  authUser: AuthUser | null;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  userTopup: UserTopup | null;
  userSubscription: UserSubscription | null;
  generations: Generation[];
  blogs: Blog[];
  apiKeys: ApiKey[];
  adminApiKeys: AdminApiKey[];
  changePasswordEmail: string | null;
  setChangePasswordEmail: (email: string) => void;
  signupLoading: boolean;
  signup: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<boolean>;
  createUserProfile: () => Promise<boolean>;
  createUserProfileLoading: boolean;
  createUserTopup: () => Promise<boolean>;
  createUserTopupLoading: boolean;
  createUserSubscription: () => Promise<boolean>;
  createUserSubscriptionLoading: boolean;
  resetPassword: ({ email }: { email: string }) => Promise<boolean>;
  resetPasswordLoading: boolean;
  updateAuthUser: ({
    currentPassword,
    password,
    email,
  }: {
    currentPassword?: string;
    password?: string;
    email?: string;
  }) => Promise<boolean>;
  updateAuthUserLoading: boolean;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<boolean>;
  loginLoading: boolean;
  getSession: () => Promise<boolean>;
  getSessionLoading: boolean;
  getAuthUser: () => Promise<boolean>;
  getAuthUserLoading: boolean;
  getUserProfile: () => Promise<boolean>;
  getUserProfileLoading: boolean;
  getUserRole: () => Promise<string | null>;
  getUserRoleLoading: boolean;
  getUserTopup: () => Promise<boolean>;
  getUserTopupLoading: boolean;
  getUserSubscription: () => Promise<boolean>;
  getUserSubscriptionLoading: boolean;
  logout: (options?: { redirectTo: string }) => Promise<boolean>;
  logoutLoading: boolean;
  deleteUser: () => Promise<boolean>;
  deleteUserLoading: boolean;
  getUserGenerations: () => Promise<boolean>;
  getUserGenerationsLoading: boolean;
  getBlogs: ({ archived }: { archived?: boolean }) => Promise<boolean>;
  getBlogsLoading: boolean;
  deleteBlogs: ({ blogIds }: { blogIds: string[] }) => Promise<boolean>;
  deleteBlogsLoading: boolean;
  updateBlogs: ({ blogIds, values }: { blogIds: string[]; values: { archived: boolean } }) => Promise<boolean>;
  updateBlogsLoading: boolean;
  getBlog: ({ id, slug }: { id?: string; slug?: string }) => Promise<Blog | null>;
  getBlogLoading: boolean;
  createBlog: ({
    title,
    content,
    slug,
    featuredImageUrl,
    archived,
  }: {
    title: string;
    content: string;
    slug: string;
    featuredImageUrl?: string;
    archived?: boolean;
  }) => Promise<boolean>;
  createBlogLoading: boolean;
  updateBlog: (
    id: string,
    {
      title,
      content,
      slug,
      featuredImageUrl,
      archived,
    }: {
      title?: string;
      content?: string;
      slug?: string;
      featuredImageUrl?: string;
      archived?: boolean;
    }
  ) => Promise<boolean>;
  updateBlogLoading: boolean;
  deleteBlog: (id: string) => Promise<boolean>;
  deleteBlogLoading: boolean;
  getApiKeys: () => Promise<boolean>;
  getApiKeysLoading: boolean;
  updateUserProfile: ({
    username,
    bio,
    generationsNotification,
    aiExperience,
    usageGoals,
    interests,
    isOnboarded,
    avatarUrl,
    cookies,
  }: {
    username?: string;
    bio?: string;
    generationsNotification?: boolean;
    aiExperience?: string;
    usageGoals?: string[];
    interests?: string[];
    isOnboarded?: boolean;
    avatarUrl?: string;
    cookies?: string[];
  }) => Promise<boolean>;
  updateUserProfileLoading: boolean;
  addApiKey: ({
    createImage,
    getImage,
    keyName,
  }: {
    createImage: boolean;
    getImage: boolean;
    keyName: string;
  }) => Promise<boolean>;
  addApiKeyLoading: boolean;
  updateApiKey: (
    id: string,
    { revoked }: { revoked?: boolean }
  ) => Promise<boolean>;
  updateApiKeyLoading: boolean;
  getAdminApiKeys: () => Promise<boolean>;
  getAdminApiKeysLoading: boolean;
  addAdminApiKey: ({
    permissions,
    keyName,
  }: {
    permissions: string[];
    keyName: string;
  }) => Promise<boolean>;
  addAdminApiKeyLoading: boolean;
  updateAdminApiKey: (
    id: string,
    { revoked }: { revoked?: boolean }
  ) => Promise<boolean>;
  updateAdminApiKeyLoading: boolean;
  uploadImage: (
    file: File,
    imageType: "reference" | "avatar" | "blog"
  ) => Promise<string | null>;
  uploadImageLoading: boolean;
  deleteUserGeneration: (imageUrl: string) => Promise<boolean>;
  deleteUserGenerationLoading: boolean;
  refreshSessionLoading: boolean;
  joinWaitlist: ({
    name,
    email,
    interests,
  }: {
    name: string;
    email: string;
    interests: string[];
  }) => Promise<boolean>;
  joinWaitlistLoading: boolean;
  isStarterPlan: boolean;
  isGrowthPlan: boolean;
  isSubscriptionExpired: boolean;
  totalCredits: number;
}

const SupabaseContext = createContext<SupabaseContextType>({
  session: null,
  authUser: null,
  userProfile: null,
  userRole: null,
  userTopup: null,
  userSubscription: null,
  generations: [],
  blogs: [],
  apiKeys: [],
  adminApiKeys: [],
  changePasswordEmail: null,
  setChangePasswordEmail: () => { },
  signupLoading: false,
  signup: () => Promise.resolve(false),
  createUserProfile: () => Promise.resolve(false),
  createUserProfileLoading: false,

  createUserTopup: () => Promise.resolve(false),
  createUserTopupLoading: false,
  createUserSubscription: () => Promise.resolve(false),
  createUserSubscriptionLoading: false,
  resetPassword: () => Promise.resolve(false),
  resetPasswordLoading: false,
  updateAuthUser: () => Promise.resolve(false),
  updateAuthUserLoading: false,
  login: () => Promise.resolve(false),
  loginLoading: false,
  getSession: () => Promise.resolve(false),
  getSessionLoading: false,
  getAuthUser: () => Promise.resolve(false),
  getAuthUserLoading: false,
  getUserProfile: () => Promise.resolve(false),
  getUserProfileLoading: false,
  getUserRole: () => Promise.resolve(null),
  getUserRoleLoading: false,
  getUserTopup: () => Promise.resolve(false),
  getUserTopupLoading: false,
  getUserSubscription: () => Promise.resolve(false),
  getUserSubscriptionLoading: false,
  logout: (options?: { redirectTo: string }) => Promise.resolve(false),
  logoutLoading: false,
  deleteUser: () => Promise.resolve(false),
  deleteUserLoading: false,
  getUserGenerations: () => Promise.resolve(false),
  getUserGenerationsLoading: false,
  getBlogs: ({ archived }: { archived?: boolean } = {}) => Promise.resolve(false),
  getBlogsLoading: false,
  deleteBlogs: ({ blogIds }: { blogIds: string[] } = { blogIds: [] }) => Promise.resolve(false),
  deleteBlogsLoading: false,
  updateBlogs: ({ blogIds, values }: { blogIds: string[]; values: { archived: boolean } } = { blogIds: [], values: { archived: false } }) => Promise.resolve(false),
  updateBlogsLoading: false,
  getBlog: ({ id, slug }: { id?: string; slug?: string }) => Promise.resolve(null),
  getBlogLoading: false,
  createBlog: () => Promise.resolve(false),
  createBlogLoading: false,
  updateBlog: () => Promise.resolve(false),
  updateBlogLoading: false,
  deleteBlog: () => Promise.resolve(false),
  deleteBlogLoading: false,
  getApiKeys: () => Promise.resolve(false),
  getApiKeysLoading: false,
  updateUserProfile: () => Promise.resolve(false),
  updateUserProfileLoading: false,
  addApiKey: () => Promise.resolve(false),
  addApiKeyLoading: false,
  updateApiKey: () => Promise.resolve(false),
  updateApiKeyLoading: false,
  getAdminApiKeys: () => Promise.resolve(false),
  getAdminApiKeysLoading: false,
  addAdminApiKey: () => Promise.resolve(false),
  addAdminApiKeyLoading: false,
  updateAdminApiKey: () => Promise.resolve(false),
  updateAdminApiKeyLoading: false,
  uploadImage: () => Promise.resolve(""),
  uploadImageLoading: false,
  deleteUserGeneration: () => Promise.resolve(false),
  deleteUserGenerationLoading: false,
  refreshSessionLoading: false,
  joinWaitlist: () => Promise.resolve(false),
  joinWaitlistLoading: false,
  isStarterPlan: false,
  isGrowthPlan: false,
  isSubscriptionExpired: true,
  totalCredits: 0,
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { isDashboardPath } = usePaths();
  const router = useRouter();
  const pathname = usePathname();
  const { sendJoinWaitlistWebhookData } = useAxios();

  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userTopup, setUserTopup] = useState<UserTopup | null>(null);
  const [userSubscription, setUserSubscription] =
    useState<UserSubscription | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [adminApiKeys, setAdminApiKeys] = useState<AdminApiKey[]>([]);
  const [changePasswordEmail, setChangePasswordEmail] = useState<string | null>(
    null
  );
  const [signupLoading, setSignupLoading] = useState(false);
  const [createUserProfileLoading, setCreateUserProfileLoading] =
    useState(false);

  const [createUserTopupLoading, setCreateUserTopupLoading] = useState(false);
  const [createUserSubscriptionLoading, setCreateUserSubscriptionLoading] =
    useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [updateAuthUserLoading, setUpdateAuthUserLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [getSessionLoading, setGetSessionLoading] = useState<boolean>(false);
  const [getAuthUserLoading, setGetAuthUserLoading] = useState<boolean>(false);
  const [getUserProfileLoading, setGetUserProfileLoading] =
    useState<boolean>(false);
  const [getUserRoleLoading, setGetUserRoleLoading] = useState<boolean>(false);
  const [updateUserProfileLoading, setUpdateUserProfileLoading] =
    useState(false);

  const [getUserTopupLoading, setGetUserTopupLoading] =
    useState<boolean>(false);
  const [getUserSubscriptionLoading, setGetUserSubscriptionLoading] =
    useState<boolean>(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [getUserGenerationsLoading, setGetUserGenerationsLoading] =
    useState(false);
  const [getBlogsLoading, setGetBlogsLoading] = useState(false);
  const [deleteBlogsLoading, setDeleteBlogsLoading] = useState(false);
  const [updateBlogsLoading, setUpdateBlogsLoading] = useState(false);
  const [getBlogLoading, setGetBlogLoading] = useState(false);
  const [createBlogLoading, setCreateBlogLoading] = useState(false);
  const [updateBlogLoading, setUpdateBlogLoading] = useState(false);
  const [deleteBlogLoading, setDeleteBlogLoading] = useState(false);
  const [getApiKeysLoading, setGetApiKeysLoading] = useState(false);
  const [addApiKeyLoading, setAddApiKeyLoading] = useState(false);
  const [updateApiKeyLoading, setUpdateApiKeyLoading] = useState(false);
  const [getAdminApiKeysLoading, setGetAdminApiKeysLoading] = useState(false);
  const [addAdminApiKeyLoading, setAddAdminApiKeyLoading] = useState(false);
  const [updateAdminApiKeyLoading, setUpdateAdminApiKeyLoading] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [deleteUserGenerationLoading, setDeleteUserGenerationLoading] =
    useState(false);
  const [refreshSessionLoading, setRefreshSessionLoading] = useState(false);
  const [joinWaitlistLoading, setJoinWaitlistLoading] = useState(false);

  const isStarterPlan = userSubscription?.planName === planNames.starter;
  const isGrowthPlan = userSubscription?.planName === planNames.growth;
  const totalCredits =
    (userSubscription?.creditBalance || 0) + (userTopup?.creditBalance || 0);

  const isSubscriptionExpired = useMemo(() => {
    if (!userSubscription?.subscriptionEndDate) return false;

    const subscriptionEndDate = new Date(userSubscription.subscriptionEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return subscriptionEndDate <= today;
  }, [userSubscription?.subscriptionEndDate]);

  const signup = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setSignupLoading(true);

      if (!/^.+@.+\..+$/.test(email)) {
        throw new Error("Invalid email address", {
          cause: email,
        });
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long", {
          cause: password,
        });
      }

      const signupResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm-email`,
        },
      });
      if (signupResponse.error) {
        throw new Error("Failed to sign up", {
          cause: signupResponse,
        });
      }

      toast({
        title: "Successfully signed up",
        description: "Please check your email for verification",
        duration: 5000,
      });

      return true;
    } catch (error: unknown) {
      const validErrorMessages = [
        "Invalid email address",
        "Password must be at least 8 characters long",
      ];
      if (
        error instanceof Error &&
        validErrorMessages.includes(error.message)
      ) {
        toast({
          title: error.message,
          variant: "destructive",
          duration: 5000,
        });

        Sentry.captureException(error, {
          extra: {
            cause: JSON.stringify(error?.cause),
          },
        });
      } else {
        toast({
          title: "Something went wrong while signing up",
          variant: "destructive",
          duration: 5000,
        });

        Sentry.captureException(error);
      }

      return false;
    } finally {
      setSignupLoading(false);
    }
  };

  const createUserProfile = async () => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      if (userProfile) {
        return true;
      }

      setCreateUserProfileLoading(true);

      const getUserProfile = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", authUser?.id)
        .single();
      if (getUserProfile.data) {
        setUserProfile({
          avatarUrl: getUserProfile.data.avatar_url || null,
          generationsNotification:
            getUserProfile.data.generations_notification || null,
          isOnboarded: getUserProfile.data.is_onboarded || null,
          username: getUserProfile.data.username || null,
          bio: getUserProfile.data.bio || null,
          aiExperience: getUserProfile.data.ai_experience || null,
          usageGoals: getUserProfile.data.usage_goals || null,
          interests: getUserProfile.data.interests || null,
          cookies: getUserProfile.data.cookies || null,
        });

        return true;
      }

      const createUserProfile = await supabase
        .from("user_profiles")
        .insert({
          user_id: authUser?.id,
          generations_notification: false,
        })
        .select()
        .single();
      if (!createUserProfile.data || createUserProfile.error) {
        throw new Error("Failed to create user profile", {
          cause: createUserProfile,
        });
      }
      setUserProfile({
        avatarUrl: createUserProfile.data.avatar_url || null,
        generationsNotification:
          createUserProfile.data.generations_notification || null,
        isOnboarded: createUserProfile.data.is_onboarded || null,
        username: createUserProfile.data.username || null,
        bio: createUserProfile.data.bio || null,
        aiExperience: createUserProfile.data.ai_experience || null,
        usageGoals: createUserProfile.data.usage_goals || null,
        interests: createUserProfile.data.interests || null,
        cookies: createUserProfile.data.cookies || null,
      });

      return true;
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
        },
      });

      return false;
    } finally {
      setCreateUserProfileLoading(false);
    }
  };

  const createUserTopup = async () => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      if (userTopup) {
        return true;
      }

      setCreateUserTopupLoading(true);

      const getUserTopup = await supabase
        .from("user_topup")
        .select("*")
        .eq("user_id", authUser?.id)
        .single();
      if (getUserTopup.data) {
        setUserTopup({
          creditBalance: getUserTopup.data.credit_balance,
        });
        return true;
      }

      const createUserTopup = await supabase
        .from("user_topup")
        .insert({
          user_id: authUser.id,
          credit_balance: 0,
        })
        .select()
        .single();
      if (!createUserTopup.data || createUserTopup.error) {
        throw new Error("Failed to create user topup", {
          cause: createUserTopup,
        });
      }
      setUserTopup({
        creditBalance: createUserTopup.data.credit_balance,
      });

      return true;
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
        },
      });

      return false;
    } finally {
      setCreateUserTopupLoading(false);
    }
  };

  const createUserSubscription = async () => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      if (userSubscription) {
        return true;
      }

      setCreateUserSubscriptionLoading(true);

      const getUserSubscription = await supabase
        .from("user_subscription")
        .select("*")
        .eq("user_id", authUser?.id)
        .single();
      if (getUserSubscription.data) {
        setUserSubscription({
          creditBalance: getUserSubscription.data.credit_balance,
          planName: getUserSubscription.data.plan_name,
          billingCycle: getUserSubscription.data.billing_cycle,
          creditResetDate: getUserSubscription.data.credit_reset_date,
          cancelled: getUserSubscription.data.cancelled,
          subscriptionEndDate: getUserSubscription.data.subscription_end_date,
        });
        return true;
      }

      const createUserSubscription = await supabase
        .from("user_subscription")
        .insert({
          user_id: authUser.id,
          credit_balance: 0,
        })
        .select()
        .single();
      if (!createUserSubscription.data || createUserSubscription.error) {
        throw new Error("Failed to create user subscription", {
          cause: createUserSubscription,
        });
      }
      setUserSubscription({
        creditBalance: createUserSubscription.data.credit_balance,
        planName: createUserSubscription.data.plan_name,
        billingCycle: createUserSubscription.data.billing_cycle,
        creditResetDate: createUserSubscription.data.credit_reset_date,
        cancelled: createUserSubscription.data.cancelled,
        subscriptionEndDate: createUserSubscription.data.subscription_end_date,
      });

      return true;
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
        },
      });

      return false;
    } finally {
      setCreateUserSubscriptionLoading(false);
    }
  };

  const resetPassword = async ({ email }: { email: string }) => {
    try {
      setResetPasswordLoading(true);

      if (!email) {
        throw new Error("Email is required", {
          cause: email,
        });
      }

      const resetPasswordResponse = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/change-password`,
        }
      );
      if (resetPasswordResponse.error) {
        throw new Error("Failed to reset password", {
          cause: resetPasswordResponse,
        });
      }

      setChangePasswordEmail(email);

      toast({
        title: "Successfully sent a password reset link to your email",
        duration: 5000,
      });

      return true;
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
        },
      });

      toast({
        title: "Something went wrong while sending a password reset link",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const updateAuthUser = async ({
    currentPassword,
    password,
    email,
  }: {
    currentPassword?: string;
    password?: string;
    email?: string;
  }) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.email) {
        throw new Error("User not found", {
          cause: authUser,
        });
      }

      setUpdateAuthUserLoading(true);

      const updateUserParams: {
        password?: string;
        email?: string;
      } = {};
      if (password) {
        updateUserParams.password = password;
      }
      if (email) {
        updateUserParams.email = email;
      }

      if (currentPassword) {
        const checkCurrentPassword = await supabase.auth.signInWithPassword({
          email: authUser.email,
          password: currentPassword,
        });
        if (checkCurrentPassword.error) {
          throw new Error("The current password is incorrect", {
            cause: {
              checkCurrentPassword,
              code: "incorrect_current_password",
            },
          });
        }
      }

      const updateUserResponse =
        await supabase.auth.updateUser(updateUserParams);
      if (updateUserResponse.error || !updateUserResponse.data.user?.email) {
        throw new Error("Failed to update password", {
          cause: updateUserResponse,
        });
      }

      await getAuthUser();

      toast({
        title: "Successfully updated your data",
        duration: 5000,
      });

      if (email) {
        toast({
          title: "Please check your email for verification",
          duration: 5000,
        });
      }

      if (password) {
        logout();
      }

      return true;
    } catch (error: any) {
      if (error?.cause?.error?.code === "same_password") {
        toast({
          title: "The new password should be different from the old password.",
          variant: "destructive",
          duration: 5000,
        });
        return false;
      }

      if (error?.cause?.error?.code === "email_exists") {
        toast({
          title: "The email is already in use.",
          variant: "destructive",
          duration: 5000,
        });
        return false;
      }

      if (error?.cause?.code === "incorrect_current_password") {
        toast({
          title: "The current password is incorrect.",
          variant: "destructive",
          duration: 5000,
        });
        return false;
      }

      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      toast({
        title: "Something went wrong while updating your data",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setUpdateAuthUserLoading(false);
    }
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setLoginLoading(true);

      const signinResponse = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!signinResponse.data.session || !signinResponse.data.user?.email) {
        throw new Error("Failed to sign in", {
          cause: signinResponse,
        });
      }

      const sessionResponse = await getSession();
      if (!sessionResponse) {
        throw new Error("Failed to get session", {
          cause: sessionResponse,
        });
      }

      Cookies.set(
        ACCESS_TOKEN_COOKIE_KEY,
        signinResponse.data.session.access_token
      );

      toast({
        title: "Successfully logged in",
        duration: 5000,
      });

      return true;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
        },
      });

      if (error.cause.error.code === "invalid_credentials") {
        toast({
          title: "The email or password is incorrect",
          variant: "destructive",
          duration: 5000,
        });
        return false;
      }

      toast({
        title: "Something went wrong while logging in",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    } finally {
      setLoginLoading(false);
    }
  };

  const getSession = async () => {
    try {
      setGetSessionLoading(true);

      const getSession = await supabase.auth.getSession();
      if (!getSession.data.session) {
        throw new Error("No session found", {
          cause: getSession,
        });
      }

      setSession({
        accessToken: getSession.data.session.access_token,
      });

      Cookies.set(
        ACCESS_TOKEN_COOKIE_KEY,
        getSession.data.session.access_token
      );

      return true;
    } catch (error: unknown) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: {
            cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
          },
        });
      }

      setSession(null);

      return false;
    } finally {
      setGetSessionLoading(false);
    }
  };

  const getAuthUser = async () => {
    try {
      setGetAuthUserLoading(true);

      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      const getUser = await supabase.auth.getUser();
      if (!getUser.data.user?.email) {
        throw new Error("No user found", {
          cause: getUser,
        });
      }

      setAuthUser({
        id: getUser.data.user.id,
        email: getUser.data.user.email,
        createdAt: getUser.data.user.created_at,
      });

      return true;
    } catch (error: unknown) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: {
            cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
          },
        });
      }

      setAuthUser(null);

      return false;
    } finally {
      setGetAuthUserLoading(false);
    }
  };

  const getUserProfile = async () => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      setGetUserProfileLoading(true);

      const getUserProfile = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", authUser?.id)
        .single();
      if (!getUserProfile.data) {
        throw new Error("No user profile found", {
          cause: getUserProfile,
        });
      }

      setUserProfile({
        avatarUrl: getUserProfile.data.avatar_url || null,
        generationsNotification:
          getUserProfile.data.generations_notification || null,
        isOnboarded: getUserProfile.data.is_onboarded || null,
        username: getUserProfile.data.username || null,
        bio: getUserProfile.data.bio || null,
        aiExperience: getUserProfile.data.ai_experience || null,
        usageGoals: getUserProfile.data.usage_goals || null,
        interests: getUserProfile.data.interests || null,
        cookies: getUserProfile.data.cookies || null,
      });

      return true;
    } catch (error: unknown) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: {
            cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
          },
        });
      }

      setUserProfile(null);

      return false;
    } finally {
      setGetUserProfileLoading(false);
    }
  };

  const getUserRole = async () => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      setGetUserRoleLoading(true);

      const getUserRole = await supabase
        .from("user_role")
        .select("*")
        .eq("user_id", authUser?.id)
        .single();

      if (!getUserRole.data) {
        // No role found, return null
        setUserRole(null);
        removeUserRoleCookie();
        return null;
      }

      const userRole = getUserRole.data.role_type || null;

      setUserRole({
        role_type: userRole,
      });

      // Set user role cookie
      if (userRole) {
        setUserRoleCookie({
          role_type: userRole,
        });
      }

      return userRole;
    } catch (error: unknown) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: {
            cause: error instanceof Error ? error.cause : undefined,
          },
        });
      }

      setUserRole(null);
      removeUserRoleCookie();

      return null;
    } finally {
      setGetUserRoleLoading(false);
    }
  };

  const updateUserProfile = async ({
    username,
    bio,
    generationsNotification,
    aiExperience,
    usageGoals,
    interests,
    isOnboarded,
    avatarUrl,
    cookies,
  }: {
    username?: string;
    bio?: string;
    generationsNotification?: boolean;
    aiExperience?: string;
    usageGoals?: string[];
    interests?: string[];
    isOnboarded?: boolean;
    avatarUrl?: string;
    cookies?: string[];
  }) => {
    try {
      setUpdateUserProfileLoading(true);

      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID is required", {
          cause: "User ID is required",
        });
      }

      const updateParams: {
        username?: string;
        bio?: string;
        generations_notification?: boolean;
        ai_experience?: string;
        usage_goals?: string[];
        interests?: string[];
        is_onboarded?: boolean;
        avatar_url?: string;
        cookies?: string[];
      } = {};
      if (username) {
        updateParams.username = username;
      }
      if (bio) {
        updateParams.bio = bio;
      }
      if (typeof generationsNotification === "boolean") {
        updateParams.generations_notification = generationsNotification;
      }
      if (aiExperience) {
        updateParams.ai_experience = aiExperience;
      }
      if (usageGoals) {
        updateParams.usage_goals = usageGoals;
      }
      if (interests) {
        updateParams.interests = interests;
      }
      if (typeof isOnboarded === "boolean") {
        updateParams.is_onboarded = isOnboarded;
      }
      if (avatarUrl) {
        updateParams.avatar_url = avatarUrl;
      }
      if (cookies) {
        updateParams.cookies = cookies;
      }

      const updateUserProfile = await supabase
        .from("user_profiles")
        .update(updateParams)
        .eq("user_id", authUser?.id)
        .select()
        .single();
      if (!updateUserProfile.data || updateUserProfile.error) {
        throw new Error("Failed to update user profile", {
          cause: updateUserProfile,
        });
      }

      setUserProfile({
        avatarUrl: updateUserProfile.data.avatar_url || null,
        generationsNotification:
          updateUserProfile.data.generations_notification || null,
        isOnboarded: updateUserProfile.data.is_onboarded || null,
        username: updateUserProfile.data.username || null,
        bio: updateUserProfile.data.bio || null,
        aiExperience: updateUserProfile.data.ai_experience || null,
        usageGoals: updateUserProfile.data.usage_goals || null,
        interests: updateUserProfile.data.interests || null,
        cookies: updateUserProfile.data.cookies || null,
      });

      toast({
        title: "Successfully updated your profile",
        variant: "default",
        duration: 5000,
      });

      return true;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      toast({
        title: "Something went wrong while updating your profile",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setUpdateUserProfileLoading(false);
    }
  };

  const getUserTopup = async () => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      setGetUserTopupLoading(true);

      const getUserTopup = await supabase
        .from("user_topup")
        .select("*")
        .eq("user_id", authUser?.id)
        .single();
      if (!getUserTopup.data) {
        throw new Error("No user topup found", {
          cause: getUserTopup,
        });
      }

      setUserTopup({
        creditBalance: getUserTopup.data.credit_balance,
      });

      return true;
    } catch (error: unknown) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: {
            cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
          },
        });
      }

      setUserTopup(null);

      return false;
    } finally {
      setGetUserTopupLoading(false);
    }
  };

  const getUserSubscription = async () => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      setGetUserSubscriptionLoading(true);

      const getUserSubscription = await supabase
        .from("user_subscription")
        .select("*")
        .eq("user_id", authUser?.id)
        .single();
      if (!getUserSubscription.data) {
        throw new Error("No user subscription found", {
          cause: getUserSubscription,
        });
      }

      setUserSubscription({
        creditBalance: getUserSubscription.data.credit_balance,
        planName: getUserSubscription.data.plan_name,
        billingCycle: getUserSubscription.data.billing_cycle,
        creditResetDate: getUserSubscription.data.credit_reset_date,
        cancelled: getUserSubscription.data.cancelled,
        subscriptionEndDate: getUserSubscription.data.subscription_end_date,
      });

      return true;
    } catch (error: unknown) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: {
            cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
          },
        });
      }

      setUserSubscription(null);

      return false;
    } finally {
      setGetUserSubscriptionLoading(false);
    }
  };

  const logout = async (options?: { redirectTo: string }) => {
    try {
      setLogoutLoading(true);

      const signout = await supabase.auth.signOut();
      if (signout.error) {
        throw new Error("Failed to sign out", {
          cause: signout,
        });
      }

      setSession(null);
      setAuthUser(null);
      setUserProfile(null);
      setUserRole(null);
      setUserTopup(null);
      setUserSubscription(null);
      setGenerations([]);
      setBlogs([]);
      setApiKeys([]);
      setAdminApiKeys([]);
      removeUserSubscriptionCookie();
      removeUserRoleCookie();

      Cookies.remove(ACCESS_TOKEN_COOKIE_KEY);

      if (pathname !== "/change-password") {
        toast({
          title: "Successfully logged out",
          duration: 5000,
        });
      }

      const redirectTo = options?.redirectTo || "/login";
      router.push(redirectTo);

      return true;
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
        },
      });

      toast({
        title: "Something went wrong while logging out",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setLogoutLoading(false);
    }
  };

  const deleteUser = async () => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: "Session not found",
        });
      }

      setDeleteUserLoading(true);

      const response = await axios.delete("/api/user/", {
        headers: {
          authorization: session.accessToken,
        },
      });
      if (!response?.data?.success) {
        throw new Error(response?.data?.message, {
          cause: {
            response,
          },
        });
      }

      await logout();

      toast({
        title: "Successfully deleted your account",
        variant: "default",
        duration: 5000,
      });

      return true;
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
        },
      });

      toast({
        title: "Something went wrong while deleting your account",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setDeleteUserLoading(false);
    }
  };

  const getUserGenerations = async () => {
    try {
      setGetUserGenerationsLoading(true);

      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("user id is required", {
          cause: { authUser },
        });
      }

      const getUserGenerationsResponse = await supabase
        .from("user_generations")
        .select("*")
        .eq("user_id", authUser?.id)
        .order("created_at", { ascending: false });
      if (!getUserGenerationsResponse.data) {
        throw new Error("failed to get user generations", {
          cause: { getUserGenerationsResponse },
        });
      }

      setGenerations(getUserGenerationsResponse.data);

      return true;
    } catch (error: unknown) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: { cause: error instanceof Error ? JSON.stringify(error.cause) : undefined },
        });
      }

      setGenerations([]);

      return false;
    } finally {
      setGetUserGenerationsLoading(false);
    }
  };

  const getBlogs = async ({ archived }: { archived?: boolean } = {}) => {
    try {
      setGetBlogsLoading(true);

      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID is required", {
          cause: { authUser },
        });
      }

      if (userRole?.role_type !== USER_ROLES.ADMIN) {
        throw new Error("Admin access required", {
          cause: { userRole },
        });
      }

      let query = supabase
        .from("blogs")
        .select("*");

      // Only filter by archived status if the parameter is provided
      if (archived !== undefined) {
        query = query.eq("archived", archived);
      }

      const getBlogsResponse = await query.order("created_at", { ascending: false });

      if (!getBlogsResponse.data) {
        throw new Error("Failed to get blogs", {
          cause: { getBlogsResponse },
        });
      }

      setBlogs(getBlogsResponse.data);

      return true;
    } catch (error: any) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: { cause: JSON.stringify(error?.cause) },
        });
      }

      setBlogs([]);

      return false;
    } finally {
      setGetBlogsLoading(false);
    }
  };

  const deleteBlogs = async ({ blogIds }: { blogIds: string[] }) => {
    try {
      setDeleteBlogsLoading(true);

      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID is required", {
          cause: { authUser },
        });
      }

      if (userRole?.role_type !== USER_ROLES.ADMIN) {
        throw new Error("Admin access required", {
          cause: { userRole },
        });
      }

      if (!blogIds || blogIds.length === 0) {
        return true;
      }

      const response = await supabase
        .from("blogs")
        .delete()
        .in("id", blogIds)
        .select("id");

      if (!response.data || response.error) {
        throw new Error("Failed to delete blogs", {
          cause: { response },
        });
      }

      toast({
        title: `Successfully deleted ${response.data.length} blog${response.data.length !== 1 ? 's' : ''}`,
        duration: 5000,
      });

      // Refresh the blogs list
      await getBlogs({});

      return true;
    } catch (error: any) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: { cause: JSON.stringify(error?.cause) },
        });
      }

      toast({
        title: "Something went wrong while deleting blogs",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setDeleteBlogsLoading(false);
    }
  };

  const updateBlogs = async ({ blogIds, values }: { blogIds: string[]; values: { archived: boolean } }) => {
    try {
      setUpdateBlogsLoading(true);

      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID is required", {
          cause: { authUser },
        });
      }

      if (userRole?.role_type !== USER_ROLES.ADMIN) {
        throw new Error("Admin access required", {
          cause: { userRole },
        });
      }

      if (!blogIds || blogIds.length === 0) {
        return true;
      }

      const updateParams: {
        archived?: boolean;
        updated_at: string;
      } = {
        updated_at: new Date().toISOString(),
      };

      if (typeof values.archived === "boolean") {
        updateParams.archived = values.archived;
      }

      const response = await supabase
        .from("blogs")
        .update(updateParams)
        .in("id", blogIds)
        .select("id");

      if (!response.data || response.error) {
        throw new Error("Failed to update blogs", {
          cause: { response },
        });
      }

      toast({
        title: `Successfully updated ${response.data.length} blog${response.data.length !== 1 ? 's' : ''}`,
        duration: 5000,
      });

      // Refresh the blogs list
      await getBlogs({});

      return true;
    } catch (error: any) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: { cause: JSON.stringify(error?.cause) },
        });
      }

      toast({
        title: "Something went wrong while updating blogs",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setUpdateBlogsLoading(false);
    }
  };



  const getBlog = async ({ id, slug }: { id?: string; slug?: string }): Promise<Blog | null> => {
    try {
      setGetBlogLoading(true);

      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      if (userRole?.role_type !== USER_ROLES.ADMIN) {
        throw new Error("Admin access required", {
          cause: { userRole },
        });
      }

      if (!id && !slug) {
        throw new Error("Either Blog ID or slug is required", {
          cause: { id, slug },
        });
      }

      let getBlogResponse;
      if (id) {
        getBlogResponse = await supabase
          .from("blogs")
          .select("*")
          .eq("id", id)
          .single();
      } else {
        getBlogResponse = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .single();
      }

      if (!getBlogResponse.data) {
        throw new Error("Blog not found", {
          cause: { getBlogResponse },
        });
      }

      return getBlogResponse.data;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: { cause: JSON.stringify(error?.cause) },
      });

      return null;
    } finally {
      setGetBlogLoading(false);
    }
  };

  const createBlog = async ({
    title,
    content,
    slug,
    featuredImageUrl,
    archived,
  }: {
    title: string;
    content: string;
    slug: string;
    featuredImageUrl?: string;
    archived?: boolean;
  }) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      if (userRole?.role_type !== USER_ROLES.ADMIN) {
        throw new Error("Admin access required", {
          cause: { userRole },
        });
      }

      setCreateBlogLoading(true);

      const insertBlog = await supabase
        .from("blogs")
        .insert({
          title,
          content,
          slug,
          featured_image_url: featuredImageUrl || null,
          archived: archived || false,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!insertBlog.data || insertBlog.error) {
        throw new Error("Failed to create blog", {
          cause: insertBlog,
        });
      }

      toast({
        title: "Successfully created blog",
        duration: 5000,
      });

      // Refresh the blogs list
      await getBlogs({});

      return true;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      toast({
        title: "Something went wrong while creating the blog",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setCreateBlogLoading(false);
    }
  };

  const updateBlog = async (
    id: string,
    {
      title,
      content,
      slug,
      featuredImageUrl,
      archived,
    }: {
      title?: string;
      content?: string;
      slug?: string;
      featuredImageUrl?: string;
      archived?: boolean;
    }
  ) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      if (userRole?.role_type !== USER_ROLES.ADMIN) {
        throw new Error("Admin access required", {
          cause: { userRole },
        });
      }

      if (!id) {
        throw new Error("Blog ID is required", {
          cause: { id },
        });
      }

      setUpdateBlogLoading(true);

      const updateParams: {
        title?: string;
        content?: string;
        slug?: string;
        featured_image_url?: string;
        archived?: boolean;
        updated_at: string;
      } = {
        updated_at: new Date().toISOString(),
      };

      if (title) {
        updateParams.title = title;
      }
      if (content) {
        updateParams.content = content;
      }
      if (slug) {
        updateParams.slug = slug;
      }
      if (featuredImageUrl !== undefined) {
        updateParams.featured_image_url = featuredImageUrl;
      }
      if (typeof archived === "boolean") {
        updateParams.archived = archived;
      }

      const updateBlog = await supabase
        .from("blogs")
        .update(updateParams)
        .eq("id", id)
        .select()
        .single();

      if (!updateBlog.data || updateBlog.error) {
        throw new Error("Failed to update blog", {
          cause: updateBlog,
        });
      }

      toast({
        title: "Successfully updated blog",
        duration: 5000,
      });

      // Refresh the blogs list
      await getBlogs({});

      return true;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      toast({
        title: "Something went wrong while updating the blog",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setUpdateBlogLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      if (userRole?.role_type !== USER_ROLES.ADMIN) {
        throw new Error("Admin access required", {
          cause: { userRole },
        });
      }

      setDeleteBlogLoading(true);

      const deleteBlog = await supabase
        .from("blogs")
        .delete()
        .eq("id", id)
        .select()
        .single();

      if (deleteBlog.error) {
        throw new Error("Failed to delete blog", {
          cause: deleteBlog,
        });
      }

      toast({
        title: "Successfully deleted blog",
        duration: 5000,
      });

      // Refresh the blogs list
      await getBlogs({});

      return true;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
        },
      });

      toast({
        title: "Something went wrong while deleting the blog",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setDeleteBlogLoading(false);
    }
  };

  const getApiKeys = async () => {
    try {
      if (!isGrowthPlan) {
        throw new Error("Please upgrade to a growth plan to access API keys", {
          cause: { isGrowthPlan },
        });
      }

      if (isSubscriptionExpired) {
        throw new Error(
          "Your subscription has expired. Please renew to access API keys",
          {
            cause: { isSubscriptionExpired },
          }
        );
      }

      setGetApiKeysLoading(true);

      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      const getUserApiKeys = await supabase
        .from("user_api_keys")
        .select("*")
        .eq("user_id", authUser?.id)
        .order("created_at", { ascending: false });
      if (!getUserApiKeys.data) {
        throw new Error("Failed to fetch API keys", {
          cause: getUserApiKeys,
        });
      }

      setApiKeys(getUserApiKeys.data);

      return true;
    } catch (error: unknown) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: {
            cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
          },
        });
      }

      setApiKeys([]);

      return false;
    } finally {
      setGetApiKeysLoading(false);
    }
  };

  const addApiKey = async ({
    createImage,
    getImage,
    keyName,
  }: {
    createImage: boolean;
    getImage: boolean;
    keyName: string;
  }) => {
    try {
      if (!isGrowthPlan) {
        throw new Error("Please upgrade to a growth plan to access API keys", {
          cause: { isGrowthPlan },
        });
      }

      if (isSubscriptionExpired) {
        throw new Error(
          "Your subscription has expired. Please renew to access API keys",
          {
            cause: { isSubscriptionExpired },
          }
        );
      }

      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      setAddApiKeyLoading(true);

      const insertApiKey = await supabase
        .from("user_api_keys")
        .insert({
          user_id: authUser?.id,
          api_key: generateId(40),
          create_image: createImage,
          get_image: getImage,
          key_name: keyName,
        })
        .select()
        .single();
      if (!insertApiKey.data || insertApiKey.error) {
        throw new Error("Failed to insert API key", {
          cause: insertApiKey,
        });
      }

      toast({
        title: "Successfully created API key",
        duration: 5000,
      });

      return true;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      toast({
        title: "Something went wrong while creating your API key",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setAddApiKeyLoading(false);
    }
  };

  const updateApiKey = async (
    id: string,
    { revoked }: { revoked?: boolean }
  ) => {
    try {
      if (!isGrowthPlan) {
        throw new Error("Please upgrade to a growth plan to access API keys", {
          cause: { isGrowthPlan },
        });
      }

      if (isSubscriptionExpired) {
        throw new Error(
          "Your subscription has expired. Please renew to access API keys",
          {
            cause: { isSubscriptionExpired },
          }
        );
      }

      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      setUpdateApiKeyLoading(true);

      const findParams: {
        id?: string;
      } = {};
      if (id) {
        findParams.id = id;
      }

      const updateParams: {
        revoked?: boolean;
      } = {};
      if (revoked) {
        updateParams.revoked = revoked;
      }

      const revokeApiKey = await supabase
        .from("user_api_keys")
        .update(updateParams)
        .eq("id", id)
        .select()
        .single();
      if (!revokeApiKey.data || revokeApiKey.error) {
        throw new Error("Failed to revoke API key", {
          cause: revokeApiKey,
        });
      }

      toast({
        title: "Successfully updated API key",
        duration: 5000,
      });

      return true;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      toast({
        title: "Something went wrong while updating your API key",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setUpdateApiKeyLoading(false);
    }
  };

  const getAdminApiKeys = async () => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      if (userRole?.role_type !== USER_ROLES.ADMIN) {
        throw new Error("Admin access required", {
          cause: { userRole },
        });
      }

      setGetAdminApiKeysLoading(true);

      const getAdminApiKeys = await supabase
        .from("admin_api_keys")
        .select("*")
        .eq("user_id", authUser?.id)
        .order("created_at", { ascending: false });
      if (!getAdminApiKeys.data) {
        throw new Error("Failed to fetch admin API keys", {
          cause: getAdminApiKeys,
        });
      }

      setAdminApiKeys(getAdminApiKeys.data);

      return true;
    } catch (error: unknown) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: {
            cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
          },
        });
      }

      setAdminApiKeys([]);

      return false;
    } finally {
      setGetAdminApiKeysLoading(false);
    }
  };

  const addAdminApiKey = async ({
    permissions,
    keyName,
  }: {
    permissions: string[];
    keyName: string;
  }) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      if (userRole?.role_type !== USER_ROLES.ADMIN) {
        throw new Error("Admin access required", {
          cause: { userRole },
        });
      }

      setAddAdminApiKeyLoading(true);

      const insertAdminApiKey = await supabase
        .from("admin_api_keys")
        .insert({
          user_id: authUser?.id,
          api_key_token: generateId(40),
          permissions: permissions,
          key_name: keyName,
        })
        .select()
        .single();
      if (!insertAdminApiKey.data || insertAdminApiKey.error) {
        throw new Error("Failed to insert admin API key", {
          cause: insertAdminApiKey,
        });
      }

      toast({
        title: "Successfully created admin API key",
        duration: 5000,
      });

      return true;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      toast({
        title: "Something went wrong while creating your admin API key",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setAddAdminApiKeyLoading(false);
    }
  };

  const updateAdminApiKey = async (
    id: string,
    { revoked }: { revoked?: boolean }
  ) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID not found", {
          cause: authUser,
        });
      }

      if (userRole?.role_type !== USER_ROLES.ADMIN) {
        throw new Error("Admin access required", {
          cause: { userRole },
        });
      }

      setUpdateAdminApiKeyLoading(true);

      const updateParams: {
        revoked?: boolean;
      } = {};
      if (revoked !== undefined) {
        updateParams.revoked = revoked;
      }

      const revokeAdminApiKey = await supabase
        .from("admin_api_keys")
        .update(updateParams)
        .eq("id", id)
        .select()
        .single();
      if (!revokeAdminApiKey.data || revokeAdminApiKey.error) {
        throw new Error("Failed to revoke admin API key", {
          cause: revokeAdminApiKey,
        });
      }

      toast({
        title: "Successfully updated admin API key",
        duration: 5000,
      });

      return true;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      toast({
        title: "Something went wrong while updating your admin API key",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setUpdateAdminApiKeyLoading(false);
    }
  };

  const uploadImage = async (
    file: File,
    imageType: "reference" | "avatar" | "blog"
  ) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User ID is required", {
          cause: authUser,
        });
      }

      if (!userProfile) {
        throw new Error("User profile not found", {
          cause: userProfile,
        });
      }

      if (!file) {
        throw new Error("File is required", {
          cause: file,
        });
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("File is not an image", {
          cause: file,
        });
      }

      setUploadImageLoading(true);

      const fileExt = file.name.split(".").pop();
      const filePath = `users/${authUser?.id}/${imageType}/${Date.now()}.${fileExt}`;

      const uploadAssets = await supabase.storage
        .from("assets")
        .upload(filePath, file);
      if (uploadAssets.error) {
        throw new Error("Failed to upload image", {
          cause: {
            uploadAssets,
          },
        });
      }

      const getPublicUrl = supabase.storage
        .from("assets")
        .getPublicUrl(filePath);
      if (!getPublicUrl.data?.publicUrl) {
        throw new Error("Failed to get public URL", {
          cause: {
            filePath,
            getPublicUrl,
          },
        });
      }

      toast({
        title: "Successfully uploaded your image",
        duration: 5000,
        variant: "default",
      });

      if (imageType === "avatar") {
        await updateUserProfile({
          avatarUrl: getPublicUrl.data.publicUrl,
        });

        setUserProfile({
          ...userProfile,
          avatarUrl: getPublicUrl.data.publicUrl,
        });
      }

      return getPublicUrl.data.publicUrl;
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
        },
      });

      toast({
        title: "Something went wrong while uploading your image",
        variant: "destructive",
        duration: 5000,
      });

      return null;
    } finally {
      setUploadImageLoading(false);
    }
  };

  const deleteUserGeneration = async (imageUrl: string) => {
    try {
      setDeleteUserGenerationLoading(true);

      if (!session?.accessToken) {
        throw new Error("Session not found", {
          cause: session,
        });
      }

      if (!authUser?.id) {
        throw new Error("User not found", {
          cause: authUser,
        });
      }

      if (!imageUrl) {
        throw new Error("Image not found", {
          cause: imageUrl,
        });
      }

      const deleteUserGeneration = await supabase
        .from("user_generations")
        .delete()
        .eq("public_url", imageUrl)
        .eq("user_id", authUser?.id);
      if (deleteUserGeneration.error) {
        throw new Error("Failed to delete user generation", {
          cause: deleteUserGeneration,
        });
      }

      const deleteAssetGeneration = await supabase.storage
        .from("assets")
        .remove([
          `users/${authUser?.id}/generations/${imageUrl.split("/").pop()}`,
        ]);
      if (deleteAssetGeneration.error) {
        throw new Error("Failed to delete asset generation", {
          cause: deleteAssetGeneration,
        });
      }

      toast({
        title: "Successfully deleted your image",
        duration: 5000,
      });

      getUserGenerations();

      return true;
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? JSON.stringify(error.cause) : undefined,
        },
      });

      toast({
        title: "Something went wrong while deleting your image",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setDeleteUserGenerationLoading(false);
    }
  };

  const loadSession = async () => {
    if (!session?.accessToken) {
      getSession();
    }
    if (!authUser?.id) {
      getAuthUser();
    }
    if (session?.accessToken && authUser?.id) {
      if (!userProfile) {
        getUserProfile();
      }
      if (!userTopup) {
        getUserTopup();
      }
      if (!userSubscription) {
        getUserSubscription();
      }
      if (!generations) {
        getUserGenerations();
      }
      if (!apiKeys) {
        getApiKeys();
      }
      if (!userRole) {
        getUserRole();
      }
    }
  };

  const joinWaitlist = async ({
    name,
    email,
    interests,
  }: {
    name: string;
    email: string;
    interests: string[];
  }) => {
    try {
      setJoinWaitlistLoading(true);

      const joinWaitlistResponse = await supabase.from("join_waitlist").insert({
        name,
        email,
        interests,
      });
      if (joinWaitlistResponse.error) {
        throw new Error("Failed to join waitlist", {
          cause: joinWaitlistResponse,
        });
      }

      sendJoinWaitlistWebhookData(name, email, interests);

      toast({
        title: "Successfully joined the waitlist",
        duration: 5000,
      });

      return true;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: JSON.stringify(error?.cause),
        },
      });

      toast({
        title: "Something went wrong while joining the waitlist",
        variant: "destructive",
        duration: 5000,
      });

      return false;
    } finally {
      setJoinWaitlistLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, [session, authUser]);

  useEffect(() => {
    if (userProfile) {
      if (!userProfile?.isOnboarded) {
        if (pathname !== "/change-password") {
          router.push("/onboarding");
        }
      }
    }
  }, [userProfile]);

  useEffect(() => {
    setUserSubscriptionCookie({
      planName: userSubscription?.planName || "",
      isExpired: isSubscriptionExpired,
    });
  }, [userSubscription, isSubscriptionExpired]);

  // Listen for auth state changes and sync session state and cookie
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (newSession?.access_token) {
          // Update React state
          setSession({ accessToken: newSession.access_token });
          
          // Update cookie
          Cookies.set(ACCESS_TOKEN_COOKIE_KEY, newSession.access_token);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    if (userRole?.role_type === USER_ROLES.ADMIN) {
      getBlogs({});
      getAdminApiKeys();
    }
  }, [userRole]);

  const value = {
    session,
    authUser,
    userProfile,
    userRole,
    userTopup,
    userSubscription,
    generations,
    blogs,
    apiKeys,
    adminApiKeys,
    changePasswordEmail,
    setChangePasswordEmail,
    signup,
    signupLoading,
    createUserProfile,
    createUserProfileLoading,
    createUserTopup,
    createUserTopupLoading,
    createUserSubscription,
    createUserSubscriptionLoading,
    resetPassword,
    resetPasswordLoading,
    updateAuthUser,
    updateAuthUserLoading,
    login,
    loginLoading,
    getSession,
    getSessionLoading,
    getAuthUser,
    getAuthUserLoading,
    getUserProfile,
    getUserProfileLoading,
    getUserRole,
    getUserRoleLoading,
    getUserTopup,
    getUserTopupLoading,
    getUserSubscription,
    getUserSubscriptionLoading,
    logout,
    logoutLoading,
    deleteUser,
    deleteUserLoading,
    getUserGenerations,
    getUserGenerationsLoading,
    getBlogs,
    getBlogsLoading,
    deleteBlogs,
    deleteBlogsLoading,
    updateBlogs,
    updateBlogsLoading,
    getBlog,
    getBlogLoading,
    createBlog,
    createBlogLoading,
    updateBlog,
    updateBlogLoading,
    deleteBlog,
    deleteBlogLoading,
    getApiKeys,
    getApiKeysLoading,
    updateUserProfile,
    updateUserProfileLoading,
    addApiKey,
    addApiKeyLoading,
    updateApiKey,
    updateApiKeyLoading,
    getAdminApiKeys,
    getAdminApiKeysLoading,
    addAdminApiKey,
    addAdminApiKeyLoading,
    updateAdminApiKey,
    updateAdminApiKeyLoading,
    uploadImage,
    uploadImageLoading,
    deleteUserGeneration,
    deleteUserGenerationLoading,
    refreshSessionLoading,
    joinWaitlist,
    joinWaitlistLoading,
    isStarterPlan,
    isGrowthPlan,
    isSubscriptionExpired,
    totalCredits,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
