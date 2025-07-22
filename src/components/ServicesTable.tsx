"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ServiceTableRow from "@/components/ServiceTableRow";
import { LANGUAGE_OPTIONS } from "@/utils/common";
import { getLocalizedServiceContent } from "@/utils/services";

interface Service {
  id: string;
  title: string;
  slug: string;
  status: string;
  showOnHomepage: boolean;
  createdAt: Date | string;
  updatedAt: Date | string; // not optional
  shortDescription: string;
  featureImage?: {
    id: string;
    url: string;
    fileName?: string | null;
    originalName?: string | null;
  } | null;
}

interface ServicesTableProps {
  services: Service[];
}

export default function ServicesTable({ services }: ServicesTableProps) {
  const router = useRouter();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [localServices, setLocalServices] = useState<Service[]>(services);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("vi");
  
  // Update local services when props change
  useEffect(() => {
    setLocalServices(services);
  }, [services]);

  const handleServiceDeleted = () => {
    router.refresh();
  };

  const handleStatusChange = async (serviceId: string, newStatus: string) => {
    setUpdatingStatus(serviceId);

    try {
      console.log(`Updating service ${serviceId} to status ${newStatus}`);

      // Call actual service status update API
      const response = await fetch(`/api/services/${serviceId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
        cache: "no-store",
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // Update the local state immediately
      setLocalServices((prev) =>
        prev.map((service) =>
          service.id === serviceId ? { ...service, status: newStatus } : service
        )
      );

      toast.success("Status updated successfully");
  
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        `Failed to update status: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Client-side date formatting function
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-md shadow overflow-x-auto">
      <div className="flex items-center justify-end p-4">
        <label className="mr-2 text-sm font-medium">Language:</label>
        <select
          className="px-2 py-1 text-sm border rounded"
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
        >
          {LANGUAGE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="shadow border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Homepage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {localServices.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No services found
                </td>
              </tr>
            ) : (
              localServices.map((service) => {

                return (
                  <ServiceTableRow
                    loading={!!updatingStatus}
                    key={`${service.id}-${service.status}`}
                    service={service as Service}
                    formatDate={formatDate}
                    onServiceDeleted={handleServiceDeleted}
                    onStatusChange={handleStatusChange}
                    selectedLanguage={selectedLanguage}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
