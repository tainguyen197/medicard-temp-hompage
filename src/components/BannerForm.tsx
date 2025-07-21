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
import { Loader2, Upload, X, Info } from "lucide-react";
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
    imageEn?: {
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
  const [imageEnPreview, setImageEnPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: initialData?.type || "",
    link: initialData?.link || "",
    status: initialData?.status || "ACTIVE",
    imageFile: null as File | null,
    imageEnFile: null as File | null,
    existingImageUrl: initialData?.image?.url || "",
    existingImageEnUrl: initialData?.imageEn?.url || "",
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

  const handleEnFileChange = async (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, imageEnFile: null }));
      setImageEnPreview(null);
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
      setFormData((prev) => ({ ...prev, imageEnFile: file }));
      setImageEnPreview(preview);
    } catch (error) {
      toast.error("Failed to process English image");
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

  const handleRemoveEnImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageEnFile: null,
      existingImageEnUrl: "",
    }));
    setImageEnPreview(null);
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

      if (formData.imageEnFile) {
        submitData.append("imageEnFile", formData.imageEnFile);
      }

      // Send explicit removal signals
      if (formData.existingImageUrl === "" && !formData.imageFile) {
        submitData.append("removeImage", "true");
      }
      if (formData.existingImageEnUrl === "" && !formData.imageEnFile) {
        submitData.append("removeImageEn", "true");
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
  const currentEnImage = imageEnPreview || formData.existingImageEnUrl;

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
                    <SelectItem value="CONTACT">Contact</SelectItem>
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

        {/* Image Aspect Ratio Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Banner Image Recommendation
            </h3>
            <p className="text-sm text-blue-600 mt-1">
              For optimal display across all devices, please use images with a{" "}
              <strong>21:9 aspect ratio</strong> (widescreen format). This
              ensures your banners will look professional on all screen sizes.
            </p>
          </div>
        </div>

        {/* Vietnamese Banner Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Vietnamese Banner Image
            </CardTitle>
            <p className="text-sm text-gray-600">
              Main banner image (required). This will be used as fallback for
              both languages if English image is not provided.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentImage ? (
                <div className="relative">
                  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg">
                    <Image
                      src={currentImage}
                      alt="Vietnamese banner image"
                      fill
                      className="object-cover"
                    />
                  </div>
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
                      Current Vietnamese image
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <div className="mx-auto w-full max-w-md aspect-[21/9] bg-gray-100 rounded flex items-center justify-center mb-4">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload Vietnamese banner image
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB (21:9 aspect ratio
                          recommended)
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

        {/* English Banner Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              English Banner Image (Optional)
            </CardTitle>
            <p className="text-sm text-gray-600">
              Optional English version of the banner. If not provided, the
              Vietnamese image will be used for both languages.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentEnImage ? (
                <div className="relative">
                  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg">
                    <Image
                      src={currentEnImage}
                      alt="English banner image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveEnImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {formData.imageEnFile && (
                    <div className="mt-2 text-sm text-gray-600">
                      {formData.imageEnFile.name} (
                      {(formData.imageEnFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                  {!formData.imageEnFile && formData.existingImageEnUrl && (
                    <div className="mt-2 text-sm text-gray-600">
                      Current English image
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                  <div className="text-center">
                    <div className="mx-auto w-full max-w-md aspect-[21/9] bg-gray-100 rounded flex items-center justify-center mb-4">
                      <Upload className="h-12 w-12 text-gray-300" />
                    </div>
                    <div className="mt-4">
                      <Label
                        htmlFor="image-en-upload"
                        className="cursor-pointer"
                      >
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload English banner image
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB (21:9 aspect ratio
                          recommended)
                        </span>
                      </Label>
                      <Input
                        id="image-en-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          handleEnFileChange(file || null);
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
