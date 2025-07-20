"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/router";
import EquipmentForm from "../equipment-form";

export default function NewEquipmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("/api/equipment", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Check for specific error messages
        if (data.error && data.error.includes("Maximum limit of 30 equipment items")) {
          setError(data.error);
        } else {
          setError(data.error || "Failed to create equipment");
        }
        throw new Error(data.error || "Failed to create equipment");
      }
      
      router.push(ROUTES.ADMIN_EQUIPMENT);
    } catch (err: any) {
      console.error("Error creating equipment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-slate-900">Add New Equipment</h1>
          </div>
          <p className="text-slate-500">Create a new equipment item with bilingual content.</p>
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
          submitButtonText="Create Equipment"
        />
      </div>
    </div>
  );
} 