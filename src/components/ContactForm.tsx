"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  phone: string | null;
  address: string | null;
  addressEn: string | null;
  businessHours: string | null;
  businessHoursEn: string | null;
  facebookUrl: string | null;
  zaloUrl: string | null;
  instagramUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactFormProps {
  contact?: Contact | null;
}

export default function ContactForm({ contact }: ContactFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: contact?.phone || "",
    address: contact?.address || "",
    addressEn: contact?.addressEn || "",
    businessHours: contact?.businessHours || "",
    businessHoursEn: contact?.businessHoursEn || "",
    facebookUrl: contact?.facebookUrl || "",
    zaloUrl: contact?.zaloUrl || "",
    instagramUrl: contact?.instagramUrl || "",
    status: contact?.status || "ACTIVE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save contact information");
      }

      toast({
        title: "Success",
        description: "Contact information updated successfully",
      });

      router.refresh();
    } catch (error) {
      console.error("Error saving contact:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save contact information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Vietnamese Content */}
      <Card className="border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Thông tin liên hệ (Tiếng Việt)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium">
                Số điện thoại
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("phone", e.target.value)
                }
                placeholder="0901 430 077"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium">
                Trạng thái
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium">
              Địa chỉ
            </label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("address", e.target.value)
              }
              placeholder="327 đường Nguyễn Trọng Tuyển, Phường 10, Quận Phú Nhuận, TP.HCM"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="businessHours"
              className="block text-sm font-medium"
            >
              Giờ mở cửa
            </label>
            <Textarea
              id="businessHours"
              value={formData.businessHours}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("businessHours", e.target.value)
              }
              placeholder="Thứ 2 - Thứ 7: 8h00 - 19h00&#10;Chủ nhật: 8h00 - 18h00"
              rows={3}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* English Content */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <MapPin className="h-5 w-5" />
            Contact Information (English) - Optional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="addressEn" className="block text-sm font-medium">
              Address (English)
            </label>
            <Textarea
              id="addressEn"
              value={formData.addressEn}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("addressEn", e.target.value)
              }
              placeholder="327 Nguyen Trong Tuyen Street, Ward 10, Phu Nhuan District, Ho Chi Minh City"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="businessHoursEn"
              className="block text-sm font-medium"
            >
              Business Hours (English)
            </label>
            <Textarea
              id="businessHoursEn"
              value={formData.businessHoursEn}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange("businessHoursEn", e.target.value)
              }
              placeholder="Monday - Saturday: 8:00 AM - 7:00 PM&#10;Sunday: 8:00 AM - 6:00 PM"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card className="border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5" />
            Liên kết mạng xã hội
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="facebookUrl"
                className="block text-sm font-medium"
              >
                Facebook URL
              </label>
              <Input
                id="facebookUrl"
                type="url"
                value={formData.facebookUrl}
                onChange={(e) =>
                  handleInputChange("facebookUrl", e.target.value)
                }
                placeholder="https://www.facebook.com/htcwellness/"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="zaloUrl" className="block text-sm font-medium">
                Zalo URL
              </label>
              <Input
                id="zaloUrl"
                type="url"
                value={formData.zaloUrl}
                onChange={(e) => handleInputChange("zaloUrl", e.target.value)}
                placeholder="https://zalo.me/0901430077"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="instagramUrl"
                className="block text-sm font-medium"
              >
                Instagram URL
              </label>
              <Input
                id="instagramUrl"
                type="url"
                value={formData.instagramUrl}
                onChange={(e) =>
                  handleInputChange("instagramUrl", e.target.value)
                }
                placeholder="https://www.instagram.com/healthcaretherapycenter/"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex justify-end gap-4">
        <Button
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {contact ? "Cập nhật thông tin" : "Lưu thông tin"}
        </Button>
      </div>
    </form>
  );
}
