import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import TeamMemberForm from "@/components/TeamMemberForm";

interface EditTeamMemberPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTeamMemberPage({
  params,
}: EditTeamMemberPageProps) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Check if user has admin or editor role
  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
    redirect("/");
  }

  const { id } = await params;

  // Fetch team member
  const teamMember = await prisma.teamMember.findUnique({
    where: { id },
    include: {
      image: true,
      imageEn: true,
    },
  });

  if (!teamMember) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Team Member</h1>
        <p className="text-gray-600 mt-2">
          Update {teamMember.name}'s profile information.
        </p>
      </div>

      <TeamMemberForm
        initialData={{
          name: teamMember.name,
          nameEn: teamMember.nameEn || "",
          title: teamMember.title,
          titleEn: teamMember.titleEn || "",
          description: teamMember.description,
          descriptionEn: teamMember.descriptionEn || "",
          order: teamMember.order,
          status: teamMember.status as "ACTIVE" | "INACTIVE",
          existingImageUrl: teamMember.image?.url || "",
          existingImageEnUrl: teamMember.imageEn?.url || "",
        }}
        teamMemberId={teamMember.id}
        isEdit={true}
      />
    </div>
  );
}
