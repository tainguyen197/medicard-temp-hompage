"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/router";
import EquipmentForm from "../equipment-form";
import { toast } from "sonner";
import { authFetch } from "@/lib/auth-fetch";

interface EquipmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditEquipmentPage({ params }: EquipmentPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<any>(null);


  useEffect(() => {
    const fetchEquipment = async () => {
      const { id } = await params;
      try {
        const response = await authFetch(`/api/equipment/${id}`, {
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }
        
        const data = await response.json();
        setEquipment(data);
      } catch (err) {
        console.error("Error fetching equipment:", err);
        setError("Failed to load equipment data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEquipment();
  }, [params]);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setError(null);
    const { id } = await params;
    try {
      const response = await authFetch(`/api/equipment/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        setIsSubmitting(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update equipment");
      }
      toast.success("Equipment updated successfully!");
      router.push(ROUTES.ADMIN_EQUIPMENT);
    } catch (err: any) {
      setIsSubmitting(false);
      console.error("Error updating equipment:", err);
      setError(err.message || "Failed to update equipment. Please try again.");
    } finally {
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !equipment) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-2">
          <Link
            href={ROUTES.ADMIN_EQUIPMENT}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Edit Equipment</h1>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Link
              href={ROUTES.ADMIN_EQUIPMENT}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Edit Equipment</h1>
          </div>
          <p className="text-slate-500">Update equipment information with bilingual content.</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <EquipmentForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          submitButtonText="Update Equipment"
          initialData={equipment}
        />
      </div>
    </div>
  );
} 