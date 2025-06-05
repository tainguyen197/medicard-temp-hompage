"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";
import dynamic from "next/dynamic";
import { ROUTES } from "@/lib/router";

const CKEditorComponent = dynamic(
  () => import("@/components/CKEditorComponent"),
  { ssr: false }
);
export default function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [featureImageId, setFeatureImageId] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Fetch service data
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch service");
        }

        const service = await response.json();

        // Set form fields with service data
        setTitle(service.title || "");
        setStatus(service.status || "DRAFT");
        setSlug(service.slug || "");
        setDescription(service.description || "");
        setShortDescription(service.shortDescription || "");
        setFeaturedImageUrl(service.featureImage?.url || "");
        setFeatureImageId(service.featureImageId || "");

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service");
        router.push("/dashboard/admin/services");
      }
    };

    fetchService();
  }, [id, router]);

  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/&/g, "-and-") // Replace & with 'and'
      .replace(/[^\w\-]+/g, "") // Remove all non-word characters
      .replace(/\-\-+/g, "-"); // Replace multiple - with single -
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Only auto-generate slug if it hasn't been manually edited
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Handle slug change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugManuallyEdited(true);
  };

  // Use useCallback to memoize the onChange handler to prevent re-renders
  const handleEditorChange = useCallback(
    (event: unknown, editor: { getData: () => string }) => {
      const data = editor.getData();
      setDescription(data);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title) {
      toast.error("Please enter a title for your service");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          status,
          slug,
          description,
          shortDescription,
          featuredImage: featuredImageUrl,
          featureImageId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update service");
      }

      toast.success("Service updated successfully!");
      router.push(ROUTES.ADMIN_SERVICES);
      router.refresh();
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update service"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 bg-white rounded-md">
        <div className="flex justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-white rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Service</h1>
        <Button
          className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
          variant="outline"
          onClick={() => router.push(ROUTES.ADMIN_SERVICES)}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter service title"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Feature Image</Label>
            <ImageUpload
              value={featuredImageUrl}
              onChange={setFeaturedImageUrl}
              onImageUploading={setIsImageUploading}
              onMediaIdChange={setFeatureImageId}
            />
            <p className="text-xs text-gray-500">
              Recommended aspect ratio: 270:200
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={handleSlugChange}
            placeholder="service-url-slug"
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            This will be used in the URL: /services/{slug}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Input
            id="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Brief summary of the service"
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            A brief summary that will be displayed in service listings and
            previews.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Service Description</Label>
          <div>
            {typeof window !== "undefined" && (
              <CKEditorComponent
                data={description}
                onChange={handleEditorChange}
              />
            )}
          </div>
          <p className="text-xs text-gray-500">
            Describe your healthcare service in detail. You can include
            formatting, images, and links.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <p className="text-xs text-gray-500">
            Choose the status of your service. Only published services will be
            visible on your website.
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
            type="button"
            variant="outline"
            onClick={() => router.push(ROUTES.ADMIN_SERVICES)}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
            type="submit"
            disabled={isSubmitting || isImageUploading}
          >
            {isSubmitting ? "Updating..." : "Update Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}
