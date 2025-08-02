"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { equipmentSchema } from "@/utils";

interface EquipmentFormProps {
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
  submitButtonText: string;
  initialData?: {
    id?: string;
    name: string;
    nameEn?: string;
    description: string;
    descriptionEn?: string;
    status: string;
    showOnHomepage: boolean;
    order: number;
    image?: {
      id: string;
      url: string;
    };
    imageEn?: {
      id: string;
      url: string;
    };
  };
}


type EquipmentFormValues = z.infer<typeof equipmentSchema>;

export default function EquipmentForm({
  onSubmit,
  isSubmitting,
  submitButtonText,
  initialData,
}: EquipmentFormProps) {
  const [uploadError, setUploadError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: initialData?.name || "",
      nameEn: initialData?.nameEn || "",
      description: initialData?.description || "",
      descriptionEn: initialData?.descriptionEn || "",
      status: (initialData?.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
      showOnHomepage: initialData?.showOnHomepage ?? true,
      order: initialData?.order || 0,
      imageId: initialData?.image?.id || "",
      imageEnId: initialData?.imageEn?.id || "",
      imageUrl: initialData?.image?.url || "",
      imageEnUrl: initialData?.imageEn?.url || "",
    },
  });

  console.log(errors);
  // Watch image URLs for display
  const [imageUrl, setImageUrl] = useState(initialData?.image?.url || "");
  const [imageEnUrl, setImageEnUrl] = useState(initialData?.imageEn?.url || "");
  const [isEnImageRemoved, setIsEnImageRemoved] = useState(false);

  // Update imageId when image changes
  const handleImageChange = (url: string) => {
    setImageUrl(url);
    setValue("imageUrl", url);
  };
  const handleImageIdChange = (id: string) => {
    setValue("imageId", id);
    setValue("imageUrl", id);
  };
  const handleImageEnChange = (url: string) => {
    setImageEnUrl(url);
    setValue("imageEnUrl", url);
    // Track if image was removed (empty string means removed)
    if (url === "") {
      setIsEnImageRemoved(true);
    } else {
      setIsEnImageRemoved(false);
    }
  };
  const handleImageEnIdChange = (id: string) => {
    setValue("imageEnId", id);
    setValue("imageEnUrl", id);
    // Track if image was removed (empty string means removed)
    if (id === "") {
      setIsEnImageRemoved(true);
    } else {
      setIsEnImageRemoved(false);
    }
  };

  const onFormSubmit: (data: EquipmentFormValues) => void = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("nameEn", data.nameEn || "");
    formData.append("description", data.description);
    formData.append("descriptionEn", data.descriptionEn || "");
    formData.append("status", data.status);
    formData.append("showOnHomepage", (data.showOnHomepage ?? true).toString());
    formData.append("order", data.order.toString());
    formData.append("imageId", data.imageId || "");
    // Always send imageEnId - empty string means remove, undefined/null means keep existing
    const imageEnIdValue = isEnImageRemoved ? "" : (data.imageEnId || "");
    formData.append("imageEnId", imageEnIdValue);
    onSubmit(formData);
  };

  return (
    <div>
      {uploadError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {uploadError}
        </div>
      )}
      <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vietnamese Content */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">
              Vietnamese Content
            </h2>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Name (Vietnamese) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700"
              >
                Description (Vietnamese) <span className="text-red-500">*</span>
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    {...field}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>
            <div className="space-y-2 ">
              <label className="block text-sm font-medium text-slate-700">
                Image (Vietnamese)
                <span className="text-red-500">*</span>
              </label>
              <div className="w-80 h-88">
                <Controller
                  name="imageId"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={imageUrl}
                      onChange={handleImageChange}
                      onMediaIdChange={(id) => {
                        handleImageIdChange(id);
                        field.onChange(id);
                      }}
                      aspectRatio={10 / 11}
                      aspectRatioText="10:11"
                    />
                  )}
                />
                {errors.imageUrl && (
                <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>
              )}
              </div>
            </div>
          </div>
          {/* English Content */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b pb-2">
              English Content
            </h2>
            <div className="space-y-2">
              <label
                htmlFor="nameEn"
                className="block text-sm font-medium text-slate-700"
              >
                Name (English)
              </label>
              <input
                type="text"
                id="nameEn"
                {...register("nameEn")}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.nameEn && (
                <p className="text-red-500 text-xs mt-1">{errors.nameEn.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="descriptionEn"
                className="block text-sm font-medium text-slate-700"
              >
                Description (English)
              </label>
              <Controller
                name="descriptionEn"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="descriptionEn"
                    {...field}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />
              {errors.descriptionEn && (
                <p className="text-red-500 text-xs mt-1">{errors.descriptionEn.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Image (English)
              </label>
              <div className="w-80 h-88">
                <Controller
                  name="imageEnId"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={imageEnUrl}
                      onChange={handleImageEnChange}
                      onMediaIdChange={(id) => {
                        handleImageEnIdChange(id);
                        field.onChange(id);
                      }}
                      aspectRatio={10 / 11}
                      aspectRatioText="10:11"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Common Settings */}
        <div className="border-t pt-6 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-slate-700"
              >
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="order"
                className="block text-sm font-medium text-slate-700"
              >
                Display Order
              </label>
              <input
                type="number"
                id="order"
                {...register("order", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
              {errors.order && (
                <p className="text-red-500 text-xs mt-1">{errors.order.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
            {isSubmitting ? "Saving..." : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
