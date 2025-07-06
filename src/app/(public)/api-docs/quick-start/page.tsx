"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CopyBlock, atomOneDark } from "react-code-blocks";
import { codeSnippets } from "@/constants/api-docs/quick-start";

const Page = () => {
  const { toast } = useToast();
  
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedStates((prev) => ({ ...prev, [key]: true }));

      toast({
        title: "Successfully copied to clipboard",
      });

      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch {
      toast({
        title: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8 py-16">
      <div className="container max-w-6xl mx-auto px-4 space-y-12">
        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Quick Start</h2>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight" id="authentication">
            Get Your API Key
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <p>
                  All API requests require authentication using an API key. Any
                  request that doesn't include an API key will return an error.
                  You can create and manage API keys in the{" "}
                  <a href="/api-keys" className="text-primary hover:underline">
                    API Keys
                  </a>{" "}
                  section of your Soreal dashboard.
                </p>

                <div className="my-6 flex flex-col items-center">
                  <Image
                    src={`https://api.soreal.app/assets/png/api-docs/api-keys-dashboard.png`}
                    alt="API Key Documentation"
                    width={800}
                    height={400}
                    className="rounded-lg border border-border"
                  />
                  <p className="text-sm text-muted-foreground italic mt-2">
                    Note: Keep your API Key secret!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight" id="rate-limits">
            Request Headers
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <p>The API requires the following headers:</p>
                <ul className="list-disc list-inside">
                  <li>
                    <code className="text-sm bg-muted px-1 rounded">
                      Authorization: Bearer {"<Your-API-Key>"}
                    </code>{" "}
                    - Your unique API key used to verify and authorize API
                    access.
                  </li>
                  <li>
                    <code className="text-sm bg-muted px-1 rounded">
                      Content-Type: application/json
                    </code>{" "}
                    - The content type of the request body.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight" id="rate-limits">
            Endpoint
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <p>
                  The API host is:{" "}
                  <code className="text-sm bg-muted px-1 rounded">
                    https://api.soreal.app
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6" id="first-request">
          <h2 className="text-3xl font-bold tracking-tight">
            Make Your First Request
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <p className="mb-4">
                  Generate your first image with a simple API call. Choose your
                  preferred programming language below:
                </p>

                <Tabs defaultValue="curl">
                  <TabsList className="mb-4">
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                  <TabsContent value="curl" className="relative">
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-muted"
                        onClick={() =>
                          copyToClipboard(codeSnippets.curl, "curl")
                        }
                      >
                        {copiedStates.curl ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <CopyBlock
                      text={codeSnippets.curl}
                      language="bash"
                      showLineNumbers
                      theme={atomOneDark}
                    />
                  </TabsContent>
                  <TabsContent value="javascript" className="relative">
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-muted"
                        onClick={() =>
                          copyToClipboard(codeSnippets.javascript, "javascript")
                        }
                      >
                        {copiedStates.javascript ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <CopyBlock
                      text={codeSnippets.javascript}
                      language="javascript"
                      showLineNumbers
                      theme={atomOneDark}
                    />
                  </TabsContent>
                  <TabsContent value="python" className="relative">
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-muted"
                        onClick={() =>
                          copyToClipboard(codeSnippets.python, "python")
                        }
                      >
                        {copiedStates.python ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <CopyBlock
                      text={codeSnippets.python}
                      language="python"
                      showLineNumbers
                      theme={atomOneDark}
                    />
                  </TabsContent>
                </Tabs>

                <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>Success Response</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">
                      If successful, you'll receive a response like this:
                    </p>
                    <pre className="bg-muted p-3 rounded-md font-mono text-sm overflow-auto">
{`{
  "success": true,
  "message": "Standard image generated successfully",
  "data": {
    "imageUrl": "https://api.soreal.app/assets/users/1/generations/1749381948150.png",
    "creditBalance": 1000
  }
}`}
                    </pre>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Page;
