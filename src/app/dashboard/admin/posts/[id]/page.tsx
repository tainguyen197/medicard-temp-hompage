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
  const [status, setStatus] = useState("DRAFT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
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

        // Set form fields with post data
        setTitle(post.title || "");
        setStatus(post.status || "DRAFT");
        setContent(post.content || "");
        setSlug(post.slug || "");
        setExcerpt(post.excerpt || "");
        setMetaTitle(post.metaTitle || "");
        setMetaDescription(post.metaDescription || "");
        setFeaturedImage(post.featuredImage || "");

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
          content,
          status,
          slug,
          excerpt,
          // metaTitle,
          // metaDescription,
          featuredImage,
          categories: selectedCategories,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
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
            <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter post title"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image</Label>
            <ImageUpload
              value={featuredImage}
              onChange={setFeaturedImage}
              onImageUploading={setIsImageUploading}
              aspectRatio={200 / 200}
              aspectRatioText="200:200"
            />
          </div>
        </div>

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
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
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

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary of the post"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categories">Categories</Label>
          <Select
            value={
              selectedCategories.length > 0 ? selectedCategories[0] : undefined
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

        <div className="space-y-2">
          <Label>Content</Label>
          <div>
            {typeof window !== "undefined" && (
              <CKEditorComponent data={content} onChange={handleEditorChange} />
            )}
          </div>
        </div>

        {/* <div className="bg-gray-50 p-4 rounded-md space-y-4">
          <h3 className="text-lg font-medium">SEO Settings</h3>
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="SEO Title (optional)"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Input
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="SEO Description (optional)"
              className="w-full"
            />
          </div>
        </div> */}

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
            disabled={isSubmitting || isImageUploading}
          >
            {isSubmitting ? "Saving..." : "Update News"}
          </Button>
        </div>
      </form>
    </div>
  );
}
