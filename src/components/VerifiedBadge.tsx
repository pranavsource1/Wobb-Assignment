import { Check } from "lucide-react";

export function VerifiedBadge({ verified }: { verified?: boolean }) {
  if (!verified) return null;
  return (
    <div className="verified-badge" aria-label="Verified profile">
      <Check size={12} strokeWidth={4} />
    </div>
  );
}
