import { redirect, notFound } from "next/navigation";
// Removed direct DB access
import TeamMemberForm from "@/components/TeamMemberForm";

interface EditTeamMemberPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTeamMemberPage({
  params,
}: EditTeamMemberPageProps) {
  const { id } = await params;

  // Fetch team member from Nest API
  const res = await fetch(`/api/team/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    notFound();
  }
  const teamMember = await res.json();

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
