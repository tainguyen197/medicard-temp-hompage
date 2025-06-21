import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/ContactForm";

async function getContact() {
  try {
    const contact = await prisma.contact.findFirst({
      orderBy: { createdAt: "desc" },
    });
    return contact;
  } catch (error) {
    console.error("Error fetching contact:", error);
    return null;
  }
}

export default async function ContactContent() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Check if user has permission (ADMIN or EDITOR)
  if (!["ADMIN", "EDITOR"].includes(session.user.role)) {
    redirect("/");
  }

  const contact = await getContact();

  return (
    <div className="max-w-4xl ">
      <ContactForm contact={contact} />
    </div>
  );
}
