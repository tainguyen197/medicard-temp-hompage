"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

// Define the form schema with Zod
const serviceFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleEn: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  showOnHomepage: z.boolean(),
  description: z.string().min(1, "Description is required"),
  descriptionEn: z.string().optional(),
  shortDescription: z.string().optional(),
  shortDescriptionEn: z.string().optional(),
  keywords: z.string().optional(),
  enKeywords: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  featuredImage: z.string().optional().nullable(),
  featureImageId: z.string().optional().nullable(),
  featuredImageEn: z.string().optional().nullable(),
  featureImageEnId: z.string().optional().nullable(),
  metaTitle: z.string().optional(),
  metaTitleEn: z.string().optional(),
  metaDescription: z.string().optional(),
  metaDescriptionEn: z.string().optional(),
  metaKeywords: z.string().optional(),
  metaKeywordsEn: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageEnUploading, setIsImageEnUploading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Initialize form with React Hook Form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      titleEn: "",
      status: "DRAFT",
      showOnHomepage: false,
      description: "",
      descriptionEn: "",
      shortDescription: "",
      shortDescriptionEn: "",
      keywords: "",
      enKeywords: "",
      slug: "",
      featuredImage: "",
      featureImageId: "",
      featuredImageEn: "",
      featureImageEnId: "",
      metaTitle: "",
      metaTitleEn: "",
      metaDescription: "",
      metaDescriptionEn: "",
      metaKeywords: "",
      metaKeywordsEn: "",
    },
  });

  // Watch title for slug generation
  const title = watch("title");

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
  const handleTitleChange = (value: string) => {
    setValue("title", value);

    // Only auto-generate slug if it hasn't been manually edited
    if (!isSlugManuallyEdited) {
      setValue("slug", generateSlug(value));
    }
  };

  // Handle slug change
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("slug", e.target.value);
    setIsSlugManuallyEdited(true);
  };

  // Handle form submission
  const onSubmit = async (data: ServiceFormValues) => {
    if (data.description === "<p><br></p>") {
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
          ...data,
          titleEn: data.titleEn || undefined,
          description: cleanContentForSubmission(data.description),
          descriptionEn: cleanContentForSubmission(data.descriptionEn),
          shortDescriptionEn: data.shortDescriptionEn || undefined,
          enKeywords: data.enKeywords || undefined,
          metaTitle: data.metaTitle || undefined,
          metaTitleEn: data.metaTitleEn || undefined,
          metaDescription: data.metaDescription || undefined,
          metaDescriptionEn: data.metaDescriptionEn || undefined,
          metaKeywords: data.metaKeywords || undefined,
          metaKeywordsEn: data.metaKeywordsEn || undefined,
        }),
      }) as Response;

      const result = await response.json();

      if (!response.ok) {
        // Check for specific error messages
        if (result.error && result.error.includes("Maximum limit of 30 services")) {
          toast.error(result.error);
        } else if (result.error && result.error.includes("Maximum of 4 services can be shown on homepage")) {
          toast.error(result.error);
        } else {
          toast.error(result.error || "Failed to create service");
        }
        throw new Error(result.error || "Failed to create service");
      }

      toast.success("Service created successfully!");
      router.push(ROUTES.ADMIN_SERVICES);
    } catch (error) {
      console.error("Error creating service:", error);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  // Save draft to local storage
  const saveDraft = useCallback(() => {
    const formData = watch();
    localStorage.setItem("service-draft", JSON.stringify(formData));
    toast.success("Draft saved");
  }, [watch]);

  // Load draft from local storage
  const loadDraft = useCallback(() => {
    const savedDraft = localStorage.getItem("service-draft");
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        Object.entries(draftData).forEach(([key, value]) => {
          setValue(key as any, value as any);
        });
        toast.success("Draft loaded");
      } catch (error) {
        toast.error("Failed to load draft");
      }
    } else {
      toast.error("No draft found");
    }
  }, [setValue]);

  return (
    <div className="container mx-auto p-8 bg-white rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Service</h1>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={saveDraft}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            Save Draft
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={loadDraft}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Load Draft
          </Button>
          <Button
            className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
            variant="outline"
            onClick={() => router.push(ROUTES.ADMIN_SERVICES)}
          >
            Cancel
          </Button>
        </div>
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
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter service title in Vietnamese"
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
                    onMediaIdChange={(id) => setValue("featureImageId", id)}
                    aspectRatio={270 / 200}
                    aspectRatioText="270:200"
                  />
                )}
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
              {...register("shortDescription")}
              placeholder="Brief summary of the service in Vietnamese"
              className="w-full"
            />
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="keywords">Keywords (Vietnamese)</Label>
            <Input
              id="keywords"
              {...register("keywords")}
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
              <Label htmlFor="titleEn">Service Title (English)</Label>
              <Input
                id="titleEn"
                {...register("titleEn")}
                placeholder="Enter service title in English"
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
              placeholder="Brief summary of the service in English"
              className="w-full"
            />
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="enKeywords">Keywords (English)</Label>
            <Input
              id="enKeywords"
              {...register("enKeywords")}
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
            Service Settings
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
                <p className="text-red-500 text-sm">{errors.status.message}</p>
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
              />
              {errors.slug && (
                <p className="text-red-500 text-sm">{errors.slug.message}</p>
              )}
              <p className="text-xs text-gray-500">
                This will be used in the URL: /services/{watch("slug")}
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
