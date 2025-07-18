"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";

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
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useNewsEditForm } from "@/hooks/useNewsEditForm";
import { TextEditor } from "taitrung-super-editor";

export default function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const {
    form,
    isLoading,
    isSubmitting,
    isImageUploading,
    setIsImageUploading,
    isImageEnUploading,
    setIsImageEnUploading,
    handleTitleChange,
    handleSlugChange,
    categoriesVi,
    categoriesEn,
    showNewCategoryInput,
    setShowNewCategoryInput,
    showNewCategoryEnInput,
    setShowNewCategoryEnInput,
    newCategoryName,
    setNewCategoryName,
    newCategoryNameEn,
    setNewCategoryNameEn,
    isCreatingCategory,
    isCreatingCategoryEn,
    handleCreateCategory,
    handleCreateCategoryEn,
    onSubmit,
  } = useNewsEditForm(id);

  const {
    register,
    control,
    formState: { errors },
    watch,
  } = form;

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
    <ErrorBoundary>
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

        <form onSubmit={onSubmit} className="space-y-6">
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
                  {...register("title")}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter news title in Vietnamese"
                  className="w-full"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">Feature Image</Label>
                <Controller
                  control={control}
                  name="featuredImage"
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value || ""}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      onImageUploading={setIsImageUploading}
                      onMediaIdChange={(id) =>
                        form.setValue("featureImageId", id)
                      }
                      aspectRatio={1 / 1}
                      aspectRatioText="1:1"
                    />
                  )}
                />
                <p className="text-xs text-gray-500">
                  Recommended aspect ratio: 1:1
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <div className="space-y-2">
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="categoryId">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesVi.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

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
                        placeholder="Enter Vietnamese category name"
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
                  {...register("shortDescription")}
                  placeholder="Brief summary of the news article in Vietnamese"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label>News Content (Vietnamese)</Label>
              <div>
                {typeof window !== "undefined" && (
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <TextEditor
                        value={field.value || ""}
                        onChange={(value: any) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                )}
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
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
                    {...register("metaTitle")}
                    placeholder="SEO title for search engines"
                    maxLength={65}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    {(watch("metaTitle") || "").length}/65 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    {...register("metaKeywords")}
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
                  {...register("metaDescription")}
                  placeholder="Brief description for search engine results"
                  maxLength={155}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  {(watch("metaDescription") || "").length}/155 characters
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
                  {...register("titleEn")}
                  placeholder="Enter news title in English"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImageEn">Feature Image (English)</Label>
                <Controller
                  control={control}
                  name="featuredImageEn"
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value || ""}
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                      onImageUploading={setIsImageEnUploading}
                      onMediaIdChange={(id) =>
                        form.setValue("featureImageEnId", id)
                      }
                      aspectRatio={1 / 1}
                      aspectRatioText="1:1"
                    />
                  )}
                />
                <p className="text-xs text-gray-500">
                  Optional: Different image for English version
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="categoryEnId">Category (English)</Label>
                <div className="space-y-2">
                  <Controller
                    control={control}
                    name="categoryEnId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="categoryEnId">
                          <SelectValue placeholder="Select a category for English" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesEn.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {!showNewCategoryEnInput ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewCategoryEnInput(true)}
                      className="w-full"
                    >
                      + Add New English Category
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={newCategoryNameEn}
                        onChange={(e) => setNewCategoryNameEn(e.target.value)}
                        placeholder="Enter English category name"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleCreateCategoryEn}
                        disabled={isCreatingCategoryEn}
                      >
                        {isCreatingCategoryEn ? "Creating..." : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowNewCategoryEnInput(false);
                          setNewCategoryNameEn("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescriptionEn">Excerpt (English)</Label>
                <Input
                  id="shortDescriptionEn"
                  {...register("shortDescriptionEn")}
                  placeholder="Brief summary of the news article in English"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label>News Content (English)</Label>
              <div>
                {typeof window !== "undefined" && (
                  <Controller
                    control={control}
                    name="descriptionEn"
                    render={({ field }) => (
                      <TextEditor
                        value={field.value || ""}
                        onChange={(value: any) => {
                          field.onChange(value);
                        }}
                      />
                    )}
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
                    {...register("metaTitleEn")}
                    placeholder="SEO title for search engines (English)"
                    maxLength={65}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    {(watch("metaTitleEn") || "").length}/65 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaKeywordsEn">Meta Keywords</Label>
                  <Input
                    id="metaKeywordsEn"
                    {...register("metaKeywordsEn")}
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
                  {...register("metaDescriptionEn")}
                  placeholder="Brief description for search engine results (English)"
                  maxLength={155}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  {(watch("metaDescriptionEn") || "").length}/155 characters
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
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-red-500 text-sm">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  onChange={handleSlugChange}
                  placeholder="news-article-url-slug"
                  className="w-full"
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm">{errors.slug.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  This will be used in the URL: /news/{watch("slug")}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Homepage Display</Label>
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="showOnHomepage"
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id="showOnHomepage"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <Label htmlFor="showOnHomepage" className="text-sm">
                    Show on Homepage
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  Display this news article on the homepage (max 3 items)
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Pin Article</Label>
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="pin"
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id="pin"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <Label htmlFor="pin" className="text-sm">
                    Pin to Top
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  Pin this article to show at the top of the news list (max 5
                  items)
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
    </ErrorBoundary>
  );
}
