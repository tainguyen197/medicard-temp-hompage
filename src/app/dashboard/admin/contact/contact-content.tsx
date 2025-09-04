import { redirect } from "next/navigation";
// Fetch via Nest API instead of DB/session
import ContactForm from "@/components/ContactForm";

async function getContact() {
  const res = await fetch(`/api/contact`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function ContactContent() {
  const contact = await getContact();

  return (
    <div className="max-w-4xl ">
      <ContactForm contact={contact} />
    </div>
  );
}
