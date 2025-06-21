"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/router";

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
}

interface TeamMemberFormProps {
  initialData?: Partial<TeamMemberFormData>;
  teamMemberId?: string;
  isEdit?: boolean;
}

const MAX_DESCRIPTION_LENGTH = 300; // Based on longest current description

export default function TeamMemberForm({
  initialData,
  teamMemberId,
  isEdit = false,
}: TeamMemberFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: initialData?.name || "",
    nameEn: initialData?.nameEn || "",
    title: initialData?.title || "",
    titleEn: initialData?.titleEn || "",
    description: initialData?.description || "",
    descriptionEn: initialData?.descriptionEn || "",
    order: initialData?.order || 0,
    status: initialData?.status || "ACTIVE",
  });

  const handleInputChange = (
    field: keyof TeamMemberFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDescriptionChange = (
    field: "description" | "descriptionEn",
    value: string
  ) => {
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      handleInputChange(field, value);
    }
  };

  const handleFileChange = (
    field: "imageFile" | "imageEnFile",
    file: File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file || undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "imageFile" && key !== "imageEnFile") {
          submitData.append(key, value.toString());
        }
      });

      // Add files if present
      if (formData.imageFile) {
        submitData.append("imageFile", formData.imageFile);
      }
      if (formData.imageEnFile) {
        submitData.append("imageEnFile", formData.imageEnFile);
      }

      const url = isEdit ? `/api/team/${teamMemberId}` : "/api/team";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (!response.ok) {
        throw new Error("Failed to save team member");
      }

      router.push(ROUTES.ADMIN_TEAM);
    } catch (error) {
      console.error("Error saving team member:", error);
      alert("Failed to save team member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

      <form onSubmit={handleSubmit} className="space-y-6">
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
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name in Vietnamese"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Professional Title (Vietnamese) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., BS. CK, THS. BS"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo (Vietnamese)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("imageFile", e.target.files?.[0] || null)
                    }
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-700"
                  >
                    Upload photo
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Professional Description (Vietnamese) *
              <span className="text-xs text-gray-500 ml-2">
                {formData.description.length}/{MAX_DESCRIPTION_LENGTH}{" "}
                characters
              </span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                handleDescriptionChange("description", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter professional background and experience in Vietnamese"
            />
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
                  value={formData.nameEn}
                  onChange={(e) => handleInputChange("nameEn", e.target.value)}
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
                  value={formData.titleEn}
                  onChange={(e) => handleInputChange("titleEn", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MD. Specialist, MSc. MD"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo (English)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        "imageEnFile",
                        e.target.files?.[0] || null
                      )
                    }
                    className="hidden"
                    id="image-en-upload"
                  />
                  <label
                    htmlFor="image-en-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-700"
                  >
                    Upload photo
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Different photo for English version
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Professional Description (English)
              <span className="text-xs text-gray-500 ml-2">
                {formData.descriptionEn.length}/{MAX_DESCRIPTION_LENGTH}{" "}
                characters
              </span>
            </label>
            <textarea
              rows={4}
              value={formData.descriptionEn}
              onChange={(e) =>
                handleDescriptionChange("descriptionEn", e.target.value)
              }
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
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) =>
                  handleInputChange("order", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
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
