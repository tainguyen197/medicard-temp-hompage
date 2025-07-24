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
import { ROUTES } from "@/lib/router";
import { TextEditor } from "taitrung-super-editor";
import { cleanContentForSubmission } from "@/lib/content-utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceFormSchema } from "@/utils/services";

export default function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageEnUploading, setIsImageEnUploading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting: formIsSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      titleEn: "",
      status: "DRAFT",
      showOnHomepage: false,
      slug: "",
      description: "",
      descriptionEn: "",
      shortDescription: "",
      shortDescriptionEn: "",
      keywords: "",
      enKeywords: "",
      metaTitle: "",
      metaTitleEn: "",
      metaDescription: "",
      metaDescriptionEn: "",
      metaKeywords: "",
      metaKeywordsEn: "",
      featuredImage: "",
      featureImageId: "",
      featuredImageEn: "",
      featureImageEnId: "",
    },
  });

  // Fetch service data
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch service");
        }

        const service = await response.json();

        // Set form fields with service data including translations
        reset({
          title: service.title || "",
          titleEn: service.titleEn || "",
          status: service.status || "DRAFT",
          showOnHomepage: service.showOnHomepage || false,
          slug: service.slug || "",
          description: service.description || "",
          descriptionEn: service.descriptionEn || "",
          shortDescription: service.shortDescription || "",
          shortDescriptionEn: service.shortDescriptionEn || "",
          keywords: service.keywords || "",
          enKeywords: service.enKeywords || "",
          metaTitle: service.metaTitle || "",
          metaTitleEn: service.metaTitleEn || "",
          metaDescription: service.metaDescription || "",
          metaDescriptionEn: service.metaDescriptionEn || "",
          metaKeywords: service.metaKeywords || "",
          metaKeywordsEn: service.metaKeywordsEn || "",
          featuredImage: service.featureImage?.url || "",
          featureImageId: service.featureImageId || "",
          featuredImageEn: service.featureImageEn?.url || "",
          featureImageEnId: service.featureImageEnId || "",
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service");
        router.push(ROUTES.ADMIN_SERVICES);
      }
    };

    fetchService();
  }, [id, router, reset]);

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
    setValue("title", newTitle);

    // Only auto-generate slug if it hasn't been manually edited
    if (!isSlugManuallyEdited) {
      setValue("slug", generateSlug(newTitle));
    }
  };

  // Handle slug change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("slug", e.target.value);
    setIsSlugManuallyEdited(true);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          description: cleanContentForSubmission(data.description),
          descriptionEn: cleanContentForSubmission(data.descriptionEn),
        }),
      });

      if (!response.ok) {
        setIsSubmitting(false);
        const error = await response.json();
        const isArray = Array.isArray(error.error);
        if (isArray) {
          console.log(error.error[0].message);
          throw new Error(error.error[0].message || "Failed to update service");
        } else {
          throw new Error(error.error || "Failed to update service");
        }
      }

      toast.success("Service updated successfully!");
      router.push(ROUTES.ADMIN_SERVICES);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error updating service:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update service"
      );
    } finally {
      // setIsSubmitting(false);
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                {...register("title")}
                onChange={handleTitleChange}
                placeholder="Enter service title in Vietnamese"
                className="w-full"
                disabled={isSubmitting}
              />
              {errors.title && (
                <span className="text-red-500">{errors.title.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Feature Image</Label>
              <Controller
                name="featuredImage"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onImageUploading={setIsImageUploading}
                    onMediaIdChange={(id) => setValue("featureImageId", id)}
                    aspectRatio={270 / 200}
                    aspectRatioText="270:200"
                  />
                )}
              />
              {errors.featuredImage && (
                <span className="text-red-500">
                  {errors.featuredImage.message}
                </span>
              )}
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
              {...register("shortDescription")}
              onChange={(e) => setValue("shortDescription", e.target.value)}
              placeholder="Brief summary of the service in Vietnamese"
              className="w-full"
              disabled={isSubmitting}
            />
            {errors.shortDescription && (
              <span className="text-red-500">
                {errors.shortDescription.message}
              </span>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="keywords">Keywords (Vietnamese)</Label>
            <Input
              id="keywords"
              {...register("keywords")}
              onChange={(e) => setValue("keywords", e.target.value)}
              placeholder="Thăm khám, tư vấn, chẩn đoán và điều trị các bệnh lý cơ xương khớp, Sử dụng các máy móc vật lý trị liệu, Kỹ thuật viên có tay nghề chuyên môn cao"
              className="w-full"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Separate keywords with commas for better SEO
            </p>
            {errors.keywords && (
              <span className="text-red-500">{errors.keywords.message}</span>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <Label>Service Description (Vietnamese)</Label>
            {typeof window !== "undefined" && (
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextEditor value={field.value} onChange={field.onChange} />
                )}
              />
            )}
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
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
                  onChange={(e) => setValue("metaTitle", e.target.value)}
                  placeholder="SEO title for search engines"
                  maxLength={65}
                  className="w-full"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  {watch("metaTitle")?.length}/65 characters
                </p>
                {errors.metaTitle && (
                  <span className="text-red-500">
                    {errors.metaTitle.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  {...register("metaKeywords")}
                  onChange={(e) => setValue("metaKeywords", e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  Separate keywords with commas
                </p>
                {errors.metaKeywords && (
                  <span className="text-red-500">
                    {errors.metaKeywords.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="metaDescription">
                Meta Description (up to 155 characters)
              </Label>
              <textarea
                id="metaDescription"
                {...register("metaDescription")}
                onChange={(e) => setValue("metaDescription", e.target.value)}
                placeholder="Brief description for search engine results"
                maxLength={155}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                {watch("metaDescription")?.length}/155 characters
              </p>
              {errors.metaDescription && (
                <span className="text-red-500">
                  {errors.metaDescription.message}
                </span>
              )}
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
                {...register("titleEn")}
                onChange={(e) => setValue("titleEn", e.target.value)}
                placeholder="Enter service title in English"
                className="w-full"
                disabled={isSubmitting}
              />
            
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImageEn">Feature Image (English)</Label>
              <Controller
                name="featuredImageEn"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onImageUploading={setIsImageEnUploading}
                    onMediaIdChange={(id) => setValue("featureImageEnId", id)}
                    aspectRatio={270 / 200}
                    aspectRatioText="270:200"
                  />
                )}
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
              {...register("shortDescriptionEn")}
              onChange={(e) => setValue("shortDescriptionEn", e.target.value)}
              placeholder="Brief summary of the service in English"
              className="w-full"
              disabled={isSubmitting}
            />
            {errors.shortDescriptionEn && (
              <span className="text-red-500">
                {errors.shortDescriptionEn.message}
              </span>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="enKeywords">Keywords (English)</Label>
            <Input
              id="enKeywords"
              {...register("enKeywords")}
              onChange={(e) => setValue("enKeywords", e.target.value)}
              placeholder="Medical examination, consultation, diagnosis, treatment, physical therapy equipment, professional expertise"
              className="w-full"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Separate keywords with commas for better SEO
            </p>
            {errors.enKeywords && (
              <span className="text-red-500">{errors.enKeywords.message}</span>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <Label>Service Description (English)</Label>
            <Controller
              name="descriptionEn"
              control={control}
              render={({ field }) => (
                <TextEditor value={field.value} onChange={field.onChange} />
              )}
            />
           
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
                  onChange={(e) => setValue("metaTitleEn", e.target.value)}
                  placeholder="SEO title for search engines (English)"
                  maxLength={65}
                  className="w-full"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  {watch("metaTitleEn")?.length}/65 characters
                </p>
                {errors.metaTitleEn && (
                  <span className="text-red-500">
                    {errors.metaTitleEn.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywordsEn">Meta Keywords</Label>
                <Input
                  id="metaKeywordsEn"
                  {...register("metaKeywordsEn")}
                  onChange={(e) => setValue("metaKeywordsEn", e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  Separate keywords with commas
                </p>
                {errors.metaKeywordsEn && (
                  <span className="text-red-500">
                    {errors.metaKeywordsEn.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="metaDescriptionEn">
                Meta Description (up to 155 characters)
              </Label>
              <textarea
                id="metaDescriptionEn"
                {...register("metaDescriptionEn")}
                onChange={(e) => setValue("metaDescriptionEn", e.target.value)}
                placeholder="Brief description for search engine results (English)"
                maxLength={155}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                {watch("metaDescriptionEn")?.length}/155 characters
              </p>
              {errors.metaDescriptionEn && (
                <span className="text-red-500">
                  {errors.metaDescriptionEn.message}
                </span>
              )}
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
                value={watch("status")}
                onValueChange={(value: string) => setValue("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <span className="text-red-500">{errors.status.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                {...register("slug")}
                onChange={handleSlugChange}
                placeholder="service-url-slug"
                className="w-full"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                This will be used in the URL: /services/{watch("slug")}
              </p>
              {errors.slug && (
                <span className="text-red-500">{errors.slug.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Homepage Display</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showOnHomepage"
                  {...register("showOnHomepage")}
                  onChange={(e) => setValue("showOnHomepage", e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
            type="submit"
            disabled={isSubmitting || isImageUploading || isImageEnUploading}
          >
            {isSubmitting ? "Updating..." : "Update Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}
