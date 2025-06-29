"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface BannerFormProps {
  initialData?: {
    id?: string;
    type: string;
    link?: string;
    status: string;
    image?: {
      id: string;
      url: string;
      filename: string;
    };
  };
  isEditing?: boolean;
}

export default function BannerForm({
  initialData,
  isEditing = false,
}: BannerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: initialData?.type || "",
    link: initialData?.link || "",
    status: initialData?.status || "ACTIVE",
    imageFile: null as File | null,
    existingImageUrl: initialData?.image?.url || "",
  });

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, imageFile: null }));
      setImagePreview(null);
      return;
    }

    const maxFileSize = 10 * 1024 * 1024;
    if (file.size > maxFileSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("File must be a valid image (JPEG, PNG, WebP, GIF)");
      return;
    }

    try {
      const preview = await createImagePreview(file);
      setFormData((prev) => ({ ...prev, imageFile: file }));
      setImagePreview(preview);
    } catch (error) {
      toast.error("Failed to process image");
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      existingImageUrl: "",
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      submitData.append("type", formData.type);
      submitData.append("link", formData.link);
      submitData.append("status", formData.status);

      if (formData.imageFile) {
        submitData.append("imageFile", formData.imageFile);
      }

      const url = isEditing
        ? `/api/banners/${initialData?.id}`
        : "/api/banners";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save banner");
      }

      toast.success(`Banner ${isEditing ? "updated" : "created"} successfully`);

      router.push("/admin/banners");
      router.refresh();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save banner"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBannerTypeLabel = (type: string) => {
    switch (type) {
      case "HOMEPAGE":
        return "Homepage";
      case "SERVICE":
        return "Service";
      case "NEWS":
        return "News";
      case "ABOUT":
        return "About";
      default:
        return type;
    }
  };

  const getBannerTypeColor = (type: string) => {
    switch (type) {
      case "HOMEPAGE":
        return "text-green-600 bg-green-50";
      case "SERVICE":
        return "text-blue-600 bg-blue-50";
      case "NEWS":
        return "text-purple-600 bg-purple-50";
      case "ABOUT":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const currentImage = imagePreview || formData.existingImageUrl;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Banner Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Banner Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select banner type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOMEPAGE">Homepage</SelectItem>
                    <SelectItem value="SERVICE">Service</SelectItem>
                    <SelectItem value="NEWS">News</SelectItem>
                    <SelectItem value="ABOUT">About</SelectItem>
                  </SelectContent>
                </Select>
                {formData.type && (
                  <p className="text-sm text-gray-500 mt-1">
                    Only one banner per type is allowed. Creating this will
                    replace any existing{" "}
                    <span
                      className={`px-1 rounded ${getBannerTypeColor(
                        formData.type
                      )}`}
                    >
                      {getBannerTypeLabel(formData.type)}
                    </span>{" "}
                    banner.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="link">Link URL</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="https://example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Banner Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Banner Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentImage ? (
                <div className="relative">
                  <Image
                    src={currentImage}
                    alt="Banner image"
                    width={400}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {formData.imageFile && (
                    <div className="mt-2 text-sm text-gray-600">
                      {formData.imageFile.name} (
                      {(formData.imageFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                  {!formData.imageFile && formData.existingImageUrl && (
                    <div className="mt-2 text-sm text-gray-600">
                      Current image
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload banner image
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          handleFileChange(file || null);
                        }}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/banners")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !formData.type}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update" : "Create"} Banner
          </Button>
        </div>
      </form>
    </div>
  );
}
