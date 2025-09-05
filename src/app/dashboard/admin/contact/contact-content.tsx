"use client";

import { useEffect, useState } from "react";
// Fetch via Nest API instead of DB/session
import ContactForm from "@/components/ContactForm";
import { authFetch } from "@/lib/auth-fetch";

export default function ContactContent() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await authFetch(`/api/contact`);
        if (!res.ok) {
          setError("Failed to load contact information");
          return;
        }
        const data = await res.json();
        setContact(data);
      } catch (err) {
        setError("Failed to load contact information");
        console.error("Error fetching contact:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Loading contact information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <div className="text-red-600 mb-2">Error</div>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl ">
      <ContactForm contact={contact} />
    </div>
  );
}
