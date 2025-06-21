import Link from "next/link";
import { ROUTES } from "@/lib/router";

export default function TeamMemberNotFound() {
  return (
    <div className="container mx-auto py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Team Member Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The team member you are looking for does not exist or may have been
          deleted.
        </p>
        <div className="space-x-4">
          <Link
            href={ROUTES.ADMIN_TEAM}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md inline-block transition-colors"
          >
            Back to Team Members
          </Link>
          <Link
            href={`${ROUTES.ADMIN_TEAM}/new`}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md inline-block transition-colors"
          >
            Add New Team Member
          </Link>
        </div>
      </div>
    </div>
  );
}
