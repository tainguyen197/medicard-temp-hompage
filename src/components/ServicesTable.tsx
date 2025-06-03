"use client";

import { useRouter } from "next/navigation";
import ServiceTableRow from "@/components/ServiceTableRow";

interface Service {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: Date | string;
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

  const handleServiceDeleted = () => {
    router.refresh();
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
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
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
            {services.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No services found
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <ServiceTableRow
                  key={service.id}
                  service={service}
                  formatDate={formatDate}
                  onServiceDeleted={handleServiceDeleted}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
