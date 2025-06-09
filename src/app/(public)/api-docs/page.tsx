"use client";

import { ChevronRight, Code } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="space-y-8 pb-16">
      <div className="relative py-16">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
                <Code size={16} />
                <span>Developer Resources</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">
                Welcome to Soreal API Documentation
              </h1>
              <p className="text-lg text-muted-foreground mt-4">
                Here you'll find all the documentation you need to get up and
                running with the our API. Integrate state-of-the-art image
                generation capabilities directly into your applications.
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-10">
                Let's Begin
              </h1>
              <p className="text-lg text-muted-foreground my-4">
                Jump in to the quick start docs and get making your first
                request:
              </p>

              <Link href="/api-docs/quick-start">
                <div className="flex items-center justify-between px-6 py-4 rounded-lg text-muted-foreground border border-border hover:border-zinc-700 hover:text-zinc-700 transition-colors duration-200">
                  <span className="text-lg font-medium">Quick Start</span>
                  <ChevronRight className="h-5 w-5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
            <div className="md:col-span-4 hidden md:block">
              <div className="bg-card border rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <pre className="text-xs md:text-sm text-white font-mono bg-black/90 rounded-md p-4 overflow-auto">
                  <span className="text-green-400">$</span> curl
                  https://api.soreal.app/create-image/standard \
                  <br />
                  {"  "}-X POST \<br />
                  {"  "}-H{" "}
                  <span className="text-yellow-300">
                    "Authorization: Bearer YOUR_API_KEY"
                  </span>{" "}
                  \<br />
                  {"  "}-d{" "}
                  <span className="text-yellow-300">
                    {
                      '\'{"prompt":"A beautiful sunset","style":"photorealistic"}\'}'
                    }
                  </span>
                  <br />
                  <br />
                  <span className="text-purple-400">⬤ Generating image...</span>
                  <br />
                  <span className="text-green-400">
                    ✓ Image created successfully!
                  </span>
                  <br />
                  <br />
                  <span className="text-blue-300">{"{"}</span>
                  <br />
                  {"  "}
                  <span className="text-green-300">"success"</span>:{" "}
                  <span className="text-yellow-300">true</span>,<br />
                  {"  "}
                  <span className="text-green-300">"message"</span>:{" "}
                  <span className="text-yellow-300">
                    "Image generated successfully"
                  </span>
                  ,<br />
                  {"  "}
                  <span className="text-green-300">"data"</span>:{" "}
                  <span className="text-yellow-300">"https://api.soreal.app/assets/users/1/generations/1749381948150.png"</span>
                  <br />
                  <span className="text-blue-300">{"}"}</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
