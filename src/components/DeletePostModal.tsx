"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Post {
  id: string;
  title: string;
  status: string;
  author?: {
    name?: string | null;
  };
}

interface DeletePostModalProps {
  post: Post;
  children: React.ReactNode;
  onPostDeleted?: () => void;
}

export default function DeletePostModal({
  post,
  children,
  onPostDeleted,
}: DeletePostModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete post");
      }

      toast.success("Post deleted successfully!");
      setIsOpen(false);

      // Call the callback if provided, otherwise refresh the page
      if (onPostDeleted) {
        onPostDeleted();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center mb-2">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold">Delete Post</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to delete the post &quot;{post.title}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-md my-4">
          <div className="mb-2">
            <span className="font-medium">Title:</span> {post.title}
          </div>
          <div className="mb-2">
            <span className="font-medium">Status:</span>{" "}
            {post.status?.replace("_", " ")}
          </div>
          {post.author?.name && (
            <div>
              <span className="font-medium">Author:</span> {post.author.name}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            className=" cursor-pointer"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white  cursor-pointer"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
