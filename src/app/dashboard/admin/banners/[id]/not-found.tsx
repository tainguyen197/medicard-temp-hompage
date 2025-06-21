import Link from "next/link";
import { ROUTES } from "@/lib/router";

export default function NotFound() {
  return (
    <div className="container mx-auto p-8">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Banner not found
        </h2>
        <p className="text-gray-600 mb-6">
          The banner you're looking for doesn't exist or has been deleted.
        </p>
        <Link
          href={ROUTES.ADMIN_BANNERS}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Back to Banners
        </Link>
      </div>
    </div>
  );
}
