"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ImageUpload";
import { ROUTES } from "@/lib/router";
import dynamic from "next/dynamic";

const CKEditorComponent = dynamic(
  () => import("@/components/CKEditorComponent"),
  { ssr: false }
);

export default function NewServicePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [shortDescriptionEn, setShortDescriptionEn] = useState("");
  const [keywords, setKeywords] = useState("");
  const [enKeywords, setEnKeywords] = useState("");
  const [slug, setSlug] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [featureImageId, setFeatureImageId] = useState("");
  const [featuredImageEn, setFeaturedImageEn] = useState("");
  const [featureImageEnId, setFeatureImageEnId] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageEnUploading, setIsImageEnUploading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaTitleEn, setMetaTitleEn] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaDescriptionEn, setMetaDescriptionEn] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaKeywordsEn, setMetaKeywordsEn] = useState("");

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

  const handleEditorChangeEn = useCallback(
    (event: unknown, editor: { getData: () => string }) => {
      const data = editor.getData();
      setDescriptionEn(data);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title) {
      toast.error("Please enter a title for your service");
      return;
    }

    if (!description || description === "<p><br></p>") {
      toast.error("Please add a description to your service");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          titleEn: titleEn || undefined,
          description,
          descriptionEn: descriptionEn || undefined,
          shortDescription,
          shortDescriptionEn: shortDescriptionEn || undefined,
          keywords,
          enKeywords: enKeywords || undefined,
          status,
          showOnHomepage,
          slug,
          metaTitle: metaTitle || undefined,
          metaTitleEn: metaTitleEn || undefined,
          metaDescription: metaDescription || undefined,
          metaDescriptionEn: metaDescriptionEn || undefined,
          metaKeywords: metaKeywords || undefined,
          metaKeywordsEn: metaKeywordsEn || undefined,
          featuredImage, // Send the image URL
          featureImageId, // Send the media ID if available
          featuredImageEn, // Send the English image URL
          featureImageEnId, // Send the English media ID if available
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create service");
      }

      toast.success("Service created successfully!");
      router.push("/dashboard/admin/services");
      router.refresh();
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create service"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Service</h1>
        <Button
          className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
          variant="outline"
          onClick={() => router.push(ROUTES.ADMIN_SERVICES)}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vietnamese Content Section */}
        <fieldset className="p-4 border border-gray-200 rounded-lg">
          <legend className="text-lg font-semibold mb-4 px-2">
            Vietnamese Content (Default)
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title">Service Title (Vietnamese)</Label>
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter service title in Vietnamese"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Feature Image</Label>
              <ImageUpload
                value={featuredImage}
                onChange={setFeaturedImage}
                onImageUploading={setIsImageUploading}
                onMediaIdChange={setFeatureImageId}
                aspectRatio={270 / 200}
                aspectRatioText="270:200"
              />
              <p className="text-xs text-gray-500">
                Recommended aspect ratio: 270:200
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="shortDescription">
              Short Description (Vietnamese)
            </Label>
            <Input
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief summary of the service in Vietnamese"
              className="w-full"
            />
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="keywords">Keywords (Vietnamese)</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Thăm khám, tư vấn, chẩn đoán và điều trị các bệnh lý cơ xương khớp, Sử dụng các máy móc vật lý trị liệu, Kỹ thuật viên có tay nghề chuyên môn cao"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Separate keywords with commas for better SEO
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <Label>Service Description (Vietnamese)</Label>
            <div>
              {typeof window !== "undefined" && (
                <CKEditorComponent
                  data={description}
                  onChange={handleEditorChange}
                />
              )}
            </div>
          </div>

          {/* SEO Meta Fields - Vietnamese */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-md font-medium mb-4">
              SEO Meta Fields (Vietnamese)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">
                  Meta Title (up to 65 characters)
                </Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO title for search engines"
                  maxLength={65}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  {metaTitle.length}/65 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Separate keywords with commas
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="metaDescription">
                Meta Description (up to 155 characters)
              </Label>
              <textarea
                id="metaDescription"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Brief description for search engine results"
                maxLength={155}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                {metaDescription.length}/155 characters
              </p>
            </div>
          </div>
        </fieldset>

        {/* English Content Section */}
        <fieldset className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <legend className="text-lg font-semibold mb-4 px-2 text-blue-800">
            English Content (Optional)
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="titleEn">Service Title (English)</Label>
              <Input
                id="titleEn"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Enter service title in English"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImageEn">Feature Image (English)</Label>
              <ImageUpload
                value={featuredImageEn}
                onChange={setFeaturedImageEn}
                onImageUploading={setIsImageEnUploading}
                onMediaIdChange={setFeatureImageEnId}
                aspectRatio={270 / 200}
                aspectRatioText="270:200"
              />
              <p className="text-xs text-gray-500">
                Optional: Different image for English version
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="shortDescriptionEn">
              Short Description (English)
            </Label>
            <Input
              id="shortDescriptionEn"
              value={shortDescriptionEn}
              onChange={(e) => setShortDescriptionEn(e.target.value)}
              placeholder="Brief summary of the service in English"
              className="w-full"
            />
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="enKeywords">Keywords (English)</Label>
            <Input
              id="enKeywords"
              value={enKeywords}
              onChange={(e) => setEnKeywords(e.target.value)}
              placeholder="Medical examination, consultation, diagnosis, treatment, physical therapy equipment, professional expertise"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Separate keywords with commas for better SEO
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <Label>Service Description (English)</Label>
            <div>
              {typeof window !== "undefined" && (
                <CKEditorComponent
                  data={descriptionEn}
                  onChange={handleEditorChangeEn}
                />
              )}
            </div>
          </div>

          {/* SEO Meta Fields - English */}
          <div className="mt-6 pt-4 border-t border-blue-300">
            <h3 className="text-md font-medium mb-4 text-blue-800">
              SEO Meta Fields (English)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitleEn">
                  Meta Title (up to 65 characters)
                </Label>
                <Input
                  id="metaTitleEn"
                  value={metaTitleEn}
                  onChange={(e) => setMetaTitleEn(e.target.value)}
                  placeholder="SEO title for search engines (English)"
                  maxLength={65}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  {metaTitleEn.length}/65 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywordsEn">Meta Keywords</Label>
                <Input
                  id="metaKeywordsEn"
                  value={metaKeywordsEn}
                  onChange={(e) => setMetaKeywordsEn(e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Separate keywords with commas
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="metaDescriptionEn">
                Meta Description (up to 155 characters)
              </Label>
              <textarea
                id="metaDescriptionEn"
                value={metaDescriptionEn}
                onChange={(e) => setMetaDescriptionEn(e.target.value)}
                placeholder="Brief description for search engine results (English)"
                maxLength={155}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                {metaDescriptionEn.length}/155 characters
              </p>
            </div>
          </div>
        </fieldset>

        {/* Settings Section */}
        <fieldset className="p-4 border border-gray-200 rounded-lg">
          <legend className="text-lg font-semibold mb-4 px-2">
            Service Settings
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: string) => setStatus(value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
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
              <Label className="text-sm font-medium">Homepage Display</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showOnHomepage"
                  checked={showOnHomepage}
                  onChange={(e) => setShowOnHomepage(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="showOnHomepage" className="text-sm">
                  Show on Homepage
                </Label>
              </div>
              <p className="text-xs text-gray-500">
                Display this service on the homepage (max 4 items)
              </p>
            </div>
          </div>
        </fieldset>

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
            disabled={isSubmitting || isImageUploading || isImageEnUploading}
          >
            {isSubmitting ? "Creating..." : "Create Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}
