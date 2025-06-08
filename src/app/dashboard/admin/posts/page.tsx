import Link from "next/link";
import { Suspense } from "react";
import { PlusIcon } from "lucide-react";

import { ROUTES } from "@/lib/router";
import PostsLoading from "./loading";
import PostsContent from "./posts-content";

type SearchParams = {
  page?: string;
  limit?: string;
  status?: string;
  categoryId?: string;
  search?: string;
  featured?: string;
};

export default function PostsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">News</h1>

        <Link
          href={ROUTES.ADMIN_POSTS_NEW}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <PlusIcon size={16} />
          New News
        </Link>
      </div>

      <Suspense fallback={<PostsLoading />}>
        <PostsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
