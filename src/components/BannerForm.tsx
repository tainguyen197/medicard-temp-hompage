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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    type: initialData?.type || "",
    link: initialData?.link || "",
    status: initialData?.status || "ACTIVE",
    imageId: initialData?.image?.id || "",
  });

  const [selectedImage, setSelectedImage] = useState<{
    id: string;
    url: string;
    filename: string;
  } | null>(initialData?.image || null);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/media", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const result = await response.json();
      setSelectedImage(result);
      setFormData((prev) => ({ ...prev, imageId: result.id }));

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFormData((prev) => ({ ...prev, imageId: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEditing
        ? `/api/banners/${initialData?.id}`
        : "/api/banners";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save banner");
      }

      toast({
        title: "Success",
        description: `Banner ${isEditing ? "updated" : "created"} successfully`,
      });

      router.push("/admin/banners");
      router.refresh();
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save banner",
        variant: "destructive",
      });
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
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

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
              {selectedImage ? (
                <div className="relative">
                  <Image
                    src={selectedImage.url}
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
                          if (file) {
                            handleFileUpload(file);
                          }
                        }}
                        disabled={isUploading}
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
