"use client";

import { useToast } from "@/components/shared/toast";
import { ACCESS_TOKEN_COOKIE_KEY } from "@/constants/cookies";
import usePaths from "@/hooks/paths";
import { supabase } from "@/lib/supabase/client";
import { generateId } from "@/lib/utils";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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
}

export interface UserCredits {
  creditBalance: number | null;
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
  image_prompt_url: string | null;
  image_prompt_strength: number | null;
  image_url: string | null;
  scale: number | null;
  credit_requirement: number | null;
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

interface SupabaseContextType {
  session: Session | null;
  authUser: AuthUser | null;
  userProfile: UserProfile | null;
  userCredits: UserCredits | null;
  generations: Generation[];
  apiKeys: ApiKey[];
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
  createUserCredits: () => Promise<boolean>;
  createUserCreditsLoading: boolean;
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
  getUserCredits: () => Promise<boolean>;
  getUserCreditsLoading: boolean;
  logout: () => Promise<boolean>;
  logoutLoading: boolean;
  deleteUser: () => Promise<boolean>;
  deleteUserLoading: boolean;
  getUserGenerations: () => Promise<boolean>;
  getUserGenerationsLoading: boolean;
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
  }: {
    username?: string;
    bio?: string;
    generationsNotification?: boolean;
    aiExperience?: string;
    usageGoals?: string[];
    interests?: string[];
    isOnboarded?: boolean;
    avatarUrl?: string;
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
  uploadImage: (
    file: File,
    imageType: "reference" | "avatar"
  ) => Promise<string | null>;
  uploadImageLoading: boolean;
  deleteUserGeneration: (imageUrl: string) => Promise<boolean>;
  deleteUserGenerationLoading: boolean;
  refreshSessionLoading: boolean;
  joinWaitlist: ({
    name,
    email,
  }: {
    name: string;
    email: string;
  }) => Promise<boolean>;
  joinWaitlistLoading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType>({
  session: null,
  authUser: null,
  userProfile: null,
  userCredits: null,
  generations: [],
  apiKeys: [],
  changePasswordEmail: null,
  setChangePasswordEmail: () => {},
  signupLoading: false,
  signup: () => Promise.resolve(false),
  createUserProfile: () => Promise.resolve(false),
  createUserProfileLoading: false,
  createUserCredits: () => Promise.resolve(false),
  createUserCreditsLoading: false,
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
  getUserCredits: () => Promise.resolve(false),
  getUserCreditsLoading: false,
  logout: () => Promise.resolve(false),
  logoutLoading: false,
  deleteUser: () => Promise.resolve(false),
  deleteUserLoading: false,
  getUserGenerations: () => Promise.resolve(false),
  getUserGenerationsLoading: false,
  getApiKeys: () => Promise.resolve(false),
  getApiKeysLoading: false,
  updateUserProfile: () => Promise.resolve(false),
  updateUserProfileLoading: false,
  addApiKey: () => Promise.resolve(false),
  addApiKeyLoading: false,
  updateApiKey: () => Promise.resolve(false),
  updateApiKeyLoading: false,
  uploadImage: () => Promise.resolve(""),
  uploadImageLoading: false,
  deleteUserGeneration: () => Promise.resolve(false),
  deleteUserGenerationLoading: false,
  refreshSessionLoading: false,
  joinWaitlist: () => Promise.resolve(false),
  joinWaitlistLoading: false,
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { isDashboardPath } = usePaths();
  const router = useRouter();
  const pathname = usePathname();

  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [changePasswordEmail, setChangePasswordEmail] = useState<string | null>(
    null
  );
  const [signupLoading, setSignupLoading] = useState(false);
  const [createUserProfileLoading, setCreateUserProfileLoading] =
    useState(false);
  const [createUserCreditsLoading, setCreateUserCreditsLoading] =
    useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [updateAuthUserLoading, setUpdateAuthUserLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [getSessionLoading, setGetSessionLoading] = useState<boolean>(false);
  const [getAuthUserLoading, setGetAuthUserLoading] = useState<boolean>(false);
  const [getUserProfileLoading, setGetUserProfileLoading] =
    useState<boolean>(false);
  const [updateUserProfileLoading, setUpdateUserProfileLoading] =
    useState(false);
  const [getUserCreditsLoading, setGetUserCreditsLoading] =
    useState<boolean>(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [getUserGenerationsLoading, setGetUserGenerationsLoading] =
    useState(false);
  const [getApiKeysLoading, setGetApiKeysLoading] = useState(false);
  const [addApiKeyLoading, setAddApiKeyLoading] = useState(false);
  const [updateApiKeyLoading, setUpdateApiKeyLoading] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [deleteUserGenerationLoading, setDeleteUserGenerationLoading] =
    useState(false);
  const [refreshSessionLoading, setRefreshSessionLoading] = useState(false);
  const [joinWaitlistLoading, setJoinWaitlistLoading] = useState(false);

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
            cause: error?.cause,
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
        });

        return true;
      }

      const createUserProfile = await supabase
        .from("user_profiles")
        .insert({
          user_id: authUser?.id,
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
      });

      return true;
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? error.cause : undefined,
        },
      });

      return false;
    } finally {
      setCreateUserProfileLoading(false);
    }
  };

  const createUserCredits = async () => {
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

      if (userCredits) {
        return true;
      }

      setCreateUserCreditsLoading(true);

      const getUserCredits = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", authUser?.id)
        .single();
      if (getUserCredits.data) {
        setUserCredits({
          creditBalance: getUserCredits.data.credit_balance,
        });
        return true;
      }

      const createUserCredits = await supabase
        .from("user_credits")
        .insert({
          user_id: authUser.id,
        })
        .select()
        .single();
      if (!createUserCredits.data || createUserCredits.error) {
        throw new Error("Failed to create user credits", {
          cause: createUserCredits,
        });
      }
      setUserCredits({
        creditBalance: createUserCredits.data.credit_balance,
      });

      return true;
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? error.cause : undefined,
        },
      });

      return false;
    } finally {
      setCreateUserCreditsLoading(false);
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
          cause: error instanceof Error ? error.cause : undefined,
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
          cause: error?.cause,
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
          cause: error instanceof Error ? error.cause : undefined,
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
            cause: error instanceof Error ? error.cause : undefined,
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
            cause: error instanceof Error ? error.cause : undefined,
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
      });

      return true;
    } catch (error: unknown) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: {
            cause: error instanceof Error ? error.cause : undefined,
          },
        });
      }

      setUserProfile(null);

      return false;
    } finally {
      setGetUserProfileLoading(false);
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
  }: {
    username?: string;
    bio?: string;
    generationsNotification?: boolean;
    aiExperience?: string;
    usageGoals?: string[];
    interests?: string[];
    isOnboarded?: boolean;
    avatarUrl?: string;
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
          cause: error?.cause,
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

  const getUserCredits = async () => {
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

      setGetUserCreditsLoading(true);

      const getUserCredits = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", authUser?.id)
        .single();
      if (!getUserCredits.data) {
        throw new Error("No user credits found", {
          cause: getUserCredits,
        });
      }

      setUserCredits({
        creditBalance: getUserCredits.data.credit_balance,
      });

      return true;
    } catch (error: unknown) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: {
            cause: error instanceof Error ? error.cause : undefined,
          },
        });
      }

      setUserCredits(null);

      return false;
    } finally {
      setGetUserCreditsLoading(false);
    }
  };

  const logout = async () => {
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
      setUserCredits(null);
      setGenerations([]);
      setApiKeys([]);

      Cookies.remove(ACCESS_TOKEN_COOKIE_KEY);

      if (pathname !== "/change-password") {
        toast({
          title: "Successfully logged out",
          duration: 5000,
        });
      }

      router.push("/login");

      return true;
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? error.cause : undefined,
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
        throw new Error("User not authenticated", {
          cause: "User not authenticated",
        });
      }

      setDeleteUserLoading(true);

      const response = await axios.delete("/api/user/", {
        headers: {
          authorization: session?.accessToken,
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
          cause: error instanceof Error ? error.cause : undefined,
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
          extra: { cause: error instanceof Error ? error.cause : undefined },
        });
      }

      setGenerations([]);

      return false;
    } finally {
      setGetUserGenerationsLoading(false);
    }
  };

  const getApiKeys = async () => {
    try {
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
            cause: error instanceof Error ? error.cause : undefined,
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
          cause: error?.cause,
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
          cause: error?.cause,
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

  const uploadImage = async (file: File, imageType: "reference" | "avatar") => {
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
          cause: error instanceof Error ? error.cause : undefined,
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
          cause: error instanceof Error ? error.cause : undefined,
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

  const refreshSession = async () => {
    try {
      setRefreshSessionLoading(true);

      const getSession = await supabase.auth.refreshSession();
      if (!getSession.data.session) {
        throw new Error("No session found", {
          cause: getSession,
        });
      }

      return true;
    } catch (error: unknown) {
      if (isDashboardPath) {
        Sentry.captureException(error, {
          extra: {
            cause: error instanceof Error ? error.cause : undefined,
          },
        });
      }

      setSession(null);

      return false;
    } finally {
      setGetSessionLoading(false);
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
      getUserProfile();
      getUserCredits();
      getUserGenerations();
      getApiKeys();
    }
  };

  const reloadSession = async () => {
    const refreshSessionResponse = await refreshSession();
    if (refreshSessionResponse) {
      await loadSession();
    }
  };

  const joinWaitlist = async ({
    name,
    email,
  }: {
    name: string;
    email: string;
  }) => {
    try {
      setJoinWaitlistLoading(true);

      const joinWaitlistResponse = await supabase.from("join_waitlist").insert({
        name,
        email,
      });
      if (joinWaitlistResponse.error) {
        throw new Error("Failed to join waitlist", {
          cause: joinWaitlistResponse,
        });
      }

      toast({
        title: "Successfully joined the waitlist",
        duration: 5000,
      });

      return true;
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          cause: error?.cause,
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
    const reloadSessionInterval = setInterval(
      () => {
        reloadSession();
      },
      1000 * 60 * 15
    ); // 15 minutes

    return () => clearInterval(reloadSessionInterval);
  }, [session]);

  useEffect(() => {
    if (userProfile) {
      if (!userProfile?.isOnboarded) {
        if (pathname !== "/change-password") {
          router.push("/onboarding");
        }
      }
    }
  }, [userProfile]);

  const value = {
    session,
    authUser,
    userProfile,
    userCredits,
    generations,
    apiKeys,
    changePasswordEmail,
    setChangePasswordEmail,
    signup,
    signupLoading,
    createUserProfile,
    createUserProfileLoading,
    createUserCredits,
    createUserCreditsLoading,
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
    getUserCredits,
    getUserCreditsLoading,
    logout,
    logoutLoading,
    deleteUser,
    deleteUserLoading,
    getUserGenerations,
    getUserGenerationsLoading,
    getApiKeys,
    getApiKeysLoading,
    updateUserProfile,
    updateUserProfileLoading,
    addApiKey,
    addApiKeyLoading,
    updateApiKey,
    updateApiKeyLoading,
    uploadImage,
    uploadImageLoading,
    deleteUserGeneration,
    deleteUserGenerationLoading,
    refreshSessionLoading,
    joinWaitlist,
    joinWaitlistLoading,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
