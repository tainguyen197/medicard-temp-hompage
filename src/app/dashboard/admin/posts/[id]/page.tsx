"use client";

import { useState, useCallback, useEffect, use } from "react";
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

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  console.log("edit post page");
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaTitleEn, setMetaTitleEn] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaDescriptionEn, setMetaDescriptionEn] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [shortDescriptionEn, setShortDescriptionEn] = useState("");
  const [enKeywords, setEnKeywords] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImageEn, setFeaturedImageEn] = useState("");
  const [featureImageId, setFeatureImageId] = useState("");
  const [featureImageEnId, setFeatureImageEnId] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageEnUploading, setIsImageEnUploading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const post = await response.json();

        // Set form fields with post data including translations
        setTitle(post.title || "");
        setTitleEn(post.titleEn || "");
        setStatus(post.status || "DRAFT");
        setContent(post.content || "");
        setContentEn(post.contentEn || "");
        setSlug(post.slug || "");
        setExcerpt(post.excerpt || "");
        setExcerptEn(post.excerptEn || "");
        setMetaTitle(post.metaTitle || "");
        setMetaTitleEn(post.metaTitleEn || "");
        setMetaDescription(post.metaDescription || "");
        setMetaDescriptionEn(post.metaDescriptionEn || "");
        setShortDescription(post.shortDescription || "");
        setShortDescriptionEn(post.shortDescriptionEn || "");
        setEnKeywords(post.enKeywords || "");
        setFeaturedImage(post.featuredImage || "");
        setFeaturedImageEn(post.featuredImageEn || "");
        setFeatureImageId(post.featureImageId || "");
        setFeatureImageEnId(post.featureImageEnId || "");

        // Set selected categories
        if (post.categories && post.categories.length > 0) {
          setSelectedCategories(
            post.categories.map((pc: any) => pc.category.id)
          );
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post");
        router.push(ROUTES.ADMIN_POSTS);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchPost();
    fetchCategories();
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
  const handleEditorChange = useCallback((event: any, editor: any) => {
    const data = editor.getData();
    setContent(data);
  }, []);

  const handleEditorChangeEn = useCallback((event: any, editor: any) => {
    const data = editor.getData();
    setContentEn(data);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title) {
      toast.error("Please enter a title for your post");
      return;
    }

    if (!content || content === "<p><br></p>") {
      toast.error("Please add some content to your post");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          titleEn: titleEn || undefined,
          content,
          contentEn: contentEn || undefined,
          status,
          slug,
          excerpt,
          excerptEn: excerptEn || undefined,
          metaTitle: metaTitle || undefined,
          metaTitleEn: metaTitleEn || undefined,
          metaDescription: metaDescription || undefined,
          metaDescriptionEn: metaDescriptionEn || undefined,
          shortDescription: shortDescription || undefined,
          shortDescriptionEn: shortDescriptionEn || undefined,
          enKeywords: enKeywords || undefined,
          featuredImage,
          featuredImageEn,
          featureImageId,
          featureImageEnId,
          categories: selectedCategories,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Update failed:", {
          status: response.status,
          statusText: response.statusText,
          error: error,
          postId: id,
        });
        debugger;
        throw new Error(error.error || "Failed to update post");
      }

      toast.success("Post updated successfully!");
      router.push(ROUTES.ADMIN_POSTS);
      router.refresh();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update post"
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
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-white rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit News</h1>
        <Button
          className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
          variant="outline"
          onClick={() => router.push(ROUTES.ADMIN_POSTS)}
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
              <Label htmlFor="title">Title (Vietnamese)</Label>
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter post title in Vietnamese"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image</Label>
              <ImageUpload
                value={featuredImage}
                onChange={setFeaturedImage}
                onImageUploading={setIsImageUploading}
                aspectRatio={1}
                aspectRatioText="1:1"
              />
              <p className="text-xs text-gray-500">
                Recommended aspect ratio: 1:1 (square)
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="excerpt">Excerpt (Vietnamese)</Label>
            <Input
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of the post in Vietnamese"
              className="w-full"
            />
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="shortDescription">
              Short Description (Vietnamese)
            </Label>
            <Input
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief description for Vietnamese content"
              className="w-full"
            />
          </div>

          <div className="space-y-2 mt-4">
            <Label>Content (Vietnamese)</Label>
            <div>
              {typeof window !== "undefined" && (
                <CKEditorComponent
                  data={content}
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
                <Label htmlFor="enKeywords">Keywords</Label>
                <Input
                  id="enKeywords"
                  value={enKeywords}
                  onChange={(e) => setEnKeywords(e.target.value)}
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
              <Label htmlFor="titleEn">Title (English)</Label>
              <Input
                id="titleEn"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Enter post title in English"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImageEn">Featured Image (English)</Label>
              <ImageUpload
                value={featuredImageEn}
                onChange={setFeaturedImageEn}
                onImageUploading={setIsImageEnUploading}
                onMediaIdChange={setFeatureImageEnId}
                aspectRatio={1}
                aspectRatioText="1:1"
              />
              <p className="text-xs text-gray-500">
                Optional: Different image for English version
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="excerptEn">Excerpt (English)</Label>
            <Input
              id="excerptEn"
              value={excerptEn}
              onChange={(e) => setExcerptEn(e.target.value)}
              placeholder="Brief summary of the post in English"
              className="w-full"
            />
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="shortDescriptionEn">
              Short Description (English)
            </Label>
            <Input
              id="shortDescriptionEn"
              value={shortDescriptionEn}
              onChange={(e) => setShortDescriptionEn(e.target.value)}
              placeholder="Brief description for English content"
              className="w-full"
            />
          </div>

          <div className="space-y-2 mt-4">
            <Label>Content (English)</Label>
            <div>
              {typeof window !== "undefined" && (
                <CKEditorComponent
                  data={contentEn}
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

            <div className="space-y-2 mt-4">
              <Label htmlFor="shortDescriptionEn">Short Description</Label>
              <Input
                id="shortDescriptionEn"
                value={shortDescriptionEn}
                onChange={(e) => setShortDescriptionEn(e.target.value)}
                placeholder="Brief description for English content"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Short summary for listings and previews
              </p>
            </div>
          </div>
        </fieldset>

        {/* Settings Section */}
        <fieldset className="p-4 border border-gray-200 rounded-lg">
          <legend className="text-lg font-semibold mb-4 px-2">
            Post Settings
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={handleSlugChange}
                placeholder="post-url-slug"
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="categories">Categories</Label>
            <Select
              value={
                selectedCategories.length > 0
                  ? selectedCategories[0]
                  : undefined
              }
              onValueChange={(value: string) => setSelectedCategories([value])}
            >
              <SelectTrigger id="categories">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category: any) => {
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </fieldset>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
            type="button"
            variant="outline"
            onClick={() => router.push(ROUTES.ADMIN_POSTS)}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
            type="submit"
            disabled={isSubmitting || isImageUploading || isImageEnUploading}
          >
            {isSubmitting ? "Updating..." : "Update Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
