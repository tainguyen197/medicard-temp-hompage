"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { ROUTES } from "@/lib/router";
import EquipmentTable from "./equipment-content";
import { authFetch } from "@/lib/auth-fetch";

export default function EquipmentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipmentItems, setEquipmentItems] = useState([]);
  
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await authFetch("/api/equipment");
        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }
        const data = await response.json();
        setEquipmentItems(data.equipment || []);
      } catch (err) {
        console.error("Error fetching equipment:", err);
        setError("Failed to load equipment data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEquipment();
  }, []);
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">Equipment</h1>
          <div className="animate-pulse bg-slate-200 h-10 w-32 rounded-lg"></div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-48"></div>
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                </div>
                <div className="h-10 w-24 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">Equipment</h1>
          <Link
            href={ROUTES.ADMIN_EQUIPMENT + "/new"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Equipment</span>
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-red-600 mb-2">Error</div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Equipment</h1>
        <Link
          href={ROUTES.ADMIN_EQUIPMENT + "/new"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Equipment</span>
        </Link>
      </div>
      
      <EquipmentTable equipment={equipmentItems} />
    </div>
  );
} 