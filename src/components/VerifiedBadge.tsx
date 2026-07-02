import { Check } from "lucide-react";

export function VerifiedBadge({ verified }: { verified?: boolean }) {
  if (!verified) return null;
  return (
    <div className="w-5 h-5 rounded-full bg-accent-mint text-primary-dark flex items-center justify-center shrink-0 shadow-sm" aria-label="Verified profile">
      <Check size={12} strokeWidth={4} />
    </div>
  );
}
