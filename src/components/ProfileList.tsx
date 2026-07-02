import type { Platform, UserProfileSummary } from "@/types";
import { SearchX } from "lucide-react";
import { ProfileCard } from "./ProfileCard";

interface Props {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export function ProfileList({ profiles, platform }: Props) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="surface-panel rounded-cards p-8 sm:p-10 max-w-md flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white/[0.08] flex items-center justify-center mb-5">
            <SearchX size={34} className="text-light-blue/60" />
          </div>
          <h3 className="text-2xl font-extrabold text-off-white mb-3">No profiles found</h3>
          <p className="text-muted-white leading-relaxed">Try a different creator name, username, or platform.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {profiles.map((profile) => (
        <ProfileCard key={profile.user_id} profile={profile} platform={platform} />
      ))}
    </div>
  );
}
