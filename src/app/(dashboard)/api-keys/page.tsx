"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { useSupabase } from "@/context/supabase";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, Copy, Key, Loader, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const { toast } = useToast();
  const {
    apiKeys,
    getApiKeys,
    getApiKeysLoading,
    addApiKey,
    addApiKeyLoading,
    updateApiKey,
    updateApiKeyLoading,
  } = useSupabase();

  const [isNewApiKeyDialogOpen, setIsNewApiKeyDialogOpen] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState("");
  const [newApiKeyPermissionCreateImage, setNewApiKeyPermissionCreateImage] =
    useState(false);
  const [newApiKeyPermissionGetImage, setNewApiKeyPermissionGetImage] =
    useState(false);
  const [revokingKeys, setRevokingKeys] = useState<Record<string, boolean>>({});

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard
      .writeText(key)
      .then(() => {
        toast({
          title: "Successfully copied to clipboard",
          duration: 5000,
        });
      })
      .catch(() => {
        toast({
          title: "Something went wrong while copying the API key",
          variant: "destructive",
          duration: 5000,
        });
      });
  };

  const handleCreateApiKey = async () => {
    addApiKey({
      createImage: newApiKeyPermissionCreateImage,
      getImage: newApiKeyPermissionGetImage,
      keyName: newApiKeyName,
    }).then((apiKey) => {
      if (apiKey) {
        setIsNewApiKeyDialogOpen(false);
        setNewApiKeyName("");
        setNewApiKeyPermissionCreateImage(false);
        setNewApiKeyPermissionGetImage(false);
        getApiKeys();
      }
    });
  };

  const revokeApiKey = async (apiKeyId: string) => {
    setRevokingKeys(prev => ({ ...prev, [apiKeyId]: true }));
    
    updateApiKey(apiKeyId, { revoked: true }).then((response) => {
      if (response) {
        getApiKeys();
      }
    }).catch(() => {
      // Error handling if needed
    }).finally(() => {
      setRevokingKeys(prev => ({ ...prev, [apiKeyId]: false }));
    });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Key className="mr-2 h-6 w-6 text-primary" />
            API Keys
          </h1>
          <p className="text-muted-foreground">
            Manage your API keys for programmatic access to Soreal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsNewApiKeyDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New API Key
          </Button>

          <Dialog.Root
            open={isNewApiKeyDialogOpen}
            onOpenChange={setIsNewApiKeyDialogOpen}
          >
            <Dialog.Portal
              container={
                typeof document !== "undefined" ? document.body : undefined
              }
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-[999]" />
              <Dialog.Content className="fixed left-[50%] top-[50%] z-[1000] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                  Create New API Key
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground">
                  Create a new API key for programmatic access to Soreal.
                </Dialog.Description>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">API Key Name</Label>
                    <Input
                      id="key-name"
                      placeholder="e.g., Production API Key"
                      value={newApiKeyName}
                      onChange={(e) => setNewApiKeyName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Give your API key a descriptive name to identify its
                      purpose.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="permission-generate"
                        checked={newApiKeyPermissionCreateImage}
                        onCheckedChange={(checked) => {
                          if (typeof checked === "boolean") {
                            setNewApiKeyPermissionCreateImage(checked);
                          }
                        }}
                      />
                      <Label htmlFor="permission-generate">Create image</Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="permission-read"
                          checked={newApiKeyPermissionGetImage}
                          onCheckedChange={(
                            checked: boolean | "indeterminate"
                          ) => {
                            if (typeof checked === "boolean") {
                              setNewApiKeyPermissionGetImage(checked);
                            }
                          }}
                        />
                        <Label htmlFor="permission-read">Get images</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewApiKeyDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateApiKey}
                    disabled={
                      addApiKeyLoading || 
                      !newApiKeyName.trim() || 
                      (!newApiKeyPermissionCreateImage && !newApiKeyPermissionGetImage)
                    }
                  >
                    {addApiKeyLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create API Key"
                    )}
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys ({apiKeys.length})</CardTitle>
              <CardDescription>
                Manage your API keys for programmatic access to Soreal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <h3 className="text-sm font-medium flex items-center mb-2">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    API Key Security
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your API keys grant access to your Soreal account. Never
                    share your API keys in public repositories, client-side
                    code, or with unauthorized users.
                  </p>
                </div>

                {getApiKeysLoading ? (
                  <div className="text-center py-6">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading API keys...</p>
                  </div>
                ) : apiKeys.length === 0 ? (
                  <div className="text-center py-6">
                    <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No API Keys</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't created any API keys yet
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>API Key</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiKeys.map((apiKey) => (
                        <TableRow key={apiKey.id}>
                          <TableCell className="font-medium">
                            {apiKey.key_name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded text-xs">
                                {apiKey.api_key.substring(0, 8)}...
                                {apiKey.api_key.substring(
                                  apiKey.api_key.length - 4
                                )}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCopyApiKey(apiKey.api_key)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {apiKey.create_image && (
                                <Badge variant="outline" className="text-xs">
                                  create image
                                </Badge>
                              )}
                              {apiKey.get_image && (
                                <Badge variant="outline" className="text-xs">
                                  get image
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(apiKey.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {apiKey.revoked ? (
                                <Badge variant="outline" className="text-xs">
                                  revoked
                                </Badge>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => revokeApiKey(apiKey.id)}
                                  disabled={revokingKeys[apiKey.id]}
                                >
                                  {revokingKeys[apiKey.id] ? (
                                    <>
                                      <Loader className="h-4 w-4 mr-1 animate-spin" />
                                      Revoking...
                                    </>
                                  ) : (
                                    <>
                                      <X className="h-4 w-4 mr-1" />
                                      Revoke
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                API keys are specific to your organization
              </p>
              <Link href="/api-docs">
                <Button variant="outline">View API Documentation</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
