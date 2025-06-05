import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Upload, X, Crop as CropIcon } from "lucide-react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onImageUploading?: (isUploading: boolean) => void;
  onMediaIdChange?: (mediaId: string) => void;
  aspectRatio?: number;
  aspectRatioText?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onImageUploading,
  onMediaIdChange,
  aspectRatio = 270 / 200,
  aspectRatioText = "270:200",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [imageBlob, setImageBlob] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setImageBlob(file);
    setShowCropper(true);

    return () => URL.revokeObjectURL(objectUrl);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
  });

  const onImageLoaded = useCallback((img: HTMLImageElement) => {
    setImageRef(img);
  }, []);

  const getCroppedImage = useCallback(async () => {
    if (!imageRef || !crop.width || !crop.height || !imageBlob) return;

    // Create canvas for cropping
    const canvas = document.createElement("canvas");
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;

    // Set canvas dimensions to cropped size
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw cropped image on canvas
    ctx.drawImage(
      imageRef,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    // Convert canvas to blob
    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, imageBlob.type);
    });
  }, [imageRef, crop, imageBlob]);

  const uploadImage = useCallback(async () => {
    try {
      setIsUploading(true);
      onImageUploading?.(true);

      // Get the cropped image as a blob
      const croppedBlob = await getCroppedImage();
      if (!croppedBlob) {
        toast.error("Failed to crop image");
        return;
      }

      // Create a File object from the Blob
      const fileName = imageBlob?.name || "cropped-image.jpg";
      const croppedFile = new File([croppedBlob], fileName, {
        type: croppedBlob.type,
      });

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("upload", croppedFile);

      // Send the request
      const response = await fetch("/api/upload_image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await response.json();
      onChange(data.url);
      onMediaIdChange?.(data.mediaId);
      setShowCropper(false);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
      onImageUploading?.(false);
    }
  }, [imageBlob, getCroppedImage, onChange, onImageUploading, onMediaIdChange]);

  const handleCancelCrop = () => {
    setShowCropper(false);
    setPreview(null);
    setImageBlob(null);
  };

  const handleRemoveImage = () => {
    onChange("");
    onMediaIdChange?.("");
    setPreview(null);
    setShowCropper(false);
  };

  return (
    <div className="relative w-full">
      {showCropper && preview ? (
        <div className="bg-gray-50 p-4 rounded-md space-y-4">
          <div className="text-sm font-medium mb-2">
            Crop Image ({aspectRatioText} ratio)
          </div>
          <div className="max-w-full overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={(c: Crop) => setCrop(c)}
              aspect={aspectRatio}
            >
              <img
                src={preview}
                alt="Preview"
                onLoad={(e) => onImageLoaded(e.currentTarget)}
                className="max-w-full max-h-[300px] object-contain"
              />
            </ReactCrop>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            Recommended aspect ratio: {aspectRatioText}
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelCrop}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={uploadImage}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      ) : value ? (
        <div className="relative w-full">
          <div
            className="relative overflow-hidden rounded-md border border-border"
            style={{ aspectRatio: aspectRatioText.replace(":", "/") }}
          >
            <Image
              src={value}
              alt="Featured image"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-gray-300 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
            <CropIcon className="h-6 w-6 mb-1" />
            <p className="font-medium">Drag & drop or click to upload</p>
            <p>{aspectRatioText} aspect ratio recommended</p>
          </div>
        </div>
      )}
    </div>
  );
}
