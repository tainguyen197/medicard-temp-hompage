import { Suspense } from "react";
import ContactContent from "./contact-content";
import { Loader2 } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Contact Information
          </h1>
          <p className="text-muted-foreground">
            Manage footer contact information including phone, address, business
            hours, and social media links.
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <ContactContent />
      </Suspense>
    </div>
  );
}
