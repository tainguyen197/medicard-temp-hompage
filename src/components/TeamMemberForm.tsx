"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ImageIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/router";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  teamMemberSchema,
  MAX_DESCRIPTION_LENGTH,
  MAX_FILE_SIZE,
} from "@/utils";
interface TeamMemberFormData {
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  order: number;
  status: "ACTIVE" | "INACTIVE";
  imageFile?: File;
  imageEnFile?: File;
  existingImageUrl?: string;
  existingImageEnUrl?: string;
}

interface TeamMemberFormProps {
  initialData?: Partial<TeamMemberFormData>;
  teamMemberId?: string;
  isEdit?: boolean;
}

export default function TeamMemberForm({
  initialData,
  teamMemberId,
  isEdit = false,
}: TeamMemberFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageEnPreview, setImageEnPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: initialData?.name || "",
      nameEn: initialData?.nameEn || "",
      title: initialData?.title || "",
      titleEn: initialData?.titleEn || "",
      description: initialData?.description || "",
      descriptionEn: initialData?.descriptionEn || "",
      order: initialData?.order || 0,
      status: initialData?.status || "ACTIVE",
      existingImageUrl: initialData?.existingImageUrl || "",
      existingImageEnUrl: initialData?.existingImageEnUrl || "",
    },
  });

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return "File must be a valid image (JPEG, PNG, WebP)";
    }

    return null;
  };

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (
    field: "imageFile" | "imageEnFile",
    file: File | null
  ) => {
    setUploadError("");
    if (!file) {
      setValue(field, undefined);

      if (field === "imageFile") {
        setImagePreview(null);
        setValue("existingImageUrl", "");
      } else {
        setImageEnPreview(null);
        setValue("existingImageEnUrl", "");
      }
      return;
    }
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }
    try {
      const preview = await createImagePreview(file);
      setValue(field, file);

      if (field === "imageFile") {
        setImagePreview(preview);
        setValue("existingImageUrl", preview);
      } else {
        setImageEnPreview(preview);
        setValue("existingImageEnUrl", preview);
      }
    } catch (error) {
      setUploadError("Failed to process image");
    }
  };

  const removeImage = (field: "imageFile" | "imageEnFile") => {
    setValue(field, undefined);
    if (field === "imageFile") {
      setValue("existingImageUrl", "");
      setImagePreview(null);
    } else {
      setValue("existingImageEnUrl", "");
      setImageEnPreview(null);
    }
  };

  const onSubmit = async (data: TeamMemberFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "imageFile" && key !== "imageEnFile") {
          submitData.append(key, value?.toString() ?? "");
        }
      });
      if (data.imageFile && data.imageFile.size > 0) {
        submitData.append("imageFile", data.imageFile);
      }
      if (data.imageEnFile && data.imageEnFile.size > 0) {
        submitData.append("imageEnFile", data.imageEnFile);
      }
      if (data.existingImageUrl === "" && !data.imageFile) {
        submitData.append("removeImage", "true");
      }
      if (data.existingImageEnUrl === "" && !data.imageEnFile) {
        submitData.append("removeImageEn", "true");
      }
      const url = isEdit ? `/api/team/${teamMemberId}` : "/api/team";
      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, { method, body: submitData });
      const respData = await response.json();
      if (!response.ok) {
        setIsSubmitting(false);
        setUploadError(respData.error || "Failed to save team member");
        toast.error(respData.error || "Failed to save team member");
        throw new Error(respData.error || "Failed to save team member");
      }
      toast.success("Team member saved successfully!");
      router.push(ROUTES.ADMIN_TEAM);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error saving team member:", error);
    } finally {
    }
  };

  const FileUploadSection = ({
    field,
    label,
    preview,
    inputId,
    existingImageUrl,
  }: {
    field: "imageFile" | "imageEnFile";
    label: string;
    preview: string | null;
    inputId: string;
    existingImageUrl?: string;
  }) => {
    const currentImage = preview || existingImageUrl;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>

        {currentImage ? (
          <div className="relative">
            <img
              src={currentImage}
              alt="Preview"
              className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={() => removeImage(field)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <XIcon size={16} />
            </button>
            {watch(field) && (
              <div className="mt-2 text-sm text-gray-600">
                {watch(field)?.name} (
                {((watch(field)?.size || 0) / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
            {!watch(field) && existingImageUrl && (
              <div className="mt-2 text-sm text-gray-600">Current image</div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            {/* 3:4 Aspect Ratio Guide */}
            <div className="mx-auto w-16 aspect-[3/4] bg-gray-100 rounded border-2 border-gray-300 mb-3 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>

            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(field, e.target.files?.[0] || null)
                }
                className="hidden"
                id={inputId}
              />
              <label
                htmlFor={inputId}
                className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
              >
                Upload photo
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, WebP up to 10MB
            </p>
            <p className="text-xs text-gray-600 mt-1 font-medium">
              Recommended: 3:4 aspect ratio (portrait)
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Team Member" : "Create New Team Member"}
        </h1>
        <Link
          href={ROUTES.ADMIN_TEAM}
          className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 cursor-pointer px-4 py-2 rounded-md flex items-center gap-2"
        >
          <ArrowLeftIcon size={16} />
          Cancel
        </Link>
      </div>

      {uploadError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {uploadError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Vietnamese Content Section */}
        <fieldset className="p-4 border border-gray-200 rounded-lg">
          <legend className="text-lg font-semibold mb-4 px-2">
            Vietnamese Content (Default)
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name (Vietnamese) *
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name in Vietnamese"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Professional Title (Vietnamese) *
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., BS. CK, THS. BS"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <FileUploadSection
                field="imageFile"
                label="Profile Photo (Vietnamese)"
                preview={imagePreview}
                inputId="image-upload"
                existingImageUrl={watch("existingImageUrl")}
              />
              {errors.existingImageUrl && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.existingImageUrl.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Professional Description (Vietnamese) *
              <span className="text-xs text-gray-500 ml-2">
                {watch("description").length}/{MAX_DESCRIPTION_LENGTH}{" "}
                characters
              </span>
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter professional background and experience in Vietnamese"
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </fieldset>

        {/* English Content Section */}
        <fieldset className="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <legend className="text-lg font-semibold mb-4 px-2 text-blue-800">
            English Content (Optional)
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name (English)
                </label>
                <input
                  type="text"
                  {...register("nameEn")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name in English"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Professional Title (English)
                </label>
                <input
                  type="text"
                  {...register("titleEn")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MD. Specialist, MSc. MD"
                />
              </div>
            </div>

            <FileUploadSection
              field="imageEnFile"
              label="Profile Photo (English)"
              preview={imageEnPreview}
              inputId="image-en-upload"
              existingImageUrl={watch("existingImageEnUrl")}
            />
          </div>

          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Professional Description (English)
              <span className="text-xs text-gray-500 ml-2">
                {watch("descriptionEn").length}/{MAX_DESCRIPTION_LENGTH}{" "}
                characters
              </span>
            </label>
            <textarea
              {...register("descriptionEn")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter professional background and experience in English"
            />
          </div>
        </fieldset>

        {/* Settings Section */}
        <fieldset className="p-4 border border-gray-200 rounded-lg">
          <legend className="text-lg font-semibold mb-4 px-2">
            Team Member Settings
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                {...register("order", { valueAsNumber: true })}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
              {errors.order && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.order.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Lower numbers appear first in the team section
              </p>
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end space-x-4 pt-4">
          <Link
            href={ROUTES.ADMIN_TEAM}
            className="bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200 cursor-pointer px-4 py-2 rounded-md"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Saving..."
              : isEdit
              ? "Update Team Member"
              : "Create Team Member"}
          </button>
        </div>
      </form>
    </div>
  );
}
