"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useSupabase } from "@/context/supabase";
import { ArrowLeft, ArrowRight, Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { formatDate } from "@/lib/utils/common";
import { Zap } from "lucide-react";
import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, User } from "lucide-react";

import { STYLE_PREFERENCES, SUBJECT_PREFERENCES, USAGE_GOALS, features } from "@/constants/onboarding";
import {
  FolderKanban,
  Share2,
  Shield,
  Sparkles,
  Target,
  UserCircle2,
  Wand2,
} from "lucide-react";

const STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "personal-info", label: "Personal Info" },
  { id: "experience", label: "Experience" },
  { id: "completion", label: "Complete" },
];

const Page = () => {
  const {
    updateUserProfile,
    userProfile,
    uploadImage,
    uploadImageLoading,
    userTopup,
    authUser,
  } = useSupabase();
  const router = useRouter();
  const { toast } = useToast();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [savingStep, setSavingStep] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [aiExperience, setAiExperience] = useState("none");
  const [usageGoals, setUsageGoals] = useState<string[]>([]);
  const [stylePreferences, setStylePreferences] = useState<string[]>([]);
  const [subjectPreferences, setSubjectPreferences] = useState<string[]>([]);
  const [otherGoal, setOtherGoal] = useState("");

  const goToNextStep = async () => {
    if (currentStepIndex >= STEPS.length - 1) return;

    if (currentStepIndex === 1) {
      const successSavePersonalInfo = await handlePersonalInfoSubmit();
      if (!successSavePersonalInfo) return;
    }

    if (currentStepIndex === 2) {
      await handleExperienceSubmit();
    }

    if (currentStepIndex === 3) {
      await completeOnboarding();
    }

    setCurrentStepIndex(currentStepIndex + 1);
  };

  const goToPreviousStep = () => {
    if (currentStepIndex <= 0) return;
    setCurrentStepIndex(currentStepIndex - 1);
  };

  const completeOnboarding = async () => {
    setSavingStep(true);

    await updateUserProfile({
      isOnboarded: true,
    });

    router.push("/dashboard");

    toast({
      title: "Successfully completed your onboarding",
      variant: "default",
      duration: 5000,
    });

    setSavingStep(false);
  };

  const handlePersonalInfoSubmit = async () => {
    if (!username.trim()) {
      toast({
        title: "Please enter a username to continue.",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    }

    setSavingStep(true);

    await updateUserProfile({
      username,
      bio,
    });

    setSavingStep(false);

    return true;
  };

  const handleExperienceSubmit = async () => {
    setSavingStep(true);

    let usageGoalsToSave = usageGoals;
    if (usageGoals.includes("other")) {
      usageGoalsToSave.push(
        'other:' + otherGoal
      );
    }

    await updateUserProfile({
      aiExperience: aiExperience,
      usageGoals: usageGoals,
      interests: [...stylePreferences, ...subjectPreferences],
    });

    setSavingStep(false);
  };

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  useEffect(() => {
    if (userProfile) {
      if (userProfile.username) {
        setUsername(userProfile.username);
      }

      if (userProfile.bio) {
        setBio(userProfile.bio);
      }

      if (userProfile.aiExperience) {
        setAiExperience(userProfile.aiExperience);
      }

      if (userProfile.usageGoals) {
        setUsageGoals(userProfile.usageGoals);
        if (userProfile.usageGoals.includes("other")) {
          const otherGoal = userProfile.usageGoals.find((goal) => goal.startsWith("other:"));
          if (otherGoal) {
            setOtherGoal(otherGoal.replace("other:", ""));
          }
        }
      }

      if (userProfile.interests) {
        // Split existing interests back into style and subject preferences
        const styles = userProfile.interests.filter(interest =>
          STYLE_PREFERENCES.some(style => style.id === interest)
        );
        const subjects = userProfile.interests.filter(interest =>
          SUBJECT_PREFERENCES.some(subject => subject.id === interest)
        );
        setStylePreferences(styles);
        setSubjectPreferences(subjects);
      }
    }
  }, [userProfile]);

  return (
    <div className="space-y-6 w-full max-w-full">
      <Card className="w-full border-none shadow-sm overflow-hidden max-w-none">
        <CardHeader className="text-center pb-2 p-3">
          <CardTitle className="text-xl">Welcome to Soreal</CardTitle>
          <CardDescription className="mx-auto max-w-md text-sm">
            Complete your profile setup to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-4">
          <div className="mb-4 w-full mx-auto">
            <div className="flex justify-between mb-2 px-1 w-full">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${index <= currentStepIndex ? "text-primary" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-300
                      ${
                        index < currentStepIndex
                          ? "bg-primary text-primary-foreground"
                          : index === currentStepIndex
                            ? "border-2 border-primary text-primary"
                            : "border-2 border-muted-foreground text-muted-foreground"
                      }`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs font-medium">{step.label}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="py-2">
            {currentStepIndex === 0 && (
              <Card className="border-none shadow-sm overflow-hidden max-w-full w-full">
                <CardContent className="p-5 md:p-6">
                  <div className="space-y-5 w-full max-w-screen-md mx-auto">
                    <div className="text-center">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <h1 className="text-2xl font-bold tracking-tight mb-2">
                        Welcome to Soreal
                      </h1>
                      <p className="text-muted-foreground text-sm mx-auto">
                        Let's set up your account to get the most out of your AI
                        image generation experience.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                      <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="font-semibold text-base flex items-center mb-3 text-primary">
                          <Wand2 className="h-4 w-4 mr-2" />
                          What you'll be able to do
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <Sparkles className="h-4 w-4 mr-2 text-primary/70 mt-0.5 shrink-0" />
                            <span>Generate AI images with simple prompts</span>
                          </li>
                          <li className="flex items-start">
                            <FolderKanban className="h-4 w-4 mr-2 text-primary/70 mt-0.5 shrink-0" />
                            <span>Organize creations into projects</span>
                          </li>
                          <li className="flex items-start">
                            <Wand2 className="h-4 w-4 mr-2 text-primary/70 mt-0.5 shrink-0" />
                            <span>Enhance prompts for better results</span>
                          </li>
                          <li className="flex items-start">
                            <Share2 className="h-4 w-4 mr-2 text-primary/70 mt-0.5 shrink-0" />
                            <span>Share your creations with others</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="font-semibold text-base flex items-center mb-3 text-primary">
                          <Target className="h-4 w-4 mr-2" />
                          Our quick setup process
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <UserCircle2 className="h-4 w-4 mr-2 text-primary/70 mt-0.5 shrink-0" />
                            <span>Confirm your basic information</span>
                          </li>
                          <li className="flex items-start">
                            <Target className="h-4 w-4 mr-2 text-primary/70 mt-0.5 shrink-0" />
                            <span>Learn about your creative goals</span>
                          </li>
                          <li className="flex items-start">
                            <Shield className="h-4 w-4 mr-2 text-primary/70 mt-0.5 shrink-0" />
                            <span>Set up privacy preferences</span>
                          </li>
                          <li className="flex items-start">
                            <Zap className="h-4 w-4 mr-2 text-primary/70 mt-0.5 shrink-0" />
                            <span>Get ready to create amazing images</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {currentStepIndex === 1 && (
              <div id="personal-info-step" className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold tracking-tight mb-2">
                    Your Profile
                  </h2>
                  <p className="text-muted-foreground">
                    Tell us a bit about yourself
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-4 mb-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={userProfile?.avatarUrl || ""}
                        alt={username}
                      />
                      <AvatarFallback className="bg-primary/10">
                        <User className="h-12 w-12 text-primary/80" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex items-center">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="flex items-center px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80">
                          <Upload className="mr-2 h-4 w-4" />
                          <span>
                            {uploadImageLoading
                              ? "Uploading..."
                              : "Upload Picture"}
                          </span>
                        </div>
                        {!uploadImageLoading && (
                          <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                uploadImage(e.target.files[0], "avatar");
                              }
                            }}
                            disabled={uploadImageLoading}
                          />
                        )}
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This is how you'll appear to others on the platform
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a bit about yourself and your creative interests"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Share your interests, experience, or what you hope to
                      create
                    </p>
                  </div>
                </div>
              </div>
            )}
            {currentStepIndex === 2 && (
              <div id="experience-step" className="space-y-4">
                <div className="text-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight mb-1">
                    Your Preferences
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Help us customize your Soreal experience
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      How familiar are you with AI image generation?
                    </Label>
                    <RadioGroup
                      value={aiExperience}
                      onValueChange={(value) => setAiExperience(value)}
                      className="space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="exp-none" />
                        <Label
                          htmlFor="exp-none"
                          className="text-sm cursor-pointer"
                        >
                          I'm completely new to this
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="exp-beginner" />
                        <Label
                          htmlFor="exp-beginner"
                          className="text-sm cursor-pointer"
                        >
                          I've tried it a few times
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="intermediate"
                          id="exp-intermediate"
                        />
                        <Label
                          htmlFor="exp-intermediate"
                          className="text-sm cursor-pointer"
                        >
                          I use it regularly
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      What type of outcome are you hoping to achieve with Soreal?
                    </Label>
                    <div className="space-y-2">
                      {USAGE_GOALS.map((goal) => (
                        <div
                          key={goal.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`goal-${goal.id}`}
                            checked={usageGoals.includes(goal.id)}
                            onCheckedChange={(checked) =>
                              setUsageGoals(
                                checked
                                  ? [...usageGoals, goal.id]
                                  : usageGoals.filter(
                                      (_goal) => _goal !== goal.id
                                    )
                              )
                            }
                          />
                          <Label
                            htmlFor={`goal-${goal.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {goal.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {usageGoals.includes("other") && (
                      <div className="mt-2">
                        <Input
                          placeholder="Please specify..."
                          value={otherGoal}
                          onChange={(e) => setOtherGoal(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        What kind of visuals do you want to create most often?
                      </Label>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Preferred Style (Pick all that apply):
                          </Label>
                          <div className="grid grid-cols-1 gap-2">
                            {STYLE_PREFERENCES.map((style) => (
                              <div
                                key={style.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`style-${style.id}`}
                                  checked={stylePreferences.includes(style.id)}
                                  onCheckedChange={(checked) =>
                                    setStylePreferences(
                                      checked
                                        ? [...stylePreferences, style.id]
                                        : stylePreferences.filter(
                                            (pref) => pref !== style.id
                                          )
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`style-${style.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {style.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Common Subjects (Pick all that apply):
                          </Label>
                          <div className="grid grid-cols-1 gap-2">
                            {SUBJECT_PREFERENCES.map((subject) => (
                              <div
                                key={subject.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`subject-${subject.id}`}
                                  checked={subjectPreferences.includes(subject.id)}
                                  onCheckedChange={(checked) =>
                                    setSubjectPreferences(
                                      checked
                                        ? [...subjectPreferences, subject.id]
                                        : subjectPreferences.filter(
                                            (pref) => pref !== subject.id
                                          )
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`subject-${subject.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {subject.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentStepIndex === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4" aria-hidden="true">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2">
                    You're All Set!
                  </h2>
                  <p className="text-muted-foreground">
                    Your Soreal account is now ready to use. Let's start
                    creating amazing images!
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {features.map((feature, index) => (
                    <div
                      className="bg-muted/50 p-4 rounded-lg text-center"
                      key={`feature-${index}`}
                    >
                      <div
                        className="flex justify-center mb-2"
                        aria-hidden="true"
                      >
                        {feature.icon}
                      </div>
                      <h3 className="font-medium mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
                  <h3 className="font-medium mb-2">Your Account Summary</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Username:</span>
                      <span className="font-medium">
                        {userProfile?.username || "Guest"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">
                        Available Credits:
                      </span>
                      <span className="font-medium">
                        {userTopup?.creditBalance || 0}
                      </span>
                    </li>
                    {authUser?.createdAt && (
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">
                          Account Created:
                        </span>
                        <span className="font-medium">
                          {formatDate(new Date(authUser.createdAt))}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4 mt-8">
                  <Button
                    onClick={() => completeOnboarding()}
                    size="lg"
                    className="w-full md:w-auto"
                    aria-label="Complete onboarding and go to dashboard"
                    id="onboarding-go-to-dashboard-button"
                    disabled={savingStep}
                  >
                    {savingStep ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Go to Dashboard
                        <ArrowRight
                          className="ml-2 h-4 w-4"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Need help getting started? Check out our{" "}
                    <Link href="/help" className="text-primary underline">
                      help center
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {!isLastStep && (
          <CardFooter className="flex justify-between items-center px-4 py-4 bg-gray-50/80 border-t">
            <div>
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isFirstStep || savingStep}
                className="rounded-full px-3 text-sm h-9"
                size="sm"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back
              </Button>
            </div>

            <div className="text-[10px] text-muted-foreground">
              Step {currentStepIndex + 1} of {STEPS.length}
            </div>

            <Button
              onClick={() => goToNextStep()}
              disabled={savingStep}
              className="rounded-full px-3 bg-primary hover:bg-primary/90 text-sm h-9"
              size="sm"
              id="onboarding-next-button"
            >
              {savingStep ? (
                <>
                  <Loader className="mr-1 h-3 w-3 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-1 h-3 w-3" />
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Page;
