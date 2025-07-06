"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useSupabase } from "@/context/supabase";
import {
  Eye,
  EyeOff,
  Key,
  Loader,
  Palette,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useConsentCookie } from "@/context/consent-cookie";
import { downloadBlob } from "@/lib/utils/common";
import { generateExportCsv } from "@/lib/utils/settings";
import * as Sentry from "@sentry/nextjs";
import { Bell, Camera, Download, Save, Trash2 } from "lucide-react";
import { useRef } from "react";

const Page = () => {
  const { toast } = useToast();
  const {
    deleteUser,
    deleteUserLoading,
    generations,
    authUser,
    getAuthUserLoading,
    userProfile,
    getUserProfileLoading,
    updateAuthUser,
    updateUserProfile,
    updateAuthUserLoading,
    updateUserProfileLoading,
    uploadImage,
    uploadImageLoading,
  } = useSupabase();
  const { setIsVisible: setCookieConsentVisible } = useConsentCookie();

  const [email, setEmail] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [downloadUserDataLoading, setDownloadUserDataLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const downloadUserData = async () => {
    try {
      setDownloadUserDataLoading(true);

      const csvString = generateExportCsv(generations);

      const dataBlob = new Blob([csvString], {
        type: "text/csv;charset=utf-8;",
      });

      downloadBlob(dataBlob, "my-data.csv");

      toast({
        title: "Successfully downloaded your data",
        variant: "default",
        duration: 5000,
      });
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          cause: error instanceof Error ? error.cause : undefined,
        },
      });

      toast({
        title: "Something went wrong while downloading your data",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setDownloadUserDataLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      if (userProfile.username) {
        setUsername(userProfile.username);
      }
      if (userProfile.bio) {
        setBio(userProfile.bio);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    if (authUser) {
      setEmail(authUser.email);
    }
  }, [authUser]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Settings className="mr-2 h-6 w-6 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email !== authUser?.email) {
                    updateAuthUser({
                      email,
                    });
                  }

                  const updateUserProfileParams: {
                    username?: string;
                    bio?: string;
                  } = {};
                  if (username !== userProfile?.username) {
                    updateUserProfileParams.username = username;
                  }
                  if (bio !== userProfile?.bio) {
                    updateUserProfileParams.bio = bio;
                  }

                  if (Object.keys(updateUserProfileParams).length) {
                    updateUserProfile(updateUserProfileParams);
                  }
                }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {uploadImageLoading ? (
                      <Loader className="animate-spin z-10" />
                    ) : (
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={userProfile?.avatarUrl || ""}
                          alt={"Profile Picture"}
                        />
                        <AvatarFallback className="bg-teal-500 text-white text-5xl">
                          {authUser?.email?.substring(0, 2).toUpperCase() ||
                            "US"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-sm font-medium">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">
                      This will be displayed on your profile and in comments
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Change Avatar
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      multiple={false}
                      ref={avatarInputRef}
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const uploadResponse = await uploadImage(
                            e.target.files[0],
                            "avatar"
                          );
                          if (uploadResponse) {
                            if (avatarInputRef.current) {
                              avatarInputRef.current.value = "";
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="username">Username</Label>
                    {getAuthUserLoading ? (
                      <Loader className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <>
                        <Input
                          id="username"
                          name="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          This is your public display name
                        </p>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="email">Email</Label>
                    {getUserProfileLoading ? (
                      <Loader className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Your email is used for account notifications and
                          recovery
                        </p>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    {getUserProfileLoading ? (
                      <Loader className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          This will be displayed on your profile
                        </p>
                      </>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Data & Privacy</h3>

                    <div className="flex flex-col space-y-2 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        onClick={() => setCookieConsentVisible(true)}
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        Manage Cookies
                      </Button>
                      <p className="text-xs text-muted-foreground ml-6">
                        Customize and manage your cookie preferences
                      </p>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        onClick={downloadUserData}
                      >
                        {downloadUserDataLoading ? (
                          <Loader className="animate-spin mr-2 h-4 w-4" />
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download My Data
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground ml-6">
                        Export all your personal data in a machine-readable
                        format
                      </p>

                      {!showDeleteConfirm ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="justify-start text-destructive hover:text-destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                            id="delete-account-button"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete My Account
                          </Button>
                          <p className="text-xs text-muted-foreground ml-6">
                            Permanently delete your account and all associated
                            data
                          </p>
                        </>
                      ) : (
                        <div className="border border-destructive p-3 rounded-md">
                          <p className="text-sm text-destructive font-medium mb-2">
                            This action cannot be undone. Type "delete my
                            account" to confirm:
                          </p>
                          {deleteUserLoading ? (
                            <div className="flex items-center">
                              <Loader className="animate-spin mr-2 h-4 w-4 text-destructive" />
                            </div>
                          ) : (
                            <>
                              <Input
                                value={deleteConfirmText}
                                onChange={(e) =>
                                  setDeleteConfirmText(e.target.value)
                                }
                                className="mb-2"
                                placeholder="Type 'delete my account' to confirm"
                                id="delete-account-confirm-input"
                              />
                              <div className="flex gap-2">
                                <Button
                                  id="delete-account-confirm-button"
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  disabled={
                                    deleteConfirmText.toLowerCase() !==
                                    "delete my account"
                                  }
                                  onClick={deleteUser}
                                >
                                  Confirm Deletion
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteConfirmText("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateAuthUserLoading || updateUserProfileLoading}
                  >
                    {updateAuthUserLoading || updateUserProfileLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  if (newPassword !== confirmPassword) {
                    toast({
                      title: "Passwords do not match",
                      variant: "destructive",
                    });
                    return;
                  }

                  updateAuthUser({
                    currentPassword,
                    password: newPassword,
                  });
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Your current password"
                      className="mr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-500 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Your new password"
                      className="mr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-500 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="mr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-500 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={
                    updateAuthUserLoading ||
                    !currentPassword.trim() ||
                    !newPassword.trim() ||
                    !confirmPassword.trim()
                  }
                  className="w-full md:w-auto"
                >
                  {updateAuthUserLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Update your settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">
                      Generations Preferences
                    </h3>
                    {updateUserProfileLoading && (
                      <Loader className="h-5 w-5 animate-spin" />
                    )}
                  </div>

                  <>
                    {!updateUserProfileLoading && (
                      <div className="ml-7 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email">Notifications</Label>
                            <p className="text-xs text-muted-foreground">
                              Receive notifications about your generations
                            </p>
                          </div>
                          <Switch
                            id="email"
                            checked={
                              userProfile?.generationsNotification || false
                            }
                            onCheckedChange={(checked) =>
                              updateUserProfile({
                                generationsNotification: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
