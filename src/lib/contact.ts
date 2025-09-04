// Removed direct DB access
import { ContactData } from "@/types/contact";
import { buildApiUrl } from "@/lib/api-utils";

export async function getContactData(): Promise<ContactData | null> {
  console.log("getContactData");
  try {
    const url = buildApiUrl('/api/contact');
    const res = await fetch(url, { cache: 'no-store', next: { revalidate: 0 } });
    console.log("res.status", res.status);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return null;
  }
}

/**
 * Get the appointment link from the database
 * Returns default link if no appointment link is configured
 */
export async function getAppointmentLink(): Promise<string> {
  try {
    const url = buildApiUrl('/api/contact');
    const res = await fetch(url, { cache: 'no-store', next: { revalidate: 0 } });
    if (!res.ok) return "";
    const contact = await res.json();
    return (contact as any)?.appointmentLink || "";
  } catch (error) {
    console.error("Error fetching appointment link:", error);
    return "";
  }
}

/**
 * Get the email from the database
 * Returns default email if no email is configured
 */
export async function getContactEmail(): Promise<string> {
  try {
    const url = buildApiUrl('/api/contact');
    const res = await fetch(url, { cache: 'no-store', next: { revalidate: 0 } });
    if (!res.ok) return "";
    const contact = await res.json();
    return (contact as any)?.email || "";
  } catch (error) {
    console.error("Error fetching contact email:", error);
    return "";
  }
}

/**
 * Get complete contact information
 */
export async function getContactInfo() {
  try {
    const url = buildApiUrl('/api/contact');
    const res = await fetch(url, { cache: 'no-store', next: { revalidate: 0 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching contact information:", error);
    return null;
  }
}
