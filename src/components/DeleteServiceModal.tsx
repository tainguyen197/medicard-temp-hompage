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

interface Service {
  id: string;
  title: string;
}

interface DeleteServiceModalProps {
  service: Service;
  children: React.ReactNode;
  onServiceDeleted?: () => void;
}

export default function DeleteServiceModal({
  service,
  children,
  onServiceDeleted,
}: DeleteServiceModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete service");
      }

      toast.success("Service deleted successfully");
      setIsOpen(false);

      if (onServiceDeleted) {
        onServiceDeleted();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service"
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
            <DialogTitle className="text-xl font-bold">
              Delete Service
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to delete the service &quot;{service.title}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-md my-4">
          <div className="mb-2">
            <span className="font-medium">Title:</span> {service.title}
          </div>
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
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
