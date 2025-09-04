import { redirect } from "next/navigation";
import TeamMemberForm from "@/components/TeamMemberForm";

export default async function NewTeamMemberPage() {
  // SSR redirects can be added if needed; client guard handles auth/role

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Team Member</h1>
        <p className="text-gray-600 mt-2">
          Create a new team member profile with support for Vietnamese and
          English languages.
        </p>
      </div>

      <TeamMemberForm />
    </div>
  );
}
