"use client";

import Link from "next/link";
import DeleteServiceModal from "./DeleteServiceModal";

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

interface ServiceTableRowProps {
  service: Service;
  formatDate: (date: Date | string) => string;
  onServiceDeleted?: () => void;
}

export default function ServiceTableRow({
  service,
  formatDate,
  onServiceDeleted,
}: ServiceTableRowProps) {
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      PUBLISHED: "bg-green-100 text-green-800",
      DRAFT: "bg-yellow-100 text-yellow-800",
      ARCHIVED: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusStyles[status as keyof typeof statusStyles] ||
          statusStyles.DRAFT
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <tr key={service.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <div className="flex items-center justify-center">
          {service.featureImage ? (
            <div className="w-16 aspect-[270/200] relative rounded-md overflow-hidden">
              <img
                src={service.featureImage.url}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 aspect-[270/200] bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">
              No image
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {service.title}
          </div>
          <div className="text-sm text-gray-500">/services/{service.slug}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">
        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
          {service.slug}
        </code>
      </td>
      <td className="px-6 py-4 whitespace-nowrap align-middle">
        {getStatusBadge(service.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">
        {formatDate(service.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-middle">
        <Link
          href={`/dashboard/admin/services/${service.id}`}
          className="text-blue-600 hover:text-blue-900 mr-4"
        >
          Edit
        </Link>
        <Link
          href={`/services/${service.slug}`}
          target="_blank"
          className="text-gray-600 hover:text-gray-900 mr-4"
        >
          View
        </Link>
        <DeleteServiceModal
          service={{
            id: service.id,
            title: service.title,
          }}
          onServiceDeleted={onServiceDeleted}
        >
          <button className="text-red-600 hover:text-red-900">Delete</button>
        </DeleteServiceModal>
      </td>
    </tr>
  );
}
