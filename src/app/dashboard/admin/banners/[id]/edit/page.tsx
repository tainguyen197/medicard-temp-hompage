"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import BannerForm from "@/components/BannerForm";

interface Banner {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  link?: string;
  linkEn?: string;
  type: "HOMEPAGE" | "SERVICE" | "NEWS";
  order: number;
  status: "ACTIVE" | "INACTIVE";
  image?: {
    id: string;
    url: string;
  };
  imageEn?: {
    id: string;
    url: string;
  };
}

export default function EditBannerPage() {
  const params = useParams();
  const bannerId = params.id as string;

  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch(`/api/banners/${bannerId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch banner");
        }

        const bannerData = await response.json();
        setBanner(bannerData);
      } catch (error) {
        console.error("Error fetching banner:", error);
        toast.error("Failed to load banner");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [bannerId]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading banner...</p>
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Banner not found</h2>
          <p className="mt-2 text-gray-600">
            The banner you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BannerForm
      initialData={{
        link: banner.link || "",
        type: banner.type,
        status: banner.status,
        id: banner.id,
        image: banner.image as any,
      }}
      isEditing={true}
    />
  );
}
