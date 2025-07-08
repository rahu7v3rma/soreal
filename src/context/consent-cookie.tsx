"use client";
import * as React from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Cookies from "js-cookie";
import { CONSENT_COOKIE_KEY } from "@/constants/cookies";
import { useSupabase } from "@/context/supabase";

const ConsentCookieContext = React.createContext<{
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}>({
  isVisible: false,
  setIsVisible: () => {},
});

const ConsentCookieComponent = () => {
  const { isVisible, setIsVisible } = React.useContext(ConsentCookieContext);
  const { userProfile, updateUserProfile } = useSupabase();

  const [showChoose, setShowChoose] = React.useState(false);
  const [functionalCookie, setFunctionalCookie] = React.useState(false);
  const [analyticsCookie, setAnalyticsCookie] = React.useState(false);
  const [advertisingCookie, setAdvertisingCookie] = React.useState(false);

  const handleAcceptAll = async () => {
    const consentArray = [
      "essential",
      "analytics",
      "functional",
      "advertising",
    ];
    Cookies.set(CONSENT_COOKIE_KEY, consentArray.join(","), { expires: 365 });
    setFunctionalCookie(true);
    setAnalyticsCookie(true);
    setAdvertisingCookie(true);
    setShowChoose(false);
    setIsVisible(false);

    // Update Supabase if user is logged in
    if (userProfile) {
      await updateUserProfile({ cookies: consentArray });
    }
  };

  const handleEssentialOnly = async () => {
    const consentArray = ["essential"];
    Cookies.remove(CONSENT_COOKIE_KEY);
    Cookies.set(CONSENT_COOKIE_KEY, consentArray.join(","), { expires: 365 });
    setFunctionalCookie(false);
    setAnalyticsCookie(false);
    setAdvertisingCookie(false);
    setShowChoose(false);
    setIsVisible(false);

    // Update Supabase if user is logged in
    if (userProfile) {
      await updateUserProfile({ cookies: consentArray });
    }
  };

  const handleChoose = () => {
    setShowChoose(!showChoose);
  };

  const handleSave = async () => {
    const consentCookie = ["essential"];

    if (functionalCookie) {
      consentCookie.push("functional");
    }
    if (analyticsCookie) {
      consentCookie.push("analytics");
    }
    if (advertisingCookie) {
      consentCookie.push("advertising");
    }

    Cookies.set(CONSENT_COOKIE_KEY, consentCookie.join(","), { expires: 365 });

    setShowChoose(false);

    setIsVisible(false);

    // Update Supabase if user is logged in
    if (userProfile) {
      await updateUserProfile({ cookies: consentCookie });
    }
  };

  useEffect(() => {
    // First check if user has cookies in their profile
    if (userProfile?.cookies && userProfile.cookies.length > 0) {
      // Sync from Supabase
      const supabaseCookies = userProfile.cookies;

      setFunctionalCookie(supabaseCookies.includes("functional"));
      setAnalyticsCookie(supabaseCookies.includes("analytics"));
      setAdvertisingCookie(supabaseCookies.includes("advertising"));

      // Also update local cookies
      Cookies.set(CONSENT_COOKIE_KEY, supabaseCookies.join(","), {
        expires: 365,
      });

      setIsVisible(false);
    } else {
      // Fall back to local cookies if no Supabase cookies
      const consentCookie = Cookies.get(CONSENT_COOKIE_KEY);

      if (consentCookie) {
        const consentCookieValue = consentCookie.split(",");

        setFunctionalCookie(consentCookieValue.includes("functional"));
        setAnalyticsCookie(consentCookieValue.includes("analytics"));
        setAdvertisingCookie(consentCookieValue.includes("advertising"));

        // If user is logged in but has no cookies in profile, sync local to Supabase
        if (userProfile && !userProfile.cookies) {
          updateUserProfile({ cookies: consentCookieValue });
        }
      }

      const shouldShowBanner = !consentCookie && !userProfile?.cookies;

      setIsVisible(shouldShowBanner);
    }
  }, [userProfile]);

  if (!isVisible) return null;

  return (
    <div
      className={
        "fixed bottom-4 right-4 z-[100] w-full max-w-[420px] rounded-md border bg-background p-6 pr-8 shadow-lg animate-in slide-in-from-bottom-full"
      }
    >
      <div className="text-sm font-semibold mb-1">Cookie Policy</div>

      <div className="text-sm opacity-90">
        We use cookies for essential, analytics, functional and advertising
        purposes to enhance your browsing experience and provide personalized
        services.
      </div>

      <a
        href="/privacy-policy#cookies-similar-tech"
        className="text-sm font-medium text-[#2fceb9] hover:underline mb-4 inline-block"
      >
        Read more
      </a>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleChoose}
          className="h-8 px-3 text-sm"
        >
          Choose
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEssentialOnly}
            className="h-8 px-3 text-sm"
          >
            Essential Only
          </Button>
          <Button
            size="sm"
            onClick={handleAcceptAll}
            className="h-8 px-3 text-sm bg-[#2fceb9] text-white hover:bg-[#26a594]"
          >
            Accept All
          </Button>
        </div>
      </div>

      {showChoose && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="essential" className="text-sm">
                Essential
              </label>
              <p className="text-xs text-muted-foreground">
                Login, session routing, CSRF protection
              </p>
            </div>
            <Switch id="essential" checked={true} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="analytics" className="text-sm">
                Analytics
              </label>
              <p className="text-xs text-muted-foreground">
                GA4 & PostHog collect de-identified usage stats
              </p>
            </div>
            <Switch
              id="analytics"
              checked={analyticsCookie}
              onCheckedChange={setAnalyticsCookie}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="functional" className="text-sm">
                Functional
              </label>
              <p className="text-xs text-muted-foreground">
                Remember UI settings (e.g., theme, language)
              </p>
            </div>
            <Switch
              id="functional"
              checked={functionalCookie}
              onCheckedChange={setFunctionalCookie}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="advertising" className="text-sm">
                Advertising
              </label>
              <p className="text-xs text-muted-foreground">
                Limited first-party retargeting pixels to show Soreal ads on
                other sites
              </p>
            </div>
            <Switch
              id="advertising"
              checked={advertisingCookie}
              onCheckedChange={setAdvertisingCookie}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button size="sm" onClick={handleSave} className="h-8 px-3 text-sm">
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const useConsentCookie = () => {
  const { setIsVisible } = React.useContext(ConsentCookieContext);

  return {
    setIsVisible,
  };
};

const CookieConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <ConsentCookieContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
      <ConsentCookieComponent />
    </ConsentCookieContext.Provider>
  );
};

export default CookieConsentProvider;
