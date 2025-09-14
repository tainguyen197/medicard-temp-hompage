
'use client';

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import TeamMemberForm from "@/components/TeamMemberForm";
import { authFetch } from "@/lib/auth-fetch";

interface EditTeamMemberPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTeamMemberPage({
  params,
}: EditTeamMemberPageProps) {
  const [teamMember, setTeamMember] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchTeamMember() {
      try {
        const { id } = await params;
        const res = await authFetch(`/api/team/${id}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setTeamMember(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamMember();
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !teamMember) {
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
