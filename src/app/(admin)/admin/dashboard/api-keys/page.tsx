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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { useSupabase } from "@/context/supabase";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, Copy, Key, Loader, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const Page = () => {
  const { toast } = useToast();
  const {
    adminApiKeys,
    getAdminApiKeys,
    getAdminApiKeysLoading,
    addAdminApiKey,
    addAdminApiKeyLoading,
    updateAdminApiKey,
    updateAdminApiKeyLoading,
  } = useSupabase();

  const [isNewApiKeyDialogOpen, setIsNewApiKeyDialogOpen] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState("");
  const [newApiKeyPermissionCreateBlog, setNewApiKeyPermissionCreateBlog] =
    useState(false);
  const [newApiKeyPermissionGetBlog, setNewApiKeyPermissionGetBlog] =
    useState(false);
  const [newApiKeyPermissionUpdateBlog, setNewApiKeyPermissionUpdateBlog] =
    useState(false);
  const [newApiKeyPermissionRemoveBlog, setNewApiKeyPermissionRemoveBlog] =
    useState(false);
  const [newApiKeyPermissionListBlog, setNewApiKeyPermissionListBlog] =
    useState(false);
  const [selectAllPermissions, setSelectAllPermissions] = useState(false);

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
    const permissions = [];
    if (newApiKeyPermissionCreateBlog) permissions.push("create_blog");
    if (newApiKeyPermissionGetBlog) permissions.push("get_blog");
    if (newApiKeyPermissionUpdateBlog) permissions.push("update_blog");
    if (newApiKeyPermissionRemoveBlog) permissions.push("remove_blog");
    if (newApiKeyPermissionListBlog) permissions.push("list_blog");

    addAdminApiKey({
      permissions,
      keyName: newApiKeyName,
    }).then((apiKey) => {
      if (apiKey) {
        setIsNewApiKeyDialogOpen(false);
        setNewApiKeyName("");
        setNewApiKeyPermissionCreateBlog(false);
        setNewApiKeyPermissionGetBlog(false);
        setNewApiKeyPermissionUpdateBlog(false);
        setNewApiKeyPermissionRemoveBlog(false);
        setNewApiKeyPermissionListBlog(false);
        setSelectAllPermissions(false);
        getAdminApiKeys();
      }
    });
  };

  // Update select all state when individual permissions change
  useEffect(() => {
    const allSelected = newApiKeyPermissionCreateBlog && 
                       newApiKeyPermissionGetBlog && 
                       newApiKeyPermissionUpdateBlog && 
                       newApiKeyPermissionRemoveBlog && 
                       newApiKeyPermissionListBlog;
    setSelectAllPermissions(allSelected);
  }, [newApiKeyPermissionCreateBlog, newApiKeyPermissionGetBlog, newApiKeyPermissionUpdateBlog, newApiKeyPermissionRemoveBlog, newApiKeyPermissionListBlog]);

  const handleSelectAllPermissions = (checked: boolean) => {
    setNewApiKeyPermissionCreateBlog(checked);
    setNewApiKeyPermissionGetBlog(checked);
    setNewApiKeyPermissionUpdateBlog(checked);
    setNewApiKeyPermissionRemoveBlog(checked);
    setNewApiKeyPermissionListBlog(checked);
  };

  const revokeApiKey = async (apiKeyId: string) => {
    updateAdminApiKey(apiKeyId, { revoked: true }).then((response) => {
      if (response) {
        getAdminApiKeys();
      }
    });
  };

  return (
    <div className="space-y-6 w-full bg-background dark:bg-zinc-800 text-foreground dark:text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center text-foreground dark:text-white">
            <Key className="mr-2 h-6 w-6 text-primary" />
            API Keys
          </h1>
          <p className="text-muted-foreground dark:text-zinc-300">
            Manage your API keys for programmatic access to Soreal admin management
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
              <Dialog.Content className="fixed left-[50%] top-[50%] z-[1000] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background dark:bg-zinc-800 border-border dark:border-zinc-600 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-foreground dark:text-white">
                  Create New API Key
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground dark:text-zinc-300">
                  Create a new API key for programmatic access to Soreal admin management.
                </Dialog.Description>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name" className="text-foreground dark:text-white">API Key Name</Label>
                    <Input
                      id="key-name"
                      placeholder="e.g., Blog Management API Key"
                      value={newApiKeyName}
                      onChange={(e) => setNewApiKeyName(e.target.value)}
                      className="bg-background dark:bg-zinc-700 border-border dark:border-zinc-600 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-zinc-400"
                    />
                    <p className="text-xs text-muted-foreground dark:text-zinc-400">
                      Give your API key a descriptive name to identify its
                      purpose.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground dark:text-white">Permissions</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 pb-2 border-b border-border dark:border-zinc-600">
                        <Checkbox
                          id="select-all-permissions"
                          checked={selectAllPermissions}
                          onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") {
                              handleSelectAllPermissions(checked);
                            }
                          }}
                        />
                        <Label htmlFor="select-all-permissions" className="text-foreground dark:text-white font-medium">Select All</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="permission-create-blog"
                          checked={newApiKeyPermissionCreateBlog}
                          onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") {
                              setNewApiKeyPermissionCreateBlog(checked);
                            }
                          }}
                        />
                        <Label htmlFor="permission-create-blog" className="text-foreground dark:text-white">Create blog</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="permission-get-blog"
                          checked={newApiKeyPermissionGetBlog}
                          onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") {
                              setNewApiKeyPermissionGetBlog(checked);
                            }
                          }}
                        />
                        <Label htmlFor="permission-get-blog" className="text-foreground dark:text-white">Get blog</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="permission-update-blog"
                          checked={newApiKeyPermissionUpdateBlog}
                          onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") {
                              setNewApiKeyPermissionUpdateBlog(checked);
                            }
                          }}
                        />
                        <Label htmlFor="permission-update-blog" className="text-foreground dark:text-white">Update blog</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="permission-remove-blog"
                          checked={newApiKeyPermissionRemoveBlog}
                          onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") {
                              setNewApiKeyPermissionRemoveBlog(checked);
                            }
                          }}
                        />
                        <Label htmlFor="permission-remove-blog" className="text-foreground dark:text-white">Remove blog</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="permission-list-blog"
                          checked={newApiKeyPermissionListBlog}
                          onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") {
                              setNewApiKeyPermissionListBlog(checked);
                            }
                          }}
                        />
                        <Label htmlFor="permission-list-blog" className="text-foreground dark:text-white">List blog</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewApiKeyDialogOpen(false)}
                    className="border-border dark:border-zinc-600 text-foreground dark:text-zinc-900 hover:bg-muted dark:hover:bg-zinc-700 hover:text-foreground dark:hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateApiKey}
                    disabled={
                      addAdminApiKeyLoading || 
                      !newApiKeyName.trim() || 
                      (!newApiKeyPermissionCreateBlog && !newApiKeyPermissionGetBlog && !newApiKeyPermissionUpdateBlog && !newApiKeyPermissionRemoveBlog && !newApiKeyPermissionListBlog)
                    }
                  >
                    {addAdminApiKeyLoading ? (
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
          <Card className="bg-card dark:bg-zinc-800 border-border dark:border-zinc-600">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-white">Your API Keys ({adminApiKeys.length})</CardTitle>
            </CardHeader>
            <CardContent className="bg-card dark:bg-zinc-800">
              <div className="space-y-4">
                <div className="bg-muted/50 dark:bg-zinc-700/50 p-4 rounded-lg border border-border dark:border-zinc-600">
                  <h3 className="text-sm font-medium flex items-center mb-2 text-foreground dark:text-white">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    API Key Security
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-zinc-300">
                    Your API keys grant access to your admin management functions. Never
                    share your API keys in public repositories, client-side
                    code, or with unauthorized users.
                  </p>
                </div>

                {getAdminApiKeysLoading ? (
                  <div className="text-center py-6">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground dark:text-zinc-300">Loading API keys...</p>
                  </div>
                ) : adminApiKeys.length === 0 ? (
                  <div className="text-center py-6">
                    <Key className="h-12 w-12 mx-auto text-muted-foreground dark:text-zinc-400 mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2 text-foreground dark:text-white">No API Keys</h3>
                    <p className="text-muted-foreground dark:text-zinc-300 mb-6">
                      You haven't created any API keys yet
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border border-border dark:border-zinc-600">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border dark:border-zinc-600">
                          <TableHead className="text-foreground dark:text-white">Name</TableHead>
                          <TableHead className="text-foreground dark:text-white">API Key</TableHead>
                          <TableHead className="text-foreground dark:text-white">Permissions</TableHead>
                          <TableHead className="text-foreground dark:text-white">Created</TableHead>
                          <TableHead className="text-right text-foreground dark:text-white">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminApiKeys.map((apiKey) => (
                          <TableRow key={apiKey.id} className="border-b border-border dark:border-zinc-600">
                            <TableCell className="font-medium text-foreground dark:text-white">
                              {apiKey.key_name || `API Key #${apiKey.id}`}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <code className="bg-muted dark:bg-zinc-700 px-2 py-1 rounded text-xs text-foreground dark:text-white w-[100px] inline-block text-center">
                                  {apiKey.api_key_token.substring(0, 8)}...
                                  {apiKey.api_key_token.substring(
                                    apiKey.api_key_token.length - 4
                                  )}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCopyApiKey(apiKey.api_key_token)}
                                  className="hover:bg-muted dark:hover:bg-zinc-700"
                                >
                                  <Copy className="h-4 w-4 text-foreground dark:text-zinc-100" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {apiKey.permissions?.map((permission) => (
                                  <Badge key={permission} variant="outline" className="text-xs border-border dark:border-zinc-600 text-foreground dark:text-white">
                                    {permission.replace("_", " ")}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground dark:text-white">
                              {new Date(apiKey.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {apiKey.revoked ? (
                                  <Badge variant="outline" className="text-xs border-border dark:border-zinc-600 text-foreground dark:text-white">
                                    revoked
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => revokeApiKey(apiKey.id)}
                                    disabled={updateAdminApiKeyLoading}
                                    className="text-foreground dark:text-white hover:bg-muted dark:hover:bg-zinc-700 border-border !dark:border-zinc-600"
                                  >
                                    {updateAdminApiKeyLoading ? (
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
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-card dark:bg-zinc-800">
              <p className="text-sm text-muted-foreground dark:text-zinc-300">
                API keys are specific to your admin role
              </p>
            </CardFooter>
          </Card>

          {/* API Documentation Section */}
          <Card className="bg-card dark:bg-zinc-800 border-border dark:border-zinc-600">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-white">API Keys Documentation</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-zinc-300">
                Learn how to use your API keys to interact with Soreal admin endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 bg-card dark:bg-zinc-800">
              {/* Authentication */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground dark:text-white">Authentication</h3>
                <p className="text-muted-foreground dark:text-zinc-300">
                  All API requests require authentication using an API key. Include your API key in the Authorization header:
                </p>
                <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}`}
                </pre>
              </div>

              {/* Base URL */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground dark:text-white">Base URL</h3>
                <p className="text-muted-foreground dark:text-zinc-300">
                  All admin API endpoints are available at:
                </p>
                <code className="bg-muted dark:bg-zinc-700 px-2 py-1 rounded text-sm text-foreground dark:text-white">
                  https://soreal.app/api/admin
                </code>
              </div>

              <Tabs defaultValue="blog" className="w-full">
                <TabsList className="grid w-full grid-cols-1 bg-muted dark:bg-zinc-700 border-border dark:border-zinc-600">
                  <TabsTrigger value="blog" className="data-[state=active]:bg-background dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-foreground dark:data-[state=active]:text-white">Blog</TabsTrigger>
                </TabsList>

                <TabsContent value="blog" className="space-y-6">

                  <Tabs defaultValue="create" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-muted dark:bg-zinc-700 border-border dark:border-zinc-600">
                      <TabsTrigger value="create" className="data-[state=active]:bg-background dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-foreground dark:data-[state=active]:text-white data-[state=inactive]:text-foreground dark:data-[state=inactive]:text-zinc-200">Create</TabsTrigger>
                      <TabsTrigger value="get" className="data-[state=active]:bg-background dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-foreground dark:data-[state=active]:text-white data-[state=inactive]:text-foreground dark:data-[state=inactive]:text-zinc-200">Get</TabsTrigger>
                      <TabsTrigger value="update" className="data-[state=active]:bg-background dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-foreground dark:data-[state=active]:text-white data-[state=inactive]:text-foreground dark:data-[state=inactive]:text-zinc-200">Update</TabsTrigger>
                      <TabsTrigger value="delete" className="data-[state=active]:bg-background dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-foreground dark:data-[state=active]:text-white data-[state=inactive]:text-foreground dark:data-[state=inactive]:text-zinc-200">Delete</TabsTrigger>
                    </TabsList>

                    {/* Create Blog Tab */}
                    <TabsContent value="create" className="space-y-8">

                  {/* Create Blog */}
                  <Card className="border-l-4 border-l-green-500 bg-card dark:bg-zinc-800 border-border dark:border-zinc-600">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-foreground dark:text-white">Create Blog</CardTitle>
                        <Badge className="bg-green-600">POST</Badge>
                      </div>
                      <CardDescription className="text-muted-foreground dark:text-zinc-300">
                        URL: <code className="bg-muted dark:bg-zinc-700 px-2 py-1 rounded text-sm text-foreground dark:text-white">https://soreal.app/api/admin/blog</code>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-card dark:bg-zinc-800">
                      <p className="text-foreground dark:text-white">Create a new blog post.</p>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Required Request Body Parameters</h4>
                        <div className="rounded-md border border-border dark:border-zinc-600">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableHead className="text-foreground dark:text-white">Parameter</TableHead>
                                <TableHead className="text-foreground dark:text-white">Type</TableHead>
                                <TableHead className="text-foreground dark:text-white">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">title</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Blog title (max 200 characters)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">content</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Blog content (max 10000 characters)</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Optional Request Body Parameters</h4>
                        <div className="rounded-md border border-border dark:border-zinc-600">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableHead className="text-foreground dark:text-white">Parameter</TableHead>
                                <TableHead className="text-foreground dark:text-white">Type</TableHead>
                                <TableHead className="text-foreground dark:text-white">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">slug</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">URL slug (lowercase, numbers, hyphens only, max 100 characters)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">featured_image_url</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">URL to featured image (max 300 characters)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">archived</TableCell>
                                <TableCell className="text-foreground dark:text-white">boolean</TableCell>
                                <TableCell className="text-foreground dark:text-white">Whether blog is archived (default: false)</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Request</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "slug": "my-first-blog-post",
  "featured_image_url": "https://example.com/image.jpg",
  "archived": false
}`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Response</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "id": "clx123abc456",
    "title": "My First Blog Post",
    "content": "This is the content of my blog post...",
    "slug": "my-first-blog-post",
    "featured_image_url": "https://example.com/image.jpg",
    "archived": false,
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}`}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Create Multiple Blogs */}
                  <Card className="border-l-4 border-l-green-500 bg-card dark:bg-zinc-800 border-border dark:border-zinc-600">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-foreground dark:text-white">Create Multiple Blogs</CardTitle>
                        <Badge className="bg-green-600">POST</Badge>
                      </div>
                      <CardDescription className="text-muted-foreground dark:text-zinc-300">
                        URL: <code className="bg-muted dark:bg-zinc-700 px-2 py-1 rounded text-sm text-foreground dark:text-white">https://soreal.app/api/admin/blog/multiple</code>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-card dark:bg-zinc-800">
                      <p className="text-foreground dark:text-white">Create multiple blog posts in a single request. Existing slugs will be returned without creating duplicates.</p>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Required Request Body Parameters</h4>
                        <div className="rounded-md border border-border dark:border-zinc-600">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableHead className="text-foreground dark:text-white">Parameter</TableHead>
                                <TableHead className="text-foreground dark:text-white">Type</TableHead>
                                <TableHead className="text-foreground dark:text-white">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs</TableCell>
                                <TableCell className="text-foreground dark:text-white">array</TableCell>
                                <TableCell className="text-foreground dark:text-white">Array of blog objects to create</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs[].title</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Blog title (max 200 characters)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs[].content</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Blog content (max 10000 characters)</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Optional Request Body Parameters</h4>
                        <div className="rounded-md border border-border dark:border-zinc-600">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableHead className="text-foreground dark:text-white">Parameter</TableHead>
                                <TableHead className="text-foreground dark:text-white">Type</TableHead>
                                <TableHead className="text-foreground dark:text-white">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs[].slug</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">URL slug (lowercase, numbers, hyphens only, max 100 characters). Auto-generated from title if not provided.</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs[].featured_image_url</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">URL to featured image (max 300 characters)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs[].archived</TableCell>
                                <TableCell className="text-foreground dark:text-white">boolean</TableCell>
                                <TableCell className="text-foreground dark:text-white">Whether blog is archived (default: false)</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Request</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "blogs": [
    {
      "title": "First Blog Post",
      "content": "Content of the first blog post...",
      "slug": "first-blog-post",
      "featured_image_url": "https://example.com/image1.jpg",
      "archived": false
    },
    {
      "title": "Second Blog Post",
      "content": "Content of the second blog post...",
      "featured_image_url": "https://example.com/image2.jpg"
    }
  ]
}`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Response</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "success": true,
  "message": "Multiple blogs processed successfully",
  "data": {
    "existingSlugs": [
      {
        "title": "First Blog Post",
        "slug": "first-blog-post"
      }
    ],
    "createdBlogs": [
      {
        "id": "clx789def012",
        "title": "Second Blog Post",
        "content": "Content of the second blog post...",
        "slug": "second-blog-post",
        "featured_image_url": "https://example.com/image2.jpg",
        "archived": false,
        "created_at": "2024-01-01T12:00:00.000Z",
        "updated_at": "2024-01-01T12:00:00.000Z"
      }
    ]
  }
}`}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>

                </TabsContent>

                {/* Get Blog Tab */}
                <TabsContent value="get" className="space-y-8">
                  {/* Get Blog */}
                  <Card className="border-l-4 border-l-blue-500 bg-card dark:bg-zinc-800 border-border dark:border-zinc-600">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-foreground dark:text-white">Get Blog</CardTitle>
                        <Badge className="bg-blue-600">GET</Badge>
                      </div>
                      <CardDescription className="text-muted-foreground dark:text-zinc-300">
                        URL: <code className="bg-muted dark:bg-zinc-700 px-2 py-1 rounded text-sm text-foreground dark:text-white">https://soreal.app/api/admin/blog/{"{id}"}</code>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-card dark:bg-zinc-800">
                      <p className="text-foreground dark:text-white">Retrieve a specific blog post by ID.</p>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Request Path Parameters</h4>
                        <div className="rounded-md border border-border dark:border-zinc-600">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableHead className="text-foreground dark:text-white">Parameter</TableHead>
                                <TableHead className="text-foreground dark:text-white">Type</TableHead>
                                <TableHead className="text-foreground dark:text-white">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">id</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Blog ID</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Response</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "success": true,
  "message": "Blog retrieved successfully",
  "data": {
    "id": "123",
    "title": "My Blog Post",
    "content": "Blog content...",
    "slug": "my-blog-post",
    "featured_image_url": "https://example.com/image.jpg",
    "archived": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}`}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>

                  {/* List Blogs */}
                  <Card className="border-l-4 border-l-blue-500 bg-card dark:bg-zinc-800 border-border dark:border-zinc-600">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-foreground dark:text-white">List Blogs</CardTitle>
                        <Badge className="bg-blue-600">GET</Badge>
                      </div>
                      <CardDescription className="text-muted-foreground dark:text-zinc-300">
                        URL: <code className="bg-muted dark:bg-zinc-700 px-2 py-1 rounded text-sm text-foreground dark:text-white">https://soreal.app/api/admin/blog</code>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-card dark:bg-zinc-800">
                      <p className="text-foreground dark:text-white">Retrieve a paginated list of blog posts with optional search and sorting.</p>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Optional Query Parameters</h4>
                        <div className="rounded-md border border-border dark:border-zinc-600">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableHead className="text-foreground dark:text-white">Parameter</TableHead>
                                <TableHead className="text-foreground dark:text-white">Type</TableHead>
                                <TableHead className="text-foreground dark:text-white">Default</TableHead>
                                <TableHead className="text-foreground dark:text-white">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">page</TableCell>
                                <TableCell className="text-foreground dark:text-white">number</TableCell>
                                <TableCell className="text-foreground dark:text-white">1</TableCell>
                                <TableCell className="text-foreground dark:text-white">Page number (minimum: 1)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">limit</TableCell>
                                <TableCell className="text-foreground dark:text-white">number</TableCell>
                                <TableCell className="text-foreground dark:text-white">10</TableCell>
                                <TableCell className="text-foreground dark:text-white">Items per page (1-100)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">search</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">-</TableCell>
                                <TableCell className="text-foreground dark:text-white">Search term (max 100 chars, searches title, content, slug)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">sort</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">latest</TableCell>
                                <TableCell className="text-foreground dark:text-white">Sort order: "latest" or "oldest"</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Request</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`GET /api/admin/blog?page=1&limit=5&search=tutorial&sort=latest`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Response</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "success": true,
  "message": "Blogs retrieved successfully",
  "data": [
    {
      "id": "clx123abc456",
      "title": "React Tutorial",
      "content": "Learn React basics...",
      "slug": "react-tutorial",
      "featured_image_url": "https://example.com/react.jpg",
      "archived": false,
      "created_at": "2024-01-01T12:00:00.000Z",
      "updated_at": "2024-01-01T12:00:00.000Z"
    },
    {
      "id": "clx789def012",
      "title": "JavaScript Tutorial",
      "content": "JavaScript fundamentals...",
      "slug": "javascript-tutorial",
      "featured_image_url": null,
      "archived": false,
      "created_at": "2024-01-01T11:00:00.000Z",
      "updated_at": "2024-01-01T11:30:00.000Z"
    }
  ]
}`}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>

                </TabsContent>

                {/* Update Blog Tab */}
                <TabsContent value="update" className="space-y-8">
                  {/* Update Blog */}
                  <Card className="border-l-4 border-l-amber-500 bg-card dark:bg-zinc-800 border-border dark:border-zinc-600">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-foreground dark:text-white">Update Blog</CardTitle>
                        <Badge className="bg-amber-600">PUT</Badge>
                      </div>
                      <CardDescription className="text-muted-foreground dark:text-zinc-300">
                        URL: <code className="bg-muted dark:bg-zinc-700 px-2 py-1 rounded text-sm text-foreground dark:text-white">https://soreal.app/api/admin/blog/{"{id}"}</code>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-card dark:bg-zinc-800">
                      <p className="text-foreground dark:text-white">Update an existing blog post. All parameters are optional.</p>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Optional Request Body Parameters</h4>
                        <div className="rounded-md border border-border dark:border-zinc-600">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableHead className="text-foreground dark:text-white">Parameter</TableHead>
                                <TableHead className="text-foreground dark:text-white">Type</TableHead>
                                <TableHead className="text-foreground dark:text-white">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">title</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Updated blog title (max 200 characters)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">content</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Updated blog content (max 10000 characters)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">featured_image_url</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Updated featured image URL (max 300 characters)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">archived</TableCell>
                                <TableCell className="text-foreground dark:text-white">boolean</TableCell>
                                <TableCell className="text-foreground dark:text-white">Updated archive status</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Request</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "title": "Updated Blog Title",
  "content": "This is the updated content of my blog post...",
  "featured_image_url": "https://example.com/updated-image.jpg",
  "archived": true
}`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Response</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "id": "clx123abc456",
    "title": "Updated Blog Title",
    "content": "This is the updated content of my blog post...",
    "featured_image_url": "https://example.com/updated-image.jpg",
    "archived": true,
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:30:00.000Z"
  }
}`}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Update Multiple Blogs */}
                  <Card className="border-l-4 border-l-amber-500 bg-card dark:bg-zinc-800 border-border dark:border-zinc-600">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-foreground dark:text-white">Update Multiple Blogs</CardTitle>
                        <Badge className="bg-amber-600">PUT</Badge>
                      </div>
                      <CardDescription className="text-muted-foreground dark:text-zinc-300">
                        URL: <code className="bg-muted dark:bg-zinc-700 px-2 py-1 rounded text-sm text-foreground dark:text-white">https://soreal.app/api/admin/blog</code>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-card dark:bg-zinc-800">
                      <p className="text-foreground dark:text-white">Update multiple blog posts in a single request. Blogs without IDs, with invalid IDs, or with slug conflicts will be separated in the response.</p>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Required Request Body Parameters</h4>
                        <div className="rounded-md border border-border dark:border-zinc-600">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableHead className="text-foreground dark:text-white">Parameter</TableHead>
                                <TableHead className="text-foreground dark:text-white">Type</TableHead>
                                <TableHead className="text-foreground dark:text-white">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs</TableCell>
                                <TableCell className="text-foreground dark:text-white">array</TableCell>
                                <TableCell className="text-foreground dark:text-white">Array of blog objects to update</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Optional Request Body Parameters</h4>
                        <div className="rounded-md border border-border dark:border-zinc-600">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableHead className="text-foreground dark:text-white">Parameter</TableHead>
                                <TableHead className="text-foreground dark:text-white">Type</TableHead>
                                <TableHead className="text-foreground dark:text-white">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs[].id</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Blog ID to update (max 100 characters)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs[].title</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Updated blog title (max 200 characters)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs[].content</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Updated blog content (max 10000 characters)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs[].slug</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Updated URL slug (lowercase, numbers, hyphens only, max 100 characters)</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs[].featured_image_url</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Updated featured image URL</TableCell>
                              </TableRow>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogs[].archived</TableCell>
                                <TableCell className="text-foreground dark:text-white">boolean</TableCell>
                                <TableCell className="text-foreground dark:text-white">Updated archive status</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Request</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "blogs": [
    {
      "id": "clx123abc456",
      "title": "Complete Updated Blog Post",
      "content": "This is a comprehensive update with all fields modified...",
      "slug": "complete-updated-blog-post",
      "featured_image_url": "https://example.com/updated-complete-image.jpg",
      "archived": false
    },
    {
      "title": "Blog Without ID",
      "content": "This blog object has no ID field and will be categorized separately...",
      "slug": "blog-without-id",
      "featured_image_url": "https://example.com/no-id-image.jpg",
      "archived": false
    },
    {
      "id": "nonexistent123",
      "title": "Blog with Invalid ID",
      "content": "This blog has an ID that doesn't exist in the database...",
      "archived": true
    },
    {
      "id": "clx789def012",
      "title": "Blog with Slug Conflict",
      "content": "This blog update will cause a slug conflict...",
      "slug": "existing-slug-in-database",
      "featured_image_url": "https://example.com/conflict-image.jpg"
    }
  ]
}`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Response</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "success": true,
  "message": "Successfully processed blog update request",
  "data": {
    "blogsWithoutId": [
      {
        "title": "Blog Without ID",
        "content": "This blog object has no ID field and will be categorized separately...",
        "slug": "blog-without-id",
        "featured_image_url": "https://example.com/no-id-image.jpg",
        "archived": false
      }
    ],
    "blogsWithInvalidId": [
      {
        "id": "nonexistent123",
        "title": "Blog with Invalid ID",
        "content": "This blog has an ID that doesn't exist in the database...",
        "archived": true
      }
    ],
    "blogsWithSlugConflict": [
      {
        "id": "clx789def012",
        "title": "Blog with Slug Conflict",
        "content": "This blog update will cause a slug conflict...",
        "slug": "existing-slug-in-database",
        "featured_image_url": "https://example.com/conflict-image.jpg"
      }
    ],
    "updatedBlogs": [
      {
        "id": "clx123abc456",
        "title": "Complete Updated Blog Post",
        "content": "This is a comprehensive update with all fields modified...",
        "slug": "complete-updated-blog-post",
        "featured_image_url": "https://example.com/updated-complete-image.jpg",
        "archived": false,
        "created_at": "2024-01-01T12:00:00.000Z",
        "updated_at": "2024-01-01T12:45:00.000Z"
      }
    ]
  }
}`}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>

                </TabsContent>

                {/* Delete Blog Tab */}
                <TabsContent value="delete" className="space-y-8">
                  {/* Delete Blog */}
                  <Card className="border-l-4 border-l-red-500 bg-card dark:bg-zinc-800 border-border dark:border-zinc-600">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-foreground dark:text-white">Delete Blog</CardTitle>
                        <Badge className="bg-red-600">DELETE</Badge>
                      </div>
                      <CardDescription className="text-muted-foreground dark:text-zinc-300">
                        URL: <code className="bg-muted dark:bg-zinc-700 px-2 py-1 rounded text-sm text-foreground dark:text-white">https://soreal.app/api/admin/blog/{"{id}"}</code>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-card dark:bg-zinc-800">
                      <p className="text-foreground dark:text-white">Permanently delete a blog post.</p>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Request Path Parameters</h4>
                        <div className="rounded-md border border-border dark:border-zinc-600">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableHead className="text-foreground dark:text-white">Parameter</TableHead>
                                <TableHead className="text-foreground dark:text-white">Type</TableHead>
                                <TableHead className="text-foreground dark:text-white">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">id</TableCell>
                                <TableCell className="text-foreground dark:text-white">string</TableCell>
                                <TableCell className="text-foreground dark:text-white">Blog ID to delete</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Response</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "success": true,
  "message": "Blog deleted successfully",
  "data": {
    "id": "123",
    "title": "Deleted Blog Title",
    "slug": "deleted-blog-slug"
  }
}`}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delete Multiple Blogs */}
                  <Card className="border-l-4 border-l-red-500 bg-card dark:bg-zinc-800 border-border dark:border-zinc-600">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-foreground dark:text-white">Delete Multiple Blogs</CardTitle>
                        <Badge className="bg-red-600">DELETE</Badge>
                      </div>
                      <CardDescription className="text-muted-foreground dark:text-zinc-300">
                        URL: <code className="bg-muted dark:bg-zinc-700 px-2 py-1 rounded text-sm text-foreground dark:text-white">https://soreal.app/api/admin/blog</code>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-card dark:bg-zinc-800">
                      <p className="text-foreground dark:text-white">Delete multiple blog posts in a single request.</p>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Required Request Body Parameters</h4>
                        <div className="rounded-md border border-border dark:border-zinc-600">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableHead className="text-foreground dark:text-white">Parameter</TableHead>
                                <TableHead className="text-foreground dark:text-white">Type</TableHead>
                                <TableHead className="text-foreground dark:text-white">Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="border-b border-border dark:border-zinc-600">
                                <TableCell className="font-mono text-foreground dark:text-white">blogIds</TableCell>
                                <TableCell className="text-foreground dark:text-white">number[]</TableCell>
                                <TableCell className="text-foreground dark:text-white">Array of blog IDs to delete (min: 1, max: 10)</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Request</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "blogIds": [123, 456, 789]
}`}
                        </pre>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-foreground dark:text-white">Example Response</h4>
                        <pre className="bg-muted dark:bg-zinc-700 p-3 rounded-md font-mono text-sm overflow-auto text-foreground dark:text-white border border-border dark:border-zinc-600">
{`{
  "success": true,
  "message": "Successfully processed blog deletion request",
  "data": {
    "validIds": [123, 456],
    "invalidIds": [789],
    "deletedBlogs": [
      {
        "id": "123",
        "title": "First Blog Post",
        "content": "Content of first blog...",
        "slug": "first-blog-post",
        "featured_image_url": "https://example.com/image1.jpg",
        "archived": false,
        "created_at": "2024-01-01T10:00:00.000Z",
        "updated_at": "2024-01-01T10:00:00.000Z"
      },
      {
        "id": "456",
        "title": "Second Blog Post",
        "content": "Content of second blog...",
        "slug": "second-blog-post",
        "featured_image_url": null,
        "archived": true,
        "created_at": "2024-01-02T10:00:00.000Z",
        "updated_at": "2024-01-02T10:00:00.000Z"
      }
    ]
  }
}`}
                        </pre>
                      </div>

                    </CardContent>
                  </Card>

                    </TabsContent>
                  </Tabs>

                  {/* Common Error Responses for all Blog endpoints */}
                  <div className="space-y-4 mt-8">
                    <h3 className="text-xl font-semibold text-foreground dark:text-white">Common Error Responses</h3>
                    <p className="text-muted-foreground dark:text-zinc-300">
                      These error responses apply to all blog endpoints above.
                    </p>
                    <div className="rounded-md border border-border dark:border-zinc-600">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-border dark:border-zinc-600">
                            <TableHead className="text-foreground dark:text-white">Status Code</TableHead>
                            <TableHead className="text-foreground dark:text-white">Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="border-b border-border dark:border-zinc-600">
                            <TableCell className="text-foreground dark:text-white">400</TableCell>
                            <TableCell className="text-foreground dark:text-white">Bad Request - Invalid parameters or validation failed</TableCell>
                          </TableRow>
                          <TableRow className="border-b border-border dark:border-zinc-600">
                            <TableCell className="text-foreground dark:text-white">401</TableCell>
                            <TableCell className="text-foreground dark:text-white">Unauthorized - Invalid or missing API key</TableCell>
                          </TableRow>
                          <TableRow className="border-b border-border dark:border-zinc-600">
                            <TableCell className="text-foreground dark:text-white">404</TableCell>
                            <TableCell className="text-foreground dark:text-white">Not Found - Blog post not found</TableCell>
                          </TableRow>
                          <TableRow className="border-b border-border dark:border-zinc-600">
                            <TableCell className="text-foreground dark:text-white">409</TableCell>
                            <TableCell className="text-foreground dark:text-white">Conflict - Slug already exists</TableCell>
                          </TableRow>
                          <TableRow className="border-b border-border dark:border-zinc-600">
                            <TableCell className="text-foreground dark:text-white">500</TableCell>
                            <TableCell className="text-foreground dark:text-white">Internal Server Error</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page; 
