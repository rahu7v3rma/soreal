"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSupabase } from "@/context/supabase";
import { Image as ImageIcon, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { generations, totalCredits } = useSupabase();

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome! Here's an overview of your AI image generation activity.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Generations
                </CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{generations.length}</div>
              </CardContent>
            </Card>

            <Card className="p-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Credits
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalCredits?.toLocaleString() || "0"}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-1">
            <Card className="w-full p-1">
              <CardHeader>
                <CardTitle>Recent Generations</CardTitle>
                <CardDescription>
                  Your most recent AI-generated images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {generations.length > 0 &&
                    generations.slice(0, 8).map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-md overflow-hidden relative"
                      >
                        <img
                          src={image.public_url || ""}
                          alt={image.prompt || "Generated image"}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                </div>
                <div className="mt-4">
                  {generations.length === 0 ? (
                    <div className="text-center py-12">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">
                        No images found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't generated any images yet
                      </p>
                      <Button onClick={() => router.push("/create")}>
                        Create Your First Image
                      </Button>
                    </div>
                  ) : (
                    <CardDescription>
                      Check out all your generations in the
                      <span
                        className="text-primary cursor-pointer ml-1"
                        onClick={() => router.push("/history")}
                      >
                        History
                      </span>{" "}
                      page.
                    </CardDescription>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
