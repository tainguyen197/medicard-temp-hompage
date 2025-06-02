"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarIcon, UserIcon, EyeIcon, ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function PostPreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<any>(null);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const postData = await response.json();
        setPost(postData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post");
        router.push("/admin/posts");
      }
    };

    fetchPost();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto py-4 px-4 sm:px-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/admin/posts/${id}`)}
                className="flex items-center gap-1"
              >
                <ArrowLeftIcon size={16} />
                Back to Edit
              </Button>
              <span className="text-gray-500">|</span>
              <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                Preview Mode
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/posts")}
              >
                All Posts
              </Button>
              {post.status !== "PUBLISHED" && (
                <Button
                  size="sm"
                  onClick={() => {
                    // This would typically handle quick publishing logic
                    toast.info("Publishing feature would go here");
                  }}
                >
                  Publish Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-0">
        {post.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-md">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8">
          <div className="flex items-center gap-1">
            <CalendarIcon size={16} />
            <span>
              {formatDate(post.publishedAt || post.updatedAt || post.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <UserIcon size={16} />
            <span>{post.author?.name || "Unknown Author"}</span>
          </div>
          {post.categories && post.categories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {post.categories.map((pc: any) => (
                <span
                  key={pc.category.id}
                  className="bg-gray-100 px-2 py-1 rounded-full text-xs"
                >
                  {pc.category.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {post.excerpt && (
          <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-8 italic">
            {post.excerpt}
          </div>
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="border-t mt-12 pt-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Status:{" "}
              <span className="font-medium">
                {post.status.replace("_", " ")}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/posts/${id}`)}
              className="flex items-center gap-1"
            >
              <EyeIcon size={16} />
              Edit Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
