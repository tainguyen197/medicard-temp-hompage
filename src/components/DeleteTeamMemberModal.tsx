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

interface TeamMember {
  id: string;
  name: string;
}

interface DeleteTeamMemberModalProps {
  teamMember: TeamMember;
  children: React.ReactNode;
  onTeamMemberDeleted?: () => void;
}

export default function DeleteTeamMemberModal({
  teamMember,
  children,
  onTeamMemberDeleted,
}: DeleteTeamMemberModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/team/${teamMember.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete team member");
      }

      toast.success("Team member deleted successfully");
      setIsOpen(false);
      router.refresh();

      if (onTeamMemberDeleted) {
        onTeamMemberDeleted();
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete team member"
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
              Delete Team Member
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to delete the team member &quot;
              {teamMember.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-md my-4">
          <div className="mb-2">
            <span className="font-medium">Name:</span> {teamMember.name}
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
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
