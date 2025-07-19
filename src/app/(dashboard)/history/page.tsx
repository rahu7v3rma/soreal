"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { ImageViewer } from "@/components/ui/image-viewer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Calendar,
  Clock,
  Filter,
  History,
  ImageIcon,
  Link as LinkIcon,
  Loader,
  RefreshCw,
  Search,
  Share,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Generation, useSupabase } from "@/context/supabase";
import { useDownloadImage } from "@/hooks/download-image";
import { useShareImage } from "@/hooks/share-image";

const imagesPerPage = 8;

const Page = () => {
  const router = useRouter();
  const { handleDownloadImage } = useDownloadImage();
  const {
    generations,
    getUserGenerationsLoading,
    getUserGenerations,
    deleteUserGeneration,
    deleteUserGenerationLoading,
  } = useSupabase();
  const { handleShareImage } = useShareImage();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>();
  const [currentImagePrompt, setCurrentImagePrompt] = useState<string | null>();
  const [currentImageAspectRatio, setCurrentImageAspectRatio] = useState<
    string | null
  >();
  const [currentImageMode, setCurrentImageMode] = useState<string | null>();
  const [allGenerations, setAllGenerations] = useState<Generation[]>([]);
  const [filteredGenerations, setFilteredGenerations] = useState<Generation[]>(
    []
  );
  const [generationsPage, setGenerationsPage] = useState(1);
  const [filterGenerationType, setFilterGenerationType] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const openImageViewer = (image: Generation) => {
    if (image.public_url) {
      setCurrentImage(image.public_url);
      setCurrentImagePrompt(image.prompt);
      setCurrentImageAspectRatio(image.aspect_ratio);
      setCurrentImageMode(image.generation_type);
      setViewerOpen(true);
    }
  };

  const confirmDeleteImage = (public_url: string) => {
    setImageToDelete(public_url);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    setAllGenerations(generations);
    setFilteredGenerations(generations);
  }, [generations]);

  // Auto-refresh generations when component mounts to ensure latest images are shown
  useEffect(() => {
    getUserGenerations();
  }, []);

  useEffect(() => {
    setGenerationsPage(1);
    if (filterGenerationType === "all") {
      setFilteredGenerations(allGenerations);
    } else {
      setFilteredGenerations(
        allGenerations.filter(
          (generation) => generation.generation_type === filterGenerationType
        )
      );
    }
  }, [filterGenerationType, allGenerations]);

  return (
    <div className="space-y-6 w-full pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <History className="mr-2 h-6 w-6 text-primary" />
          Generation History
        </h1>
        <p className="text-muted-foreground">
          Browse, search, and manage your generated images
        </p>
      </div>

      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              getUserGenerations();
              setFilterGenerationType("all");
              setSortBy("newest");
              setSearchQuery("");
              setGenerationsPage(1);
            }}
            disabled={getUserGenerationsLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => router.push("/create")}>
            <ImageIcon className="mr-2 h-4 w-4" />
            New Generation
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by prompt..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setGenerationsPage(1);
              if (e.target.value.length > 0) {
                setFilteredGenerations(
                  allGenerations.filter(
                    (generation) =>
                      generation.prompt &&
                      generation.prompt
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                  )
                );
              } else {
                setFilteredGenerations(allGenerations);
              }
            }}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filterGenerationType}
            onValueChange={(value) => {
              setFilterGenerationType(value);
              setGenerationsPage(1);
              if (value === "all") {
                setFilteredGenerations(allGenerations);
              } else {
                setFilteredGenerations(
                  allGenerations.filter(
                    (generation) => generation.generation_type === value
                  )
                );
              }
            }}
          >
            <SelectTrigger className="w-max">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by generation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Generations</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="remove-background">
                Remove Background
              </SelectItem>
              <SelectItem value="upscale">Upscale</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value);
              setGenerationsPage(1);
              if (value === "newest") {
                setFilteredGenerations((prev) =>
                  prev.sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                );
              } else {
                setFilteredGenerations((prev) =>
                  prev.sort(
                    (a, b) =>
                      new Date(a.created_at).getTime() -
                      new Date(b.created_at).getTime()
                  )
                );
              }
            }}
          >
            <SelectTrigger className="w-[150px]">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {(generationsPage - 1) * imagesPerPage + 1} -{" "}
            {Math.min(
              generationsPage * imagesPerPage,
              filteredGenerations.length
            )}{" "}
            of {filteredGenerations.length} image
            {filteredGenerations.length !== 1 ? "s" : ""}
          </div>
        </div>

        <TabsContent value="grid" className="space-y-4">
          {filteredGenerations.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No images found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || filterGenerationType !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't generated any images yet"}
              </p>
              {searchQuery || filterGenerationType !== "all" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterGenerationType("all");
                    setSortBy("newest");
                    setGenerationsPage(1);
                    setFilteredGenerations(allGenerations);
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => router.push("/create")}>
                  Create Your First Image
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4">
                {filteredGenerations
                  .slice(
                    (generationsPage - 1) * imagesPerPage,
                    generationsPage * imagesPerPage
                  )
                  .map((image) => (
                    <Card
                      key={image.id}
                      className="overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openImageViewer(image)}
                    >
                      <div className="aspect-square relative">
                        {image.public_url &&
                        typeof image.public_url === "string" &&
                        image.public_url.startsWith("http") ? (
                          <img
                            src={image.public_url}
                            alt={image.prompt || "Generated image"}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <p className="text-muted-foreground">
                              Invalid image URL
                            </p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                          <p className="text-white text-sm line-clamp-3 mb-2">
                            {image.prompt}
                          </p>
                          <div className="flex justify-end items-center">
                            <div className="flex gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 bg-black/50 text-white hover:bg-black/70 hover:text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (image.public_url) {
                                          handleShareImage(image.public_url);
                                        }
                                      }}
                                      type="button"
                                    >
                                      <LinkIcon className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Share</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 bg-black/50 text-white hover:bg-black/70 hover:text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (image.public_url) {
                                          handleDownloadImage({
                                            imageUrl: image.public_url,
                                            promptText: image.prompt || "",
                                          });
                                        }
                                      }}
                                      type="button"
                                    >
                                      <Share className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Download</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 bg-black/50 text-white hover:bg-black/70 hover:text-white"
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (image.public_url) {
                                          confirmDeleteImage(image.public_url);
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardFooter className="p-3 flex justify-between items-center">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(image.created_at).toLocaleDateString()}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
              <div className="pt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setGenerationsPage((p) => Math.max(1, p - 1))
                        }
                        className={
                          generationsPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {Array.from({
                      length: Math.ceil(
                        filteredGenerations.length / imagesPerPage
                      ),
                    }).map((_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          isActive={generationsPage === i + 1}
                          onClick={() => setGenerationsPage(i + 1)}
                          className={
                            generationsPage === i + 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setGenerationsPage((p) =>
                            Math.min(
                              Math.ceil(
                                filteredGenerations.length / imagesPerPage
                              ),
                              p + 1
                            )
                          )
                        }
                        className={
                          generationsPage ===
                          Math.ceil(filteredGenerations.length / imagesPerPage)
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Dialog.Portal
          container={
            typeof document !== "undefined" ? document.body : undefined
          }
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-[999]" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[1000] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
              Delete Image
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground">
              Are you sure you want to delete this image? This action cannot be
              undone.
            </Dialog.Description>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                }}
                disabled={deleteUserGenerationLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (imageToDelete) {
                    await deleteUserGeneration(imageToDelete);
                    setDeleteDialogOpen(false);
                    setImageToDelete(null);
                  }
                }}
                disabled={deleteUserGenerationLoading}
              >
                {deleteUserGenerationLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {viewerOpen && currentImage && (
        <ImageViewer
          imageUrl={currentImage}
          alt={currentImagePrompt || "Generated image"}
          prompt={currentImagePrompt || undefined}
          aspectRatio={currentImageAspectRatio || undefined}
          mode={(() => {
            // Convert generation_type to display name
            switch (currentImageMode) {
              case 'standard': return 'Standard';
              case 'premium': return 'Premium';
              case 'upscale': return 'Upscale';
              case 'remove-background': return 'Remove Background';
              default: return 'Premium'; // fallback
            }
          })()}
          onClose={() => setViewerOpen(false)}
          onDownload={() =>
            handleDownloadImage({
              imageUrl: currentImage,
              promptText: currentImagePrompt || "generated-image",
            })
          }
          onShare={() => handleShareImage(currentImage)}
        />
      )}
    </div>
  );
};

export default Page;
