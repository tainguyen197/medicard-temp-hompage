import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TeamMemberForm from "@/components/TeamMemberForm";

export default async function NewTeamMemberPage() {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Check if user has admin or editor role
  if (!["ADMIN", "EDITOR"].includes(session.user.role)) {
    redirect("/");
  }

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
