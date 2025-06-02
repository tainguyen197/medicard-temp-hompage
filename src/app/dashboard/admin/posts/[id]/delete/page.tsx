"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DeletePostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete post");
      }

      toast.success("Post deleted successfully!");
      router.push("/admin/posts");
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post"
      );
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Delete Post</h1>
          <p className="text-gray-600">
            Are you sure you want to delete the post "{post?.title}"? This
            action cannot be undone.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="mb-2">
            <span className="font-medium">Title:</span> {post?.title}
          </div>
          <div className="mb-2">
            <span className="font-medium">Status:</span>{" "}
            {post?.status?.replace("_", " ")}
          </div>
          <div>
            <span className="font-medium">URL:</span> /blog/{post?.slug}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/posts/${id}`)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}
