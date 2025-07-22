"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/theme";
import {
  Settings,
  Palette,
  Moon,
  Sun,
} from "lucide-react";

const AdminSettingsPage = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <div className="space-y-6 bg-background dark:bg-zinc-800 text-foreground dark:text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center text-foreground dark:text-white">
            <Settings className="mr-2 h-6 w-6 text-primary" />
            Admin Settings
          </h1>
          <p className="text-muted-foreground dark:text-zinc-300">
            Manage your admin account settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="preferences" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 bg-muted dark:bg-zinc-700 border-border dark:border-zinc-600">
          <TabsTrigger value="preferences" className="flex items-center data-[state=active]:bg-background dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-foreground dark:data-[state=active]:text-white">
            <Palette className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-4">
          <Card className="bg-card dark:bg-zinc-800 border-border dark:border-zinc-600">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-white">Theme Preferences</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-zinc-300">
                Customize your admin dashboard appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-card dark:bg-zinc-800">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium flex items-center gap-2 text-foreground dark:text-white">
                      {mode === "dark" ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground dark:text-zinc-300">
                      Toggle between light and dark themes for the admin dashboard
                    </p>
                  </div>
                  <Switch
                    checked={mode === "dark"}
                    onCheckedChange={toggleMode}
                    aria-label="Toggle dark mode"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettingsPage; 