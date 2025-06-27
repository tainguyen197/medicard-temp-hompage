"use client";

import Link from "next/link";
import Image from "next/image";
import { EditIcon, TrashIcon } from "lucide-react";
import { ROUTES } from "@/lib/router";

type TeamMember = {
  id: string;
  name: string;
  nameEn: string | null;
  title: string;
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  order: number;
  status: string;
  createdAt: Date;
  image: {
    id: string;
    url: string;
    fileName: string | null;
  } | null;
  imageEn: {
    id: string;
    url: string;
    fileName: string | null;
  } | null;
};

interface TeamTableProps {
  teamMembers: TeamMember[];
}

export default function TeamTable({ teamMembers }: TeamTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white rounded-md shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
              Photo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description Preview
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {teamMembers.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No doctors found.{" "}
                <Link
                  href={`${ROUTES.ADMIN_TEAM}/new`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Create your first doctor
                </Link>
              </td>
            </tr>
          ) : (
            teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                    {member.image ? (
                      <Image
                        src={member.image.url}
                        alt={member.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                        No photo
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {member.name}
                    </div>
                    {member.nameEn && (
                      <div className="text-sm text-gray-500">
                        EN: {member.nameEn}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm text-gray-900">{member.title}</div>
                    {member.titleEn && (
                      <div className="text-xs text-gray-500">
                        EN: {member.titleEn}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm text-gray-900">
                      {truncateText(member.description)}
                    </div>
                    {member.descriptionEn && (
                      <div className="text-xs text-gray-500 mt-1">
                        EN: {truncateText(member.descriptionEn)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      member.status
                    )}`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Link
                    href={`${ROUTES.ADMIN_TEAM}/${member.id}/edit`}
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center px-2 py-1 rounded"
                  >
                    <EditIcon size={16} className="mr-1" />
                    Edit
                  </Link>
                  <button className="text-red-600 hover:text-red-900 inline-flex items-center px-2 py-1 rounded">
                    <TrashIcon size={16} className="mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
