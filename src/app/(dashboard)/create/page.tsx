"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { creationModes } from "@/constants/create";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create</h1>
        <p className="text-muted-foreground">
          Choose a creation mode to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creationModes.map((mode, index) => (
          <Link href={mode.href} key={index} className="block">
            <Card
              className={`h-full hover:shadow-md transition-all hover:border-primary/50 ${mode.color}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  {mode.icon}
                </div>
                <CardTitle className="mt-4">{mode.title}</CardTitle>
                <CardDescription>{mode.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full group">
                  <span>Get Started</span>
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-border">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <ImageIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Need help choosing?</h3>
            <p className="text-muted-foreground mb-4">
              Each creation mode is optimized for different use cases. Standard
              mode is great for quick generations, while Advance Mode offers
              more control. Remove Background and Upscale help enhance existing
              images.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/create/standard">
                <Button variant="outline" size="sm">
                  Try Standard Mode
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
