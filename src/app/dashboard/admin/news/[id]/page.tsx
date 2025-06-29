"use client";

import { useState, useEffect, use, useCallback } from "react";
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
import dynamic from "next/dynamic";
import { ROUTES } from "@/lib/router";

const CKEditorComponent = dynamic(
  () => import("@/components/CKEditorComponent"),
  { ssr: false }
);

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [pin, setPin] = useState(false);
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [shortDescriptionEn, setShortDescriptionEn] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [featureImageId, setFeatureImageId] = useState("");
  const [featuredImageEnUrl, setFeaturedImageEnUrl] = useState("");
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

  // Category states
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch news article");
        }

        const news = await response.json();

        // Set form fields with news data including translations
        setTitle(news.title || "");
        setTitleEn(news.titleEn || "");
        setStatus(news.status || "DRAFT");
        setShowOnHomepage(news.showOnHomepage || false);
        setPin(news.pin || false);
        setSlug(news.slug || "");
        setDescription(news.description || "");
        setDescriptionEn(news.descriptionEn || "");
        setShortDescription(news.shortDescription || "");
        setShortDescriptionEn(news.shortDescriptionEn || "");
        setSelectedCategoryId(news.categoryId || "");
        setMetaTitle(news.metaTitle || "");
        setMetaTitleEn(news.metaTitleEn || "");
        setMetaDescription(news.metaDescription || "");
        setMetaDescriptionEn(news.metaDescriptionEn || "");
        setMetaKeywords(news.metaKeywords || "");
        setMetaKeywordsEn(news.metaKeywordsEn || "");
        setFeaturedImageUrl(news.featureImage?.url || "");
        setFeatureImageId(news.featureImageId || "");
        setFeaturedImageEnUrl(news.featureImageEn?.url || "");
        setFeatureImageEnId(news.featureImageEnId || "");

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Failed to load news article");
        router.push(ROUTES.ADMIN_NEWS);
      }
    };

    fetchNews();
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

  // Handle new category creation
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsCreatingCategory(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          slug: generateSlug(newCategoryName.trim()),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create category");
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setSelectedCategoryId(newCategory.id);
      setNewCategoryName("");
      setShowNewCategoryInput(false);
      toast.success("Category created successfully!");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create category"
      );
    } finally {
      setIsCreatingCategory(false);
    }
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
      toast.error("Please enter a title for your news article");
      return;
    }

    if (!description || description === "<p><br></p>") {
      toast.error("Please add content to your news article");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          titleEn: titleEn || undefined,
          status,
          showOnHomepage,
          pin,
          slug,
          description,
          descriptionEn: descriptionEn || undefined,
          shortDescription,
          shortDescriptionEn: shortDescriptionEn || undefined,
          categoryId: selectedCategoryId || undefined,
          metaTitle: metaTitle || undefined,
          metaTitleEn: metaTitleEn || undefined,
          metaDescription: metaDescription || undefined,
          metaDescriptionEn: metaDescriptionEn || undefined,
          metaKeywords: metaKeywords || undefined,
          metaKeywordsEn: metaKeywordsEn || undefined,
          featuredImage: featuredImageUrl,
          featureImageId,
          featuredImageEn: featuredImageEnUrl,
          featureImageEnId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update news article");
      }

      toast.success("News article updated successfully!");
      router.push(ROUTES.ADMIN_NEWS);
      router.refresh();
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update news article"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 bg-white rounded-md">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-white rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit News Article</h1>
        <Button
          className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
          variant="outline"
          onClick={() => router.push(ROUTES.ADMIN_NEWS)}
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
              <Label htmlFor="title">News Title (Vietnamese)</Label>
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter news title in Vietnamese"
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
                aspectRatio={1 / 1}
                aspectRatioText="1:1"
              />
              <p className="text-xs text-gray-500">
                Recommended aspect ratio: 1:1
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="space-y-2">
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!showNewCategoryInput ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewCategoryInput(true)}
                    className="w-full"
                  >
                    + Add New Category
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateCategory}
                      disabled={isCreatingCategory}
                    >
                      {isCreatingCategory ? "Creating..." : "Create"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowNewCategoryInput(false);
                        setNewCategoryName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Excerpt (Vietnamese)</Label>
              <Input
                id="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary of the news article in Vietnamese"
                className="w-full"
              />
            </div>
          </div>



          <div className="space-y-2 mt-4">
            <Label>News Content (Vietnamese)</Label>
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
              <Label htmlFor="titleEn">News Title (English)</Label>
              <Input
                id="titleEn"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Enter news title in English"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImageEn">Feature Image (English)</Label>
              <ImageUpload
                value={featuredImageEnUrl}
                onChange={setFeaturedImageEnUrl}
                onImageUploading={setIsImageEnUploading}
                onMediaIdChange={setFeatureImageEnId}
                aspectRatio={1 / 1}
                aspectRatioText="1:1"
              />
              <p className="text-xs text-gray-500">
                Optional: Different image for English version
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="shortDescriptionEn">Excerpt (English)</Label>
            <Input
              id="shortDescriptionEn"
              value={shortDescriptionEn}
              onChange={(e) => setShortDescriptionEn(e.target.value)}
              placeholder="Brief summary of the news article in English"
              className="w-full"
            />
          </div>



          <div className="space-y-2 mt-4">
            <Label>News Content (English)</Label>
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
            Article Settings
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
                placeholder="news-article-url-slug"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                This will be used in the URL: /news/{slug}
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
                Display this news article on the homepage (max 4 items)
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Pin Article</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pin"
                  checked={pin}
                  onChange={(e) => setPin(e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <Label htmlFor="pin" className="text-sm">
                  Pin to Top
                </Label>
              </div>
              <p className="text-xs text-gray-500">
                Pin this article to show at the top of the news list
              </p>
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
            type="button"
            variant="outline"
            onClick={() => router.push(ROUTES.ADMIN_NEWS)}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
            type="submit"
            disabled={isSubmitting || isImageUploading || isImageEnUploading}
          >
            {isSubmitting ? "Updating..." : "Update News Article"}
          </Button>
        </div>
      </form>
    </div>
  );
}
