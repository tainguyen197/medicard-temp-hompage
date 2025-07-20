"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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

export default function EquipmentForm({
  onSubmit,
  isSubmitting,
  submitButtonText,
  initialData,
}: EquipmentFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [nameEn, setNameEn] = useState(initialData?.nameEn || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [descriptionEn, setDescriptionEn] = useState(
    initialData?.descriptionEn || ""
  );
  const [status, setStatus] = useState(initialData?.status || "ACTIVE");
  const [showOnHomepage, setShowOnHomepage] = useState<boolean>(
    initialData?.showOnHomepage ?? true
  );
  const [order, setOrder] = useState(initialData?.order || 0);

  // New: Use image URL and ID for both languages
  const [imageUrl, setImageUrl] = useState(initialData?.image?.url || "");
  const [imageId, setImageId] = useState(initialData?.image?.id || "");
  const [imageEnUrl, setImageEnUrl] = useState(initialData?.imageEn?.url || "");
  const [imageEnId, setImageEnId] = useState(initialData?.imageEn?.id || "");
  const [uploadError, setUploadError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("nameEn", nameEn);
    formData.append("description", description);
    formData.append("descriptionEn", descriptionEn);
    formData.append("status", status);
    formData.append("showOnHomepage", showOnHomepage.toString());
    formData.append("order", order.toString());
    // Always send image IDs (empty string means remove)
    formData.append("imageId", imageId);
    formData.append("imageEnId", imageEnId);
    onSubmit(formData);
  };

  return (
    <div>
      {uploadError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {uploadError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700"
              >
                Description (Vietnamese) <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2 ">
              <label className="block text-sm font-medium text-slate-700">
                Image (Vietnamese)
              </label>
              <div className="w-80 h-88">
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  onMediaIdChange={setImageId}
                  aspectRatio={10 / 11}
                  aspectRatioText="10:11"
                />
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
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                // English name is optional, so no required attribute
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="descriptionEn"
                className="block text-sm font-medium text-slate-700"
              >
                Description (English)
              </label>
              <Textarea
                id="descriptionEn"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                // English description is optional, so no required attribute
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Image (English)
              </label>
              <div className="w-80 h-88">
                <ImageUpload
                  value={imageEnUrl}
                  onChange={setImageEnUrl}
                  onMediaIdChange={setImageEnId}
                  aspectRatio={10 / 11}
                  aspectRatioText="10:11"
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
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
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
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
